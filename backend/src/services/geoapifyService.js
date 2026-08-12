const axios = require('axios');

/**
 * Geoapify data pipeline (Explore Destinations flow).
 *
 * Geoapify (free-tier friendly, no hard daily search cap) replaces the
 * previous Google Places integration:
 *   1. geocode()          - Geoapify Geocoding API: "Chennai" -> lat/lon + bbox
 *   2. searchPlacesByRect()- Geoapify Places API v2: one combined POI query
 *                            (tourism + catering.restaurant + accommodation.hotel)
 *                            filtered by the geocoded bounding box
 *   3. getRecommendations()-> { attractions, restaurants, hotels }
 *   4. searchPlaces()     - per-category POI queries (activities search page)
 *   5. searchCities()     - flat place list for the activities search page
 *
 * Every places query prefers places with internet access for customers
 * (conditions=internet_access.for_customers), falls back to any internet
 * access, then drops the condition, so results always render in the UI.
 * Responses are localized with lang=en.
 *
 * Geoapify does not return photos, so every place gets a deterministic curated
 * image (Unsplash) based on its name, and ratings (when present) are passed
 * through; the frontend renders "N/A" when a rating is missing.
 */
class GeoapifyService {
  constructor() {
    this.apiKey = process.env.GEOAPIFY_API_KEY;
    this.geocodeUrl = 'https://api.geoapify.com/v1/geocode/search';
    this.placesUrl = 'https://api.geoapify.com/v2/places';

    this.categoryDefs = {
      attractions: [
        { cat: 'tourism.sights', label: 'Tourist Attraction' },
        { cat: 'tourism.attraction', label: 'Tourist Attraction' },
      ],
      restaurants: [
        { cat: 'catering.restaurant', label: 'Restaurant' },
        { cat: 'catering.cafe', label: 'Cafe' },
        { cat: 'catering.fast_food', label: 'Fast Food' },
        { cat: 'catering.bar', label: 'Bar' },
        { cat: 'catering.pub', label: 'Pub' },
      ],
      hotels: [
        { cat: 'accommodation.hotel', label: 'Hotel' },
        { cat: 'accommodation.guest_house', label: 'Guest House' },
        { cat: 'accommodation.hostel', label: 'Hostel' },
        { cat: 'accommodation.motel', label: 'Motel' },
      ],
      activities: [
        { cat: 'sport.pitch', label: 'Sports Venue' },
        { cat: 'sport.stadium', label: 'Stadium' },
        { cat: 'sport.sports_centre', label: 'Sports Centre' },
        { cat: 'sport.swimming_pool', label: 'Swimming Pool' },
        { cat: 'sport.track', label: 'Sports Track' },
        { cat: 'entertainment.cinema', label: 'Cinema' },
        { cat: 'leisure.park', label: 'Park' },
        { cat: 'leisure.spa', label: 'Spa' },
      ],
    };

    this.categoryLabels = {
      'tourism.sights': 'Tourist Attraction',
      'tourism.attraction': 'Tourist Attraction',
      'tourism.attraction_point': 'Tourist Attraction',
      'tourism.museum': 'Museum',
      'tourism.gallery': 'Art Gallery',
      'tourism.zoo': 'Zoo',
      'tourism.theme_park': 'Theme Park',
      'tourism.aquarium': 'Aquarium',
      'tourism.viewpoint': 'Viewpoint',
      'catering.restaurant': 'Restaurant',
      'catering.cafe': 'Cafe',
      'catering.fast_food': 'Fast Food',
      'catering.bar': 'Bar',
      'catering.pub': 'Pub',
      'accommodation.hotel': 'Hotel',
      'accommodation.guest_house': 'Guest House',
      'accommodation.hostel': 'Hostel',
      'accommodation.motel': 'Motel',
      'accommodation.apartment': 'Apartment',
    };

    this.fallbackImages = [
      "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
      "https://images.unsplash.com/photo-1528127269322-539801943592",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      "https://images.unsplash.com/photo-1500835595333-7221d600645a",
    ];

    if (!this.apiKey) {
      console.warn('[Geoapify] No API key found. Set GEOAPIFY_API_KEY in backend/.env to enable live data.');
    }
  }

