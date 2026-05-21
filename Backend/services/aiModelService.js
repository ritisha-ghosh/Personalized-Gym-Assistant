const axios = require('axios');
const FLASK_RECOMMEND_URL = 'http://127.0.0.1:5001/recommend-plan';
const FLASK_URL = 'http://127.0.0.1:5001/predict';
const FLASK_SCALE_URL = 'http://127.0.0.1:5001/scale-difficulty'; // 🔹 ADDED FOR WEEK 9

// Helper function to pause execution (wait before retrying)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getAIResponse = async (userQuery, maxRetries = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 1. Send data to Flask Microservice
      const response = await axios.post(FLASK_URL, {
        query: userQuery
      });

      // 2. Return the clean data to the controller
      return response.data;

    } catch (error) {
      const isConnectionError = error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT';

      // 3. The Retry Logic
      if (isConnectionError && attempt < maxRetries) {
        console.warn(`[Attempt ${attempt}/${maxRetries}] AI Brain unavailable. Retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        continue; // Loop back and try again
      }

      // 4. Final Fallback if all retries fail
      if (isConnectionError) {
        console.error("CRITICAL: Flask Microservice is OFFLINE after multiple attempts.");
        return {
          status: "error",
          intent: "system_maintenance",
          message: "AI Brain is currently sleeping. Please try again later."
        };
      }
      
      console.error("AI Service Error:", error.message);
      throw error;
    }
  }
};

const getCollaborativeRecommendation = async (userStats) => {
  try {
    // 🔹 FORMATTED EXACTLY FOR WEEK 9 PYTHON PAYLOAD
    const response = await axios.post(FLASK_RECOMMEND_URL, {
      user: {
        age: userStats.age,
        weight: userStats.weight_kg || userStats.weight,
        experience: userStats.experience_level || userStats.experience,
        goal: userStats.goal_type || userStats.goal,
        disease: userStats.disease || "none", // 🔹 INJECTED MEDICAL DATA
        injury: userStats.injury || "none"    // 🔹 INJECTED MEDICAL DATA
      },
      exhausted_muscles: userStats.exhausted_muscles || [] 
    });
    return response.data;
  } catch (error) {
    console.error("AI Recommendation Service Error:", error.message);
    throw error;
  }
};

// 🔹 NEW FUNCTION FOR AUTONOMOUS FEEDBACK LOOP
const scaleDifficulty = async (difficultyRating) => {
  try {
    const response = await axios.post(FLASK_SCALE_URL, {
      average_difficulty: difficultyRating
    });
    return response.data;
  } catch (error) {
    console.error("AI Feedback Service Error:", error.message);
    throw error;
  }
};

// 🔹 EXPORT ALL THREE FUNCTIONS
module.exports = { getAIResponse, getCollaborativeRecommendation, scaleDifficulty };