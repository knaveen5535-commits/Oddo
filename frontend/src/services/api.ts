import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const travelService = {
  /**
   * Search for a destination and fetch grouped recommendations (Attractions, Hotels, etc.)
   */
  searchDestination: async (query: string) => {
    try {
      const response = await api.get(`/trips/search-places`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Fetch full destination intelligence (Attractions, Restaurants, Hotels, Activities)
   */
  getDestinationIntelligence: async (location: string) => {
    try {
      const response = await api.get(`/trips/recommendations`, {
        params: { location },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default api;