  /**
   * Geocodes a free-text query and returns { lat, lon, name, bbox } or null.
   * @param {string} query
   * @returns {Promise<{lat: number, lon: number, name: string, bbox: Array|null}|null>}
   */
  async geocode(query) {
    if (!this.apiKey) return null;
    const { data } = await axios.get(this.geocodeUrl, {
      params: { text: query, limit: 1, apiKey: this.apiKey },
      timeout: 10000,
    });
    const props = data.features?.[0]?.properties;
    if (!props || typeof props.lat !== 'number') return null;
    return {
      lat: props.lat,
      lon: props.lon,
      name: props.city || props.state || props.formatted,
      bbox: props.bbox || null,
    };
  }

  /**
   * Infers a sensible search radius from the geocoded bounding box.
   * @param {{bbox: Array|null}} geo
   * @returns {number} radius in meters
   */
  guessRadius(geo) {
    if (geo && Array.isArray(geo.bbox) && geo.bbox.length === 4) {
      const [minLon, minLat, maxLon, maxLat] = geo.bbox;
      const latSpan = (maxLat - minLat) * 111320;
      const lonSpan = (maxLon - minLon) * 111320 * Math.cos(((maxLat + minLat) / 2) * (Math.PI / 180));
      const radius = Math.max(latSpan, lonSpan) / 2;
      return Math.min(Math.max(Math.round(radius), 2000), 50000);
    }
    return 30000;
  }

  /**
   * Geoapify Places v2 query with graceful conditions fallback.
   * Tries the exact requested condition (internet_access.for_customers) first,
   * then broadens to any internet access, then drops the condition entirely.
   * A tier is accepted only when it returns at least MIN_RESULTS, so areas with
   * sparse OSM internet_access tags still get a full result set rendered.
   * @param {Object} params query params (without `conditions`)
   * @returns {Promise<Array>} raw Geoapify features
   */
  async fetchPlaces(params) {
    const conditionTiers = ['internet_access.for_customers', 'internet_access', null];
    const minResults = 5;
    for (const conditions of conditionTiers) {
      const query = { ...params };
      if (conditions) query.conditions = conditions;
      else delete query.conditions;
      const { data } = await axios.get(this.placesUrl, { params: query, timeout: 15000 });
      const features = (data.features || []).filter((feature) => feature.properties?.name);
      if (features.length >= minResults) return features;
    }
    return [];
  }

  /**
   * Queries Geoapify Places API for a single category around a location.
   * @param {string} location
   * @param {string} categoryKey
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async searchPlaces(location, categoryKey, limit = 20) {
    const defs = this.categoryDefs[categoryKey];
    if (!defs) return [];
    const geo = await this.geocode(location);
    if (!geo) return [];
    const features = await this.fetchPlaces({
      categories: defs.map((d) => d.cat).join(','),
      filter: `circle:${geo.lon},${geo.lat},${this.guessRadius(geo)}`,
      bias: `proximity:${geo.lon},${geo.lat}`,
      lang: 'en',
      limit,
      apiKey: this.apiKey,
    });
    return features.map((feature) => this.formatFeature(feature));
  }

  /**
   * Single combined query for the destination search flow. Mirrors the exact
   * Geoapify Places URL used by the frontend:
   *   categories=tourism,catering.restaurant,accommodation.hotel
   *   conditions=internet_access.for_customers
   *   filter=rect:<bbox around the searched place>
   *   lang=en&limit=28
   * @param {string} location
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async searchPlacesByRect(location, limit = 28) {
    if (!this.apiKey) return [];
    const geo = await this.geocode(location);
    if (!geo) return [];
    const features = await this.fetchPlaces({
      categories: 'tourism,catering.restaurant,accommodation.hotel',
      filter: this.buildRectFilter(geo) || `circle:${geo.lon},${geo.lat},${this.guessRadius(geo)}`,
      lang: 'en',
      limit,
      apiKey: this.apiKey,
    });
    return features.map((feature) => this.formatFeature(feature));
  }

  /**
   * Builds a `rect:minLon,minLat,maxLon,maxLat` filter from the geocoded
   * bounding box, clamped so tiny POI boxes still get a usable search area
   * and country-sized boxes don't return scattered results.
   * @param {{bbox: Array|null}|null} geo
   * @returns {string|null}
   */
  buildRectFilter(geo) {
    if (!geo || !Array.isArray(geo.bbox) || geo.bbox.length !== 4) return null;
    const [minLon, minLat, maxLon, maxLat] = geo.bbox;
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const clamp = (v) => Math.min(Math.max(v, 0.05), 0.25);
    const halfLon = clamp((maxLon - minLon) / 2);
    const halfLat = clamp((maxLat - minLat) / 2);
    const lon1 = (centerLon - halfLon).toFixed(6);
    const lat1 = (centerLat - halfLat).toFixed(6);
    const lon2 = (centerLon + halfLon).toFixed(6);
    const lat2 = (centerLat + halfLat).toFixed(6);
    return `rect:${lon1},${lat1},${lon2},${lat2}`;
  }

