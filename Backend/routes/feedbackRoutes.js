const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Route to submit feedback (Triggers AI Autonomous Loop)
router.post('/', protect, feedbackController.submitFeedback);

// Route to fetch feedback for a specific plan
router.get('/:planId', protect, feedbackController.getFeedbackForPlan);

module.exports = router;