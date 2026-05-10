const axios = require('axios');

/**
 * Currency Conversion Service
 * Integrates with ExchangeRate-API for real-time budget localization.
 */
class CurrencyService {
    constructor() {
        this.apiKey = process.env.EXCHANGE_RATE_API_KEY;
        this.baseUrl = `https://v6.exchangerate-api.com/v6`;
    }

    /**
     * Convert budget from base (INR) to destination currency
     */
    async convertBudget(amount, toCurrency = 'USD') {
        if (!this.apiKey) {
            console.warn('EXCHANGE_RATE_API_KEY is missing. Using fixed mock rates.');
            return this.getMockConversion(amount, toCurrency);
        }

        try {
            const response = await axios.get(`${this.baseUrl}/${this.apiKey}/pair/INR/${toCurrency}/${amount}`);
            
            return {
                baseAmount: amount,
                baseCurrency: 'INR',
                convertedAmount: response.data.conversion_result,
                targetCurrency: toCurrency,
                rate: response.data.conversion_rate,
                lastUpdate: response.data.time_last_update_utc
            };
        } catch (error) {
            console.error('Currency API Error:', error.message);
            return this.getMockConversion(amount, toCurrency);
        }
    }

    getMockConversion(amount, toCurrency) {
        const mockRates = { 'USD': 0.012, 'EUR': 0.011, 'JPY': 1.8, 'GBP': 0.0094, 'THB': 0.43 };
        const rate = mockRates[toCurrency] || 1.0;
        return {
            baseAmount: amount,
            baseCurrency: 'INR',
            convertedAmount: amount * rate,
            targetCurrency: toCurrency,
            rate: rate,
            lastUpdate: new Date().toUTCString()
        };
    }
}

module.exports = new CurrencyService();
