const Feedback = require('../models/Feedback');

// POST /feedback - submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { userId, planId, difficulty, comment } = req.body;

        // Simple validation
        if (!userId || !planId || !difficulty) {
            return res.status(400).json({ message: 'userId, planId and difficulty are required' });
        }

        if (difficulty < 1 || difficulty > 5) {
            return res.status(400).json({ message: 'Difficulty must be between 1 and 5' });
        }

        const feedback = new Feedback({ userId, planId, difficulty, comment });
        await feedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /feedback/:planId - get all feedback for a plan
exports.getFeedbackForPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const feedbacks = await Feedback.find({ planId }).sort({ createdAt: -1 });
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
