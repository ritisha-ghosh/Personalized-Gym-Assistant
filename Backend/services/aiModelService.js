const axios = require('axios');

// This points to your running Python Flask server
const FLASK_URL = 'http://127.0.0.1:5001/predict';

const getAIResponse = async (userQuery) => {
  try {
    // 1. Send data to Flask Microservice
    const response = await axios.post(FLASK_URL, {
      query: userQuery
    });

    // 2. Return the clean data to the controller
    return response.data;

  } catch (error) {
    // ERROR HANDLING: If Flask is offline, don't crash the server.
    if (error.code === 'ECONNREFUSED') {
      console.error("CRITICAL: Flask Microservice is OFFLINE.");
      return {
        status: "error",
        intent: "system_maintenance",
        message: "AI Brain is currently sleeping. Please try again later."
      };
    }
    
    console.error("AI Service Error:", error.message);
    throw error;
  }
};

module.exports = { getAIResponse };