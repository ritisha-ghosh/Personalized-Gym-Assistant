const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Submit feedback
router.post('/', feedbackController.submitFeedback);

// Get feedback for a plan
router.get('/:planId', feedbackController.getFeedbackForPlan);

module.exports = router;

