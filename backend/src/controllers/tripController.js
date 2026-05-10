const googlePlacesService = require('../services/googlePlacesService');

// In-memory storage for the current session
const trips = [
  { id: "1", title: "Maldives Summer Escape", location: "Maldives", startDate: "2026-06-15", endDate: "2026-06-22", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=800&auto=format&fit=crop", status: "Upcoming" },
  { id: "2", title: "Paris Romance", location: "Paris, France", startDate: "2026-04-10", endDate: "2026-04-15", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", status: "Upcoming" },
];

exports.createTrip = async (req, res) => {
  try {
    const { title, location, startDate, endDate, description } = req.body;

    const mockTrip = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      location,
      startDate,
      endDate,
      description,
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop", // Default banner
      status: "Upcoming",
      createdAt: new Date()
    };

    // 2. Fetch recommendations AND a city image
    const [recommendations, cityImage] = await Promise.all([
      googlePlacesService.getRecommendations(location),
      googlePlacesService.getCityImage(location)
    ]);

    if (cityImage) mockTrip.image = cityImage;
    trips.push(mockTrip);

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: { ...mockTrip, image: cityImage || mockTrip.image },
      recommendations: recommendations,
      cityImage: cityImage
    });

  } catch (error) {
    console.error('Create Trip Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create trip"
    });
  }
};

exports.searchPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, error: "Query is required" });

    const results = await googlePlacesService.searchCities(query);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Search Places Controller Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTrips = async (req, res) => {
  res.status(200).json({
    success: true,
    data: trips
  });
};

exports.getRecommendations = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ success: false, error: "Location is required" });

    const results = await googlePlacesService.getRecommendations(location);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Recommendations Controller Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
