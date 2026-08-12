const axios = require('axios');

class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    this.searchUrl = 'https://places.googleapis.com/v1/places:searchText';
  }

  /**
   * Fetches travel recommendations based on a location
   * @param {string} location - The destination (e.g., "Paris", "Japan")
   * @returns {Promise<Object>} - Grouped recommendations
   */
  async getRecommendations(location) {
    try {
      const categories = [
        { type: 'attractions', query: `best tourist places in ${location}` },
        { type: 'restaurants', query: `top restaurants in ${location}` },
        { type: 'hotels', query: `best hotels in ${location}` },
        { type: 'activities', query: `popular activities in ${location}` }
      ];

      const results = { attractions: [], restaurants: [], hotels: [], activities: [] };

      // Fetch for each category in parallel
      await Promise.all(categories.map(async (cat) => {
        const response = await axios.post(this.searchUrl, {
          textQuery: cat.query,
          languageCode: 'en'
        }, {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.formattedAddress,places.primaryType,places.location,places.photos,places.priceLevel'
          }
        });

        results[cat.type] = this.formatResults(response.data.places || []);
      }));

      return results;
    } catch (error) {
      console.error('Google Places API Error:', error.response?.data || error.message);
      return { attractions: [], restaurants: [], hotels: [], activities: [] };
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

      const searchPromises = categories.map(q => 
        axios.post(this.searchUrl, {
          textQuery: q,
          languageCode: 'en'
        }, {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.formattedAddress,places.primaryType,places.location,places.photos,places.priceLevel'
          }
        })
      );

      const responses = await Promise.all(searchPromises);
      
      // Flatten and deduplicate results by place_id
      const allResults = responses.flatMap(res => res.data.places || []);
      const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());

      return uniqueResults.map(place => {
        const photoName = place.photos && place.photos.length > 0 ? place.photos[0].name : null;
        return {
          id: place.id,
          name: place.displayName?.text || 'Unknown',
          location: place.formattedAddress,
          image: this.generatePhotoUrl(photoName, place.displayName?.text),
          rating: place.rating || 0,
          price: place.priceLevel ? "₹".repeat(place.priceLevel * 2) + "00" : "₹1,200", 
          category: place.primaryType ? place.primaryType.replace(/_/g, ' ') : "Destination",
          tag: (place.rating || 0) > 4.5 ? "Top Rated" : "Verified",
          desc: `Explore the beautiful ${place.displayName?.text}. ${place.formattedAddress}`,
          highlights: place.primaryType ? [place.primaryType.replace(/_/g, ' ')] : []
        };
      });
    } catch (error) {
      console.error('Google Search Cities Error:', error.response?.data || error.message);
      return [];
    }
  }

  async getCityImage(city) {
    try {
      const response = await axios.post(this.searchUrl, {
        textQuery: city,
        languageCode: 'en'
      }, {
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'places.photos'
        }
      });

      const place = response.data.places && response.data.places[0];
      if (place && place.photos && place.photos.length > 0) {
        return this.generatePhotoUrl(place.photos[0].name, city);
      }
      return this.generatePhotoUrl(null, city);
    } catch (error) {
      console.error('City Image Fetch Error:', error.message);
      return this.generatePhotoUrl(null, city);
    }
  }

  /**
   * Formats Google API raw results into clean data
   */
  formatResults(places) {
    return places.slice(0, 20).map(place => {
      const photoName = place.photos && place.photos.length > 0 ? place.photos[0].name : null;
      return {
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        rating: place.rating || null,
        address: place.formattedAddress || '',
        type: place.primaryType ? [place.primaryType.replace(/_/g, ' ')] : ['Destination'],
        coordinates: place.location ? { lat: place.location.latitude, lng: place.location.longitude } : null,
        image: this.generatePhotoUrl(photoName, place.displayName?.text),
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text || '')}&query_place_id=${place.id}`
      };
    });
  }

  /**
   * Generates a working proxy URL for a place photo or a varied high-quality fallback
   */
  generatePhotoUrl(photoName, placeName = "") {
    if (photoName) {
      const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${this.apiKey}`;
      const publicUrl = process.env.PUBLIC_BACKEND_URL || 'http://localhost:5001';
      // Route through our proxy which uses Cloudinary!
      return `${publicUrl}/api/places/photo?url=${encodeURIComponent(googlePhotoUrl)}`;
    }
    
    // Fallback: A curated set of high-quality cinematic travel images for variety
    const fallbacks = [
      "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
      "https://images.unsplash.com/photo-1528127269322-539801943592",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      "https://images.unsplash.com/photo-1500835595333-7221d600645a"
    ];

    // Use place name to consistently pick one of the 10 fallbacks
    const hash = (placeName || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selected = fallbacks[hash % fallbacks.length];
    
    return `${selected}?q=80&w=1200&auto=format&fit=crop`;
  }
}

module.exports = new GooglePlacesService();
