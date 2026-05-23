const { getAIResponse } = require('../services/aiModelService');
const UserActivity = require('../models/UserActivity');
const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');

// GET /api/chat - Fetches all chat history for the logged-in user
exports.getChatHistory = async (req, res) => {
  try {
    // Use the UserActivity model to find all chats for the user, sorted by time
    const history = await UserActivity.find({ userId: req.user.id }).sort({ 'aiAnalysis.timestamp': 'asc' });
    
    // The frontend expects an array of chat objects, which this now provides.
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error while fetching chat history.' });
  }
};

// POST /api/chat - Processes a new message, saves it, and returns AI response
exports.processChat = async (req, res) => {
  const userId = req.user.id;
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ message: 'Message and sessionId are required.' });
  }

  try {
    // This block is from your original controller to get the AI response
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recentWorkouts = await WorkoutPlan.find({
      user: userId,
      createdAt: { $gte: fortyEightHoursAgo }
    });

    const musclesWorked = recentWorkouts.flatMap(p => 
      p.exercises.map(ex => ex.muscleGroup)
    );

    const enrichedContext = {
      userQuery: message,
      recentActivity: musclesWorked,
      systemStatus: "Real-Data Mode Active"
    };

    const aiResult = await getAIResponse(enrichedContext);
    const aiReply = aiResult.personalized_message || "I've processed your request.";
    // --- End of AI response block ---

    // Now, save the full conversation to the UserActivity model
    await UserActivity.create({
      userId: userId,
      sessionId: sessionId,
      query: message,
      response: aiReply, // <-- SAVING THE AI's RESPONSE
      aiAnalysis: {
        intent: aiResult.intent,
        confidence: aiResult.confidence,
        detectedContext: musclesWorked,
        timestamp: new Date()
      }
    });

    // Send just the AI reply back to the frontend
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ reply: "Sorry, I encountered an error. Please try again." });
  }
};

// DELETE /api/chat/:sessionId - Deletes an entire chat session
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    // Use the UserActivity model to delete all chats in a session
    await UserActivity.deleteMany({ userId: req.user.id, sessionId: sessionId });
    res.status(200).json({ success: true, message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
};

// PUT /api/chat/:sessionId - Updates the title of a chat session
exports.updateChatTitle = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Update the title for all messages in the session
    await UserActivity.updateMany(
      { userId: req.user.id, sessionId: sessionId },
      { $set: { title: title } }
    );

    res.status(200).json({ success: true, message: 'Session title updated successfully', title: title });
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ message: 'Failed to update session title' });
  }
};