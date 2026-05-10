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
  const { city } = req.query;
  const weatherService = require('../services/weatherService');
  const weather = await weatherService.getForecast(city);
  res.json({ success: true, data: weather });
});

module.exports = router;
