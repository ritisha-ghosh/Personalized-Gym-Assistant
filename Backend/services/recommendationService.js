const axios = require("axios");

const getDietRecommendations = async ({ dietType, noOnion, noGarlic }) => {
  const response = await axios.post(
    "http://localhost:5001/diet-recommendation",
    {
      dietType,
      noOnion,
      noGarlic
    }
  );

  return response.data;
};

module.exports = { getDietRecommendations };
