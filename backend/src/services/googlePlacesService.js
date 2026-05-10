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
      const categories = [
        { type: 'attractions', query: `best tourist places in ${location}` },
        { type: 'restaurants', query: `top restaurants in ${location}` },
        { type: 'hotels', query: `best hotels in ${location}` },
        { type: 'activities', query: `popular activities in ${location}` }
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

  /**
   * Formats Google API raw results into clean data
   * @param {Array} places 
   */
  formatResults(places) {
    return places.slice(0, 5).map(place => ({
      place_id: place.place_id,
      name: place.name,
      rating: place.rating || 0,
      address: place.formatted_address,
      type: place.types,
      coordinates: place.geometry.location,
      image: this.generatePhotoUrl(place.photos ? place.photos[0].photo_reference : null)
    }));
  }

  /**
   * Generates a working URL for a place photo
   */
  generatePhotoUrl(reference) {
    if (!reference) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop';
    return `${this.photoUrl}?maxwidth=800&photoreference=${reference}&key=${this.apiKey}`;
  }
}

module.exports = new GooglePlacesService();
