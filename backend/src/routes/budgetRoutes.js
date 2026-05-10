const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:tripId', protect, budgetController.getBudget);
router.post('/:tripId/calculate', protect, budgetController.calculateBudget);

module.exports = router;
