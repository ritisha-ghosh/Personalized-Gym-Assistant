const { getAIResponse } = require('../services/aiModelService');
const UserActivity = require('../models/UserActivity');
const WorkoutPlan = require('../models/WorkoutPlan');
const UserLog = require('../models/UserLog'); // Ensure this model exists

exports.processChat = async (req, res) => {
  // Use req.user.id from your protect middleware
  const userId = req.user.id; 
  const { message } = req.body;

  try {
    // 1. FETCH REAL CONTEXT
    // Get last 48 hours of workouts
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentWorkouts = await WorkoutPlan.find({
      user: userId,
      createdAt: { $gte: fortyEightHoursAgo }
    });

    // Summarize muscles for the AI
    const musclesWorked = recentWorkouts.flatMap(p => 
      p.exercises.map(ex => ex.muscleGroup)
    );

    // 2. CONSTRUCT ENRICHED PROMPT
    // We send the real data context along with the message
    const enrichedContext = {
      userQuery: message,
      recentActivity: musclesWorked,
      systemStatus: "Real-Data Mode Active"
    };

    // 3. Get Intelligence from Python
    const aiResult = await getAIResponse(enrichedContext);

    // 4. Save Activity for History
    const newActivity = new UserActivity({
      userId: userId,
      query: message,
      aiAnalysis: {
        intent: aiResult.intent,
        confidence: aiResult.confidence,
        detectedContext: musclesWorked // Store what the AI 'knew'
      }
    });
    await newActivity.save();

    res.status(200).json({ 
      reply: aiResult.personalized_message || "I've processed your request.", 
      data: aiResult 
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "Chat processing failed" });
  }
};