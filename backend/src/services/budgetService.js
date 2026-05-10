/**
 * Budget Service
 * Handles dynamic calculation and persistence of trip budgets.
 */
const { prisma } = require('../config/db');

class BudgetService {
    constructor() {
        // Base costs per category by destination tier
        this.destinationTiers = {
            'Japan': { tier: 'Expensive', multiplier: 1.8 },
            'Paris': { tier: 'Expensive', multiplier: 2.0 },
            'Dubai': { tier: 'Moderate', multiplier: 1.5 },
            'Maldives': { tier: 'Expensive', multiplier: 2.2 },
            'Thailand': { tier: 'Low', multiplier: 0.8 },
            'India': { tier: 'Low', multiplier: 0.7 },
            'Vietnam': { tier: 'Low', multiplier: 0.6 },
            'London': { tier: 'Expensive', multiplier: 1.9 },
        };

        // Base daily estimates (in INR approx)
        this.baseDailyCosts = {
            food: 1500,
            transport: 1000,
            misc: 800,
            hotel: 5000,
            activity: 2000
        };
    }

    /**
     * Calculate and store budget in DB
     */
    async calculateAndStoreBudget(tripId, tripData) {
        const { destination, startDate, endDate, activities = [], hotels = [], transport = "Standard" } = tripData;
        
        // Calculate days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

        // Determine destination multiplier
        const destKey = Object.keys(this.destinationTiers).find(k => destination.toLowerCase().includes(k.toLowerCase())) || "Default";
        const tierInfo = this.destinationTiers[destKey] || { tier: 'Moderate', multiplier: 1.0 };
        const m = tierInfo.multiplier;

        // 1. Hotel Cost
        const hotelCost = (hotels.length > 0 ? hotels.length * 8000 : this.baseDailyCosts.hotel) * m * (days - 1 || 1);

        // 2. Food Cost
        const foodCost = this.baseDailyCosts.food * m * days;

        // 3. Activity Cost
        const activityBase = activities.length > 0 ? activities.length * 2500 : this.baseDailyCosts.activity * days;
        const activityCost = activityBase * m;

        // 4. Transport Cost
        const transportBase = transport === "Premium" ? 5000 : 1500;
        const transportCost = transportBase * m * days;

        // 5. Miscellaneous Cost
        const miscellaneousCost = this.baseDailyCosts.misc * m * days;

        // 6. Total
        const totalCost = hotelCost + foodCost + activityCost + transportCost + miscellaneousCost;
        const averagePerDay = totalCost / days;

        // Upsert Budget in DB
        const budget = await prisma.budget.upsert({
            where: { tripId },
            update: {
                hotelCost: Math.round(hotelCost),
                foodCost: Math.round(foodCost),
                activityCost: Math.round(activityCost),
                transportCost: Math.round(transportCost),
                miscellaneousCost: Math.round(miscellaneousCost),
                totalCost: Math.round(totalCost),
                averagePerDay: Math.round(averagePerDay)
            },
            create: {
                tripId,
                hotelCost: Math.round(hotelCost),
                foodCost: Math.round(foodCost),
                activityCost: Math.round(activityCost),
                transportCost: Math.round(transportCost),
                miscellaneousCost: Math.round(miscellaneousCost),
                totalCost: Math.round(totalCost),
                averagePerDay: Math.round(averagePerDay)
            }
        });

        return { ...budget, status: tierInfo.tier };
    }

    async getBudgetByTripId(tripId) {
        return await prisma.budget.findUnique({
            where: { tripId }
        });
    }
}

module.exports = new BudgetService();
