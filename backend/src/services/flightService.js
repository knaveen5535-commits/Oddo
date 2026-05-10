const axios = require('axios');

/**
 * Flight Intelligence Service
 * Integrates with AviationStack API for real-time flight tracking.
 */
class FlightService {
    constructor() {
        this.apiKey = process.env.AVIATIONSTACK_API_KEY;
        this.baseUrl = 'http://api.aviationstack.com/v1';
    }

    /**
     * Get real-time status for a flight
     */
    async getFlightStatus(flightNumber) {
        if (!this.apiKey) {
            console.warn('AVIATIONSTACK_API_KEY is missing. Returning mock flight data.');
            return this.getMockFlight(flightNumber);
        }

        try {
            const response = await axios.get(`${this.baseUrl}/flights`, {
                params: {
                    access_key: this.apiKey,
                    flight_iata: flightNumber
                }
            });

            const flight = response.data.data[0];
            if (!flight) throw new Error('Flight not found');

            return {
                flightNumber: flight.flight.iata,
                airline: flight.airline.name,
                status: flight.flight_status,
                departure: {
                    airport: flight.departure.airport,
                    timezone: flight.departure.timezone,
                    scheduled: flight.departure.scheduled,
                    estimated: flight.departure.estimated,
                    gate: flight.departure.gate || 'TBA'
                },
                arrival: {
                    airport: flight.arrival.airport,
                    timezone: flight.arrival.timezone,
                    scheduled: flight.arrival.scheduled,
                    estimated: flight.arrival.estimated,
                    gate: flight.arrival.gate || 'TBA'
                }
            };
        } catch (error) {
            console.error('Flight API Error:', error.message);
            return this.getMockFlight(flightNumber);
        }
    }

    getMockFlight(flightNumber) {
        return {
            flightNumber: flightNumber || 'TL-2026',
            airline: 'Traveloop Aviation',
            status: 'scheduled',
            departure: {
                airport: 'Heathrow (LHR)',
                timezone: 'Europe/London',
                scheduled: new Date().toISOString(),
                estimated: new Date().toISOString(),
                gate: 'B24'
            },
            arrival: {
                airport: 'Changi (SIN)',
                timezone: 'Asia/Singapore',
                scheduled: new Date(Date.now() + 43200000).toISOString(),
                estimated: new Date(Date.now() + 43200000).toISOString(),
                gate: 'A12'
            }
        };
    }
}

module.exports = new FlightService();