  /**
   * Converts a Geoapify feature into the shared place shape used by the frontend.
   * `type` holds human-friendly labels for chips, `categories` the raw Geoapify
   * category strings (used internally for bucketing).
   */
  formatFeature(feature) {
    const p = feature.properties || {};
    const rawCats = Array.isArray(p.categories) ? p.categories : [];
    const labels = rawCats.map((c) => this.categoryLabels[c]).filter(Boolean);
    return {
      place_id: p.place_id || `${p.name || 'place'}-${p.lat},${p.lon}`,
      name: p.name || 'Unknown',
      rating: p.rating || null,
      address: p.formatted || p.address_line1 || '',
      categories: rawCats,
      type: labels.length ? [...new Set(labels)] : ['Destination'],
      coordinates: { lat: p.lat, lng: p.lon },
      image: this.generateImage(p.name || '', 1200),
      mapUrl: `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`,
    };
  }

  /**
   * Groups a flat result set (from the combined query) into the three
   * destination buckets the frontend renders.
   * @param {Array} items
   * @returns {{attractions: Array, restaurants: Array, hotels: Array}}
   */
  bucketize(items) {
    const buckets = { attractions: [], restaurants: [], hotels: [] };
    for (const item of items) {
      const cats = Array.isArray(item.categories) ? item.categories : [];
      if (cats.some((c) => c.startsWith('tourism.'))) buckets.attractions.push(item);
      else if (cats.some((c) => c.startsWith('catering.'))) buckets.restaurants.push(item);
      else if (cats.some((c) => c.startsWith('accommodation.'))) buckets.hotels.push(item);
    }
    return buckets;
  }

  /**
   * Fetches travel recommendations grouped by category for a location.
   * Uses one combined Places API call (the URL from the frontend search flow)
   * and splits the result into attractions, restaurants and stays.
   * @param {string} location
   * @returns {Promise<{attractions: Array, restaurants: Array, hotels: Array}>}
   */
  async getRecommendations(location) {
    const empty = { attractions: [], restaurants: [], hotels: [] };
    if (!this.apiKey) return empty;
    try {
      if (!location || location.toLowerCase() === 'world') {
        const world = await this.worldRecommendations();
        return {
          attractions: world.attractions,
          restaurants: world.restaurants,
          hotels: world.hotels,
        };
      }

      const items = await this.searchPlacesByRect(location, 28);
      const buckets = this.bucketize(items);

      return {
        attractions: this.topRated(this.dedupe(buckets.attractions)).slice(0, 20),
        restaurants: this.topRated(this.dedupe(buckets.restaurants)).slice(0, 20),
        hotels: this.topRated(this.dedupe(buckets.hotels)).slice(0, 20),
      };
    } catch (error) {
      console.error('Geoapify Recommendations Error:', error.message);
      return empty;
    }
  }

