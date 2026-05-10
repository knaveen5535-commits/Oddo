const googlePlacesService = require('../services/googlePlacesService');

exports.createTrip = async (req, res) => {
  try {
    const { title, location, startDate, endDate, description } = req.body;

    // 1. Save trip (Simulated or using Prisma)
    // const trip = await prisma.trip.create({ data: { title, location, ... } });
    const mockTrip = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      location,
      startDate,
      endDate,
      description,
      createdAt: new Date()
    };

    // 2. Automatically fetch recommendations after trip creation
    console.log(`Fetching recommendations for: ${location}`);
    const recommendations = await googlePlacesService.getRecommendations(location);

    // 3. Return both the saved trip and the recommendations
    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: mockTrip,
      recommendations: recommendations
    });

  } catch (error) {
    console.error('Create Trip Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create trip and fetch recommendations"
    });
  }
};
