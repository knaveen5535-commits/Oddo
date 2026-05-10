const express = require('express');
const router = express.json();
const tripController = require('../controllers/tripController');

const routerInstance = express.Router();

routerInstance.post('/', tripController.createTrip);
routerInstance.get('/', tripController.getTrips);
routerInstance.get('/search-places', tripController.searchPlaces);
routerInstance.get('/recommendations', tripController.getRecommendations);

module.exports = routerInstance;
