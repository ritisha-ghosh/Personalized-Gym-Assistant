const Feedback = require('../models/Feedback');
const User = require('../models/User'); 
const { scaleDifficulty } = require('../services/aiModelService'); 

// POST /feedback - submit feedback
const submitFeedback = async (req, res) => {
    try {
        const { userId, planId, difficulty, comment } = req.body;

        // Simple validation
        if (!userId || !planId || !difficulty) {
            return res.status(400).json({ message: 'userId, planId and difficulty are required' });
        }

        // 🔹 CHANGED MAX LIMIT TO 10 TO MATCH WEEK 9 AI ENGINE LOGIC
        if (difficulty < 1 || difficulty > 10) {
            return res.status(400).json({ message: 'Difficulty must be between 1 and 10' });
        }

        // 1. Save the basic feedback history
        const feedback = new Feedback({ userId, planId, difficulty, comment });
        await feedback.save();

        // 2. Call the Python ML Engine to calculate the new multiplier
        let aiResponse = null;
        try {
            aiResponse = await scaleDifficulty(difficulty);
            
            // 3. Update the User's database profile with the new coefficient
            if (aiResponse && aiResponse.new_difficulty_coefficient) {
                await User.findByIdAndUpdate(userId, { 
                    difficulty_coefficient: aiResponse.new_difficulty_coefficient 
                });
            }
        } catch (aiError) {
            console.error("AI Scaling failed, but feedback was saved:", aiError.message);
            // Non-blocking error - we still return 201 because the feedback saved successfully
        }

        res.status(201).json({ 
            message: 'Feedback submitted and AI load coefficient adjusted successfully', 
            feedback,
            ai_action: aiResponse || { message: "AI Engine temporarily unavailable" }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing AI feedback loop' });
    }
};

// GET /feedback/:planId - get all feedback for a plan
const getFeedbackForPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const feedbacks = await Feedback.find({ planId }).sort({ createdAt: -1 });
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    submitFeedback,
    getFeedbackForPlan
};