  /**
   * Aggregates a rich cross-city result set used for the default "world" view.
   * @returns {Promise<{attractions: Array, restaurants: Array, hotels: Array, activities: Array}>}
   */
  async worldRecommendations() {
    const buckets = { attractions: [], restaurants: [], hotels: [], activities: [] };
    const cities = ['Paris', 'Rome', 'London', 'Tokyo', 'Bangkok', 'Dubai', 'New York', 'Singapore'];
    const allDefs = Object.values(this.categoryDefs).flat().map((d) => d.cat).join(',');

    await Promise.all(cities.map(async (city) => {
      try {
        const geo = await this.geocode(city);
        if (!geo) return;
        const features = await this.fetchPlaces({
          categories: allDefs,
          filter: `circle:${geo.lon},${geo.lat},${this.guessRadius(geo)}`,
          bias: `proximity:${geo.lon},${geo.lat}`,
          lang: 'en',
          limit: 12,
          apiKey: this.apiKey,
        });
        features.forEach((feature) => {
          const key = this.bucketFor(feature.properties?.categories);
          if (key) buckets[key].push(this.formatFeature(feature, key));
        });
      } catch (error) {
        console.error(`[Geoapify] world query failed for ${city}:`, error.message);
      }
    }));

    return {
      attractions: this.topRated(this.dedupe(buckets.attractions)).slice(0, 12),
      restaurants: this.topRated(this.dedupe(buckets.restaurants)).slice(0, 12),
      hotels: this.topRated(this.dedupe(buckets.hotels)).slice(0, 12),
      activities: this.topRated(this.dedupe(buckets.activities)).slice(0, 12),
    };
  }

  /**
   * Sorts places so rated ones come first (highest first), unrated last.
   * @param {Array} items
   * @returns {Array}
   */
  topRated(items) {
    return [...items].sort((a, b) => (b.rating || -1) - (a.rating || -1));
  }

  bucketFor(categories) {
    const cats = Array.isArray(categories) ? categories : [];
    const order = ['attractions', 'restaurants', 'hotels', 'activities'];
    for (const key of order) {
      if (this.categoryDefs[key].some((d) => cats.includes(d.cat))) return key;
    }
    return null;
  }

  /**
   * Flat list of places for the activities search page (/trips/search-places).
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchCities(query) {
    if (!this.apiKey) return [];
    try {
      const isGlobal = /(world|worldwide|popular tourist)/i.test(query || '');
      let items;
      if (isGlobal) {
        const recs = await this.worldRecommendations();
        items = [...recs.attractions, ...recs.activities, ...recs.restaurants];
      } else {
        const geo = await this.geocode(query);
        if (geo) {
          const [attractions, restaurants, activities] = await Promise.all([
            this.searchPlaces(query, 'attractions', 15),
            this.searchPlaces(query, 'restaurants', 10),
            this.searchPlaces(query, 'activities', 15),
          ]);
          items = [...attractions, ...restaurants, ...activities];
        } else {
          const recs = await this.worldRecommendations();
          items = [...recs.attractions, ...recs.activities, ...recs.restaurants];
        }
      }

      return this.dedupe(items).slice(0, 40).map((p) => ({
        id: p.place_id,
        name: p.name,
        location: p.address,
        image: p.image,
        rating: p.rating,
        price: null,
        category: p.type[0],
        tag: 'Verified',
        desc: `Explore the beauty of ${p.name}. ${p.address}`,
        highlights: p.type.slice(0, 3),
      }));
    } catch (error) {
      console.error('Geoapify Search Cities Error:', error.message);
      return [];
    }
  }

  /**
   * Deterministic curated image for a place/city (Geoapify has no photos).
   * @param {string} placeName
   * @param {number} maxWidth
   * @returns {string}
   */
  generateImage(placeName = '', maxWidth = 1200) {
    const hash = String(placeName).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const selected = this.fallbackImages[hash % this.fallbackImages.length];
    return `${selected}?q=80&w=${maxWidth}&auto=format&fit=crop`;
  }

  /**
   * Trip cover image for a destination.
   * @param {string} city
   * @returns {Promise<string>}
   */
  async getCityImage(city) {
    return this.generateImage(city, 1600);
  }

  dedupe(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = item.place_id || item.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

module.exports = new GeoapifyService();
