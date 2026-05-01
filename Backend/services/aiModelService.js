const axios = require('axios');
const FLASK_RECOMMEND_URL = 'http://127.0.0.1:5001/recommend-plan';
const FLASK_URL = 'http://127.0.0.1:5001/predict';

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
    const response = await axios.post(FLASK_RECOMMEND_URL, {
      age: userStats.age,
      weight_kg: userStats.weight_kg,
      experience_level: userStats.experience_level,
      goal_type: userStats.goal_type,
      exhausted_muscles: userStats.exhausted_muscles || [] 
    });
    return response.data;
  } catch (error) {
    console.error("AI Recommendation Service Error:", error.message);
    throw error;
  }
};

module.exports = { getAIResponse, getCollaborativeRecommendation };

