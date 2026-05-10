const express = require('express');
const router = express.json();
const tripController = require('../controllers/tripController');

const routerInstance = express.Router();

routerInstance.post('/', tripController.createTrip);

module.exports = routerInstance;
