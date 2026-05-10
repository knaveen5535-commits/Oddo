const axios = require('axios');

/**
 * Weather Intelligence Service
 * Integrates with OpenWeather API to provide destination-based forecasts.
 */
class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    /**
     * Get current weather and 5-day forecast for a destination
     */
    async getForecast(city) {
        if (!this.apiKey) {
            console.warn('OPENWEATHER_API_KEY is missing. Returning mock weather data.');
            return this.getMockWeather(city);
        }

        try {
            const response = await axios.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            // Extract daily forecasts (OpenWeather returns every 3 hours)
            const dailyData = response.data.list.filter((item, index) => index % 8 === 0).map(item => ({
                date: item.dt_txt.split(' ')[0],
                temp: Math.round(item.main.temp),
                condition: item.weather[0].main,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            }));

            return {
                city: response.data.city.name,
                country: response.data.city.country,
                forecast: dailyData
            };
        } catch (error) {
            console.error('Weather API Error:', error.message);
            return this.getMockWeather(city);
        }
    }

    getMockWeather(city) {
        const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'];
        return {
            city: city,
            country: 'Traveler State',
            forecast: Array.from({ length: 5 }, (_, i) => ({
                date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
                temp: 22 + Math.floor(Math.random() * 10),
                condition: conditions[Math.floor(Math.random() * conditions.length)],
                description: 'Ideal conditions for exploration',
                icon: '01d'
            }))
        };
    }
}

module.exports = new WeatherService();
