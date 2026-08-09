const axios = require('axios');

/**
 * Google Places data pipeline (Explore Destinations flow).
 *
 * User requirement:
 *   Search "Chennai" --> Google Places API --> place results
 *   --> photo references for each place --> Google Place Photos API
 *   --> actual image of that place --> display in Explore Destinations cards.
 *
 * Mapping:
 *   BACKEND (this service)
 *     1. searchText()            - Places API (New) text search; returns place
 *                                  results incl. photo refs (field mask places.photos)
 *     2. getPlacePhotos()        - for places missing a photo, fetch the photo
 *                                  reference via Place Details (New)
 *     3. generatePhotoUrl()      - builds the backend photo-proxy URL
 *                                  (GET /api/places/photo), which fetches the
 *                                  Google media server-side and caches on Cloudinary
 *     4. enrichWithPhotos()      - fills image URLs into every result
 *     5. isPhotosAvailable()     - probes once and caches whether the project's
 *                                  key returns photo data (refreshed every 10 min),
 *                                  so the enrichment only runs when it can succeed
 *   PHOTO PROXY (src/routes/placePhotoRoutes.js)
 *     - GET /api/places/photo?name=<photo.name> fetches the image from Google
 *       with the API key held server-side (never exposed to the browser),
 *       uploads it to Cloudinary once, then serves it from the CDN.
 *   FRONTEND (src/app/city-search/page.tsx - "Explore Destinations")
 *     1. GET /api/trips/recommendations?location=Chennai  (or ?location=world for default)
 *     2. Each place object's `image` field (backend photo-proxy URL, else curated fallback)
 *        is rendered on the destination card <img>
 *     3. onError swaps to a curated fallback if a photo fails to load.
 *
 * Note: Google only returns photo data when billing is enabled on the Cloud
 * project and the API key is allowed to serve images to the backend origin.
 */
