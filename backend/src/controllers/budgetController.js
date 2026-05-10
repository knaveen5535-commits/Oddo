const budgetService = require('../services/budgetService');
const { prisma } = require('../config/db');

exports.getBudget = async (req, res) => {
    try {
        const { tripId } = req.params;
        const budget = await budgetService.getBudgetByTripId(tripId);
        
        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found for this trip"
            });
        }

        res.status(200).json({
            success: true,
            data: budget
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.calculateBudget = async (req, res) => {
    try {
        const { tripId } = req.params;
        const tripData = req.body; 

        // Ensure the trip belongs to the user
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId: req.user.id }
        });

        if (!trip) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this trip's budget" });
        }

        const budget = await budgetService.calculateAndStoreBudget(tripId, { ...tripData, destination: trip.destination });

        res.status(200).json({
            success: true,
            data: budget
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
