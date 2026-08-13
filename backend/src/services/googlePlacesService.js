const axios = require('axios');

class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    this.searchUrl = 'https://places.googleapis.com/v1/places:searchText';
  }

  async getRecommendations(location, title = "", description = "") {
    try {
      const context = (title || description) ? `for a trip called ${title} focusing on ${description}`.trim() : '';

      const categories = [
        { type: 'attractions', query: `best tourist places in ${location} ${context}`.trim() },
        { type: 'restaurants', query: `top restaurants in ${location} ${context}`.trim() },
        { type: 'hotels', query: `best hotels in ${location} ${context}`.trim() },
        { type: 'activities', query: `popular activities in ${location} ${context}`.trim() }
      ];

      const results = { attractions: [], restaurants: [], hotels: [], activities: [] };

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

        results[cat.type] = await this.formatResults(response.data.places || []);
      }));

      return results;
    } catch (error) {
      console.error('Google Places API Error:', error.response?.data || error.message);
      return { attractions: [], restaurants: [], hotels: [], activities: [] };
    }
  }

  async searchCities(query) {
    try {
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
      
      const allResults = responses.flatMap(res => res.data.places || []);
      const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());

      return await Promise.all(uniqueResults.map(async (place) => {
        const photoName = place.photos && place.photos.length > 0 ? place.photos[0].name : null;
        const imageUrl = await this.getPlaceImageUrl(photoName, place.displayName?.text);
        
        return {
          id: place.id,
          name: place.displayName?.text || 'Unknown',
          location: place.formattedAddress,
          image: imageUrl,
          rating: place.rating || 0,
          price: place.priceLevel ? "₹".repeat(place.priceLevel * 2) + "00" : "₹1,200", 
          category: place.primaryType ? place.primaryType.replace(/_/g, ' ') : "Destination",
          tag: (place.rating || 0) > 4.5 ? "Top Rated" : "Verified",
          desc: `Explore the beautiful ${place.displayName?.text}. ${place.formattedAddress}`,
          highlights: place.primaryType ? [place.primaryType.replace(/_/g, ' ')] : []
        };
      }));
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
      const photoName = place && place.photos && place.photos.length > 0 ? place.photos[0].name : null;
      return await this.getPlaceImageUrl(photoName, city);
    } catch (error) {
      console.error('City Image Fetch Error:', error.message);
      return await this.getPlaceImageUrl(null, city);
    }
  }

  async formatResults(places) {
    return await Promise.all(places.slice(0, 20).map(async (place) => {
      const photoName = place.photos && place.photos.length > 0 ? place.photos[0].name : null;
      const imageUrl = await this.getPlaceImageUrl(photoName, place.displayName?.text);
      
      return {
        place_id: place.id,
        name: place.displayName?.text || 'Unknown',
        rating: place.rating || null,
        address: place.formattedAddress || '',
        type: place.primaryType ? [place.primaryType.replace(/_/g, ' ')] : ['Destination'],
        coordinates: place.location ? { lat: place.location.latitude, lng: place.location.longitude } : null,
        image: imageUrl,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text || '')}&query_place_id=${place.id}`
      };
    }));
  }

  async getPlaceImageUrl(photoName, placeName = "") {
    const publicUrl = process.env.PUBLIC_BACKEND_URL || 'http://localhost:5001';
    
    // 1. Try Google Places Photo
    if (photoName) {
      const googlePhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${this.apiKey}`;
      return `${publicUrl}/api/places/photo?url=${encodeURIComponent(googlePhotoUrl)}`;
    }
    
    // 2. Try Wikipedia API fallback
    if (placeName) {
      try {
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=1200&titles=${encodeURIComponent(placeName)}`;
        const { data } = await axios.get(wikiUrl, { headers: { 'User-Agent': 'Oddo/1.0 (contact@oddo.com)' }, timeout: 3000 });
        if (data && data.query && data.query.pages) {
          const firstPage = Object.values(data.query.pages)[0];
          const wikiImage = firstPage.thumbnail?.source || firstPage.original?.source;
          if (wikiImage) {
            return `${publicUrl}/api/places/photo?url=${encodeURIComponent(wikiImage)}`;
          }
        }
      } catch (e) {
        console.error(`[Wikipedia API] Failed to fetch image for ${placeName}:`, e.message);
      }
    }
    
    // 3. Unsplash currated fallback
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

    const hash = (placeName || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selected = fallbacks[hash % fallbacks.length];
    
    return `${selected}?q=80&w=1200&auto=format&fit=crop`;
  }
}

module.exports = new GooglePlacesService();