class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    this.searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    this.detailsUrl = (placeId) => `https://places.googleapis.com/v1/places/${placeId}`;
    this.photoUrl = 'https://places.googleapis.com/v1';
    this.fieldMask =
      'places.id,places.displayName,places.formattedAddress,places.rating,places.types,places.photos,places.location,places.priceLevel,places.userRatingCount';

    // Cached result of whether the project's key returns photo data (probed lazily).
    this.photosAvailable = undefined;
    this.photosProbePromise = null;

    if (!this.apiKey) {
      console.warn('[GooglePlaces] No API key found. Set GOOGLE_PLACES_API_KEY in backend/.env to enable live data.');
    }
  }

  /**
   * Probes whether Google returns photo data for this project's API key.
   * Result is cached (refreshed every 10 minutes) so the photo enrichment
   * pipeline auto-activates once the project starts returning photos.
   * @returns {Promise<boolean>}
   */
  async isPhotosAvailable() {
    if (this.photosAvailable !== undefined) return this.photosAvailable;
    if (this.photosProbePromise) return this.photosProbePromise;

    this.photosProbePromise = (async () => {
      try {
        const places = await this.searchText('Eiffel Tower Paris');
        return places.some((p) => Array.isArray(p.photos) && p.photos.length > 0);
      } catch {
        return false;
      }
    })()
      .then((available) => {
        this.photosAvailable = available;
        this.photosProbePromise = null;
        setTimeout(() => {
          this.photosAvailable = undefined;
        }, 10 * 60 * 1000).unref();
        return available;
      });

    return this.photosProbePromise;
  }

  /**
   * Fetches a single place's photo reference via Place Details (New) and
   * returns a ready-to-display Google media URL, or null if unavailable.
   * @param {string} placeId
   * @param {number} maxWidth
   * @returns {Promise<string|null>}
   */
  async getPlacePhotos(placeId, maxWidth = 1200) {
    if (!placeId) return null;
    try {
      const response = await axios.get(this.detailsUrl(placeId), {
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'id,photos',
        },
      });
      const photo = response.data.photos?.[0];
      return photo ? this.generatePhotoUrl(photo.name, '', maxWidth) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Fills in Google photo URLs for places that are missing one, using Place
   * Details photo references. Bounded and concurrent to keep latency low.
   * @param {Array} items
   * @param {number} limit
   * @param {number} concurrency
   * @returns {Promise<Array>}
   */
  async enrichWithPhotos(items, limit = 10, concurrency = 6) {
    const missing = items
      .filter((item) => !item.image || !item.image.includes('places.googleapis.com'))
      .slice(0, limit);
    if (missing.length === 0) return items;

    let cursor = 0;
    const worker = async () => {
      while (cursor < missing.length) {
        const item = missing[cursor++];
        const photo = await this.getPlacePhotos(item.place_id || item.id);
        if (photo) item.image = photo;
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, missing.length) }, worker));
    return items;
  }

  /**
   * Text search against the Places API (New) - returns an array of places.
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchText(query) {
    const response = await axios.post(
      this.searchUrl,
      { textQuery: query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': this.fieldMask,
        },
      }
    );
    return response.data.places || [];
  }

  /**
   * Fetches travel recommendations based on a location
   * @param {string} location - The destination (e.g., "Paris", "Japan")
   * @returns {Promise<Object>} - Grouped recommendations
   */
  async getRecommendations(location) {
    try {
      // If location is 'world', aggregate samples from multiple famous cities for a rich initial view
      const targetLocation = location === 'world' ? 'Paris, Tokyo, Bali, Dubai, London, Rome' : location;
      
      const categories = [
        { type: 'attractions', query: `best tourist places in ${targetLocation}` },
        { type: 'restaurants', query: `top restaurants in ${targetLocation}` },
        { type: 'hotels', query: `best hotels in ${targetLocation}` },
        { type: 'activities', query: `popular activities in ${targetLocation}` }
      ];

      const results = {};
      const photosEnabled = await this.isPhotosAvailable();

      // Fetch for each category in parallel
      await Promise.all(categories.map(async (cat) => {
        const places = await this.searchText(cat.query);
        const formatted = this.formatResults(places);
        results[cat.type] = photosEnabled ? await this.enrichWithPhotos(formatted, 10, 6) : formatted;
      }));

      return results;
    } catch (error) {
      console.error('Google Places API Error:', error.message);
      // No mock data. On API failure return empty categories so the UI shows its
      // "no results" state instead of fabricated places.
      return { attractions: [], restaurants: [], hotels: [], activities: [] };
    }
  }

  async getCityImage(city) {
    try {
      const places = await this.searchText(city);
      const place = places[0];
      if (place && place.photos && place.photos.length > 0) {
        return this.generatePhotoUrl(place.photos[0].name, place.displayName?.text || city, 1600);
      }
      if (place && (await this.isPhotosAvailable())) {
        return await this.getPlacePhotos(place.id, 1600);
      }
      return null;
    } catch (error) {
      console.error('City Image Fetch Error:', error.message);
      return null;
    }
  }

  /**
   * Search for places in a city with higher volume (Targeting 50+ results)
   */
  async searchCities(query) {
    try {
      // Perform multiple searches to aggregate enough data
      const categories = [
        `top tourist attractions in ${query}`,
        `best restaurants in ${query}`,
        `famous cafes and hidden gems in ${query}`
      ];

      const responses = await Promise.all(categories.map((q) => this.searchText(q)));
      
      // Flatten and deduplicate results by place_id
      const allResults = responses.flat();
      const uniqueResults = Array.from(new Map(allResults.map((place) => [place.id, place])).values());

      let mapped = uniqueResults.map(place => ({
        id: place.id,
        name: place.displayName?.text || 'Unknown',
        location: place.formattedAddress,
        image: this.generatePhotoUrl(place.photos?.[0]?.name, place.displayName?.text),
        rating: place.rating || 0,
        price: this.formatPrice(place.priceLevel),
        category: place.types?.[0] ? place.types[0].replace(/_/g, ' ') : "Destination",
        tag: (place.rating || 0) > 4.5 ? "Top Rated" : "Verified",
        desc: `Explore the beautiful ${place.displayName?.text || query}. ${place.formattedAddress}`,
        highlights: place.types ? place.types.slice(0, 3).map(t => t.replace(/_/g, ' ')) : []
      }));

      if (await this.isPhotosAvailable()) {
        mapped = await this.enrichWithPhotos(mapped, 15, 6);
      }

      return mapped;
    } catch (error) {
      console.error('Google Search Cities Error:', error.response?.data || error.message);
      // No mock data. On API failure return an empty list so the UI shows its
      // "no results" state instead of fabricated places.
      return [];
    }
  }

  /**
   * Formats Places API (New) results into clean data
   * @param {Array} places
   */
  formatResults(places) {
    return places.slice(0, 20).map(place => ({
      place_id: place.id,
      name: place.displayName?.text || 'Unknown',
      rating: place.rating || 0,
      address: place.formattedAddress,
      type: place.types,
      coordinates: place.location || null,
      image: this.generatePhotoUrl(place.photos?.[0]?.name, place.displayName?.text),
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text || '')}&query_place_id=${place.id}`
    }));
  }

  /**
   * Maps the Places API price level enum to a rupee indicator
   */
  formatPrice(priceLevel) {
    const levels = {
      PRICE_LEVEL_FREE: 'Free',
      PRICE_LEVEL_INEXPENSIVE: '₹₹',
      PRICE_LEVEL_MODERATE: '₹₹₹',
      PRICE_LEVEL_EXPENSIVE: '₹₹₹₹',
      PRICE_LEVEL_VERY_EXPENSIVE: '₹₹₹₹₹',
    };
    if (!priceLevel) return '₹1,200';
    return levels[priceLevel] || '₹1,200';
  }

  /**
   * Generates a working URL for a place photo or a varied high-quality fallback
   */
  generatePhotoUrl(reference, placeName = "", maxWidth = 1200) {
    if (reference) {
      // Serve through the backend photo proxy (which caches on Cloudinary).
      // The Google API key stays server-side and never reaches the browser.
      const base = process.env.PUBLIC_BACKEND_URL || 'http://localhost:5001';
      return `${base}/api/places/photo?name=${encodeURIComponent(reference)}&max=${maxWidth}`;
    }
    
    // Fallback: A curated set of high-quality cinematic travel images for variety
    const fallbacks = [
      "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3", // Tiger's Nest, Bhutan
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", // Thailand Boat
      "https://images.unsplash.com/photo-1528127269322-539801943592", // Golden Bridge, Vietnam
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Mountains
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", // Lake/Boat
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // Sunset
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4", // Venice
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", // Asia/Temple
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", // Road trip
      "https://images.unsplash.com/photo-1500835595333-7221d600645a"  // Beach
    ];

    // Use place name to consistently pick one of the 10 fallbacks
    const hash = placeName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selected = fallbacks[hash % fallbacks.length];
    
    return `${selected}?q=80&w=1200&auto=format&fit=crop`;
  }
}

module.exports = new GooglePlacesService();
