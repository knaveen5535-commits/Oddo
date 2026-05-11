const express = require('express');
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected Routes
router.post('/', protect, tripController.createTrip);
router.get('/', protect, tripController.getTrips);

// Public/Utility Routes
router.get('/search-places', tripController.searchPlaces);
router.get('/recommendations', tripController.getRecommendations);
router.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ success: false, error: "City is required" });
    
    const weatherService = require('../services/weatherService');
    const weather = await weatherService.getForecast(city);
    res.json({ success: true, data: weather });
  } catch (error) {
    console.error('Weather Service Error:', error.message);
    res.status(500).json({ success: false, message: "Weather data unavailable" });
  }
});

module.exports = router;
