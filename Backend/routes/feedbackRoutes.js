const express = require('express');
const router = express.Router();

const { submitFeedback, getFeedbackForPlan } = require('../controllers/feedbackController');

// 🔹 THE FIX: Import the default export (no curly braces) and call it 'protect'
const protect = require('../middleware/authMiddleware');

// Route to submit feedback (Triggers AI Autonomous Loop)
router.post('/', protect, submitFeedback);

// Route to fetch feedback for a specific plan
router.get('/:planId', protect, getFeedbackForPlan);

module.exports = router;