const geoapifyService = require('../services/geoapifyService');
const budgetService = require('../services/budgetService');
const { prisma } = require('../config/db');

exports.createTrip = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, description } = req.body;
    const userId = req.user.id; // From auth middleware

    // Fetch recommendations and city image in parallel
    const [recommendations, cityImage] = await Promise.all([
      geoapifyService.getRecommendations(destination),
      geoapifyService.getCityImage(destination)
    ]);

    // Flatten recommendations from different categories into a single array
    const flattenedRecs = [
      ...(recommendations.attractions || []),
      ...(recommendations.restaurants || []),
      ...(recommendations.hotels || []),
      ...(recommendations.activities || [])
    ];

    // Create Trip in PostgreSQL via Prisma
    const trip = await prisma.trip.create({
      data: {
        userId,
        title,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        coverImage: cityImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
        recommendations: {
          create: flattenedRecs.map(rec => ({
            placeName: rec.name,
            rating: rec.rating,
            address: rec.address,
            image: rec.image,
            category: Array.isArray(rec.type) ? rec.type[0] : "Destination"
          }))
        }
      },
      include: {
        recommendations: true
      }
    });

    // Auto-calculate and store initial budget in DB
    const initialBudget = await budgetService.calculateAndStoreBudget(trip.id, trip);

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
      budget: initialBudget
    });

  } catch (error) {
    console.error('Create Trip Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create trip"
    });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
      include: { budget: true }
    });

    res.status(200).json({
      success: true,
      data: trips
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, error: "Query is required" });

    const results = await geoapifyService.searchCities(query);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ success: false, error: "Location is required" });

    const results = await geoapifyService.getRecommendations(location);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
