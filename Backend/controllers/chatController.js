const { getAIResponse } = require('../services/aiModelService');
const UserActivity = require('../models/UserActivity');

exports.processChat = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // 1. Get Intelligence from Python
    const aiResult = await getAIResponse(message);

    // 2. Save to Database (The Week 3 Integration Goal)
    const newActivity = new UserActivity({
      userId: userId || "guest_user",
      query: message,
      aiAnalysis: {
        intent: aiResult.intent,
        confidence: aiResult.confidence
      }
    });

    await newActivity.save();

    res.status(200).json({ 
      reply: "Processed", 
      data: aiResult 
    });

  } catch (error) {
    res.status(500).json({ error: "Chat processing failed" });
  }
};