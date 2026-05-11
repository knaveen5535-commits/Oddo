const axios = require('axios');

class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    this.photoUrl = 'https://maps.googleapis.com/maps/api/place/photo';
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

      // Fetch for each category in parallel
      await Promise.all(categories.map(async (cat) => {
        const response = await axios.get(this.baseUrl, {
          params: {
            query: cat.query,
            key: this.apiKey
          }
        });

        results[cat.type] = this.formatResults(response.data.results);
      }));

      return results;
    } catch (error) {
      console.error('Google Places API Error:', error.message);
      throw new Error('Failed to fetch recommendations');
    }
  }

  async getCityImage(city) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          query: city,
          key: this.apiKey
        }
      });

      const place = response.data.results[0];
      if (place && place.photos && place.photos.length > 0) {
        return `${this.photoUrl}?maxwidth=1600&photoreference=${place.photos[0].photo_reference}&key=${this.apiKey}`;
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

      const searchPromises = categories.map(q => 
        axios.get(this.baseUrl, {
          params: {
            query: q,
            key: this.apiKey
          }
        })
      );

      const responses = await Promise.all(searchPromises);
      
      // Flatten and deduplicate results by place_id
      const allResults = responses.flatMap(res => res.data.results);
      const uniqueResults = Array.from(new Map(allResults.map(item => [item.place_id, item])).values());

      return uniqueResults.map(place => ({
        id: place.place_id,
        name: place.name,
        location: place.formatted_address,
        image: this.generatePhotoUrl(place.photos ? place.photos[0].photo_reference : null, place.name),
        rating: place.rating || 0,
        price: place.price_level ? "₹".repeat(place.price_level * 2) + "00" : "₹1,200", 
        category: place.types ? place.types[0].replace(/_/g, ' ') : "Destination",
        tag: place.rating > 4.5 ? "Top Rated" : "Verified",
        desc: `Explore the beautiful ${place.name}. ${place.formatted_address}`,
        highlights: place.types ? place.types.slice(0, 3).map(t => t.replace(/_/g, ' ')) : []
      }));
    } catch (error) {
      console.error('Google Search Cities Error:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Formats Google API raw results into clean data
   * @param {Array} places 
   */
  formatResults(places) {
    return places.slice(0, 20).map(place => ({
      place_id: place.place_id,
      name: place.name,
      rating: place.rating || 0,
      address: place.formatted_address,
      type: place.types,
      coordinates: place.geometry ? place.geometry.location : null,
      image: this.generatePhotoUrl(place.photos ? place.photos[0].photo_reference : null, place.name),
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`
    }));
  }

  /**
   * Generates a working URL for a place photo or a varied high-quality fallback
   */
  generatePhotoUrl(reference, placeName = "") {
    if (reference) {
      return `${this.photoUrl}?maxwidth=1200&photoreference=${reference}&key=${this.apiKey}`;
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
