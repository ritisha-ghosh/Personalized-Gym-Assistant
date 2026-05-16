const path = require('path');
const { createDailyDietDay, normalizeDietType } = require('./Backend/services/userPlanService');

const testDietType = (dietType, calories, preferences) => {
  const normalizedType = normalizeDietType(dietType);
  console.log(`\n=== ${dietType} (${normalizedType}) plan ===`);
  const plan = Array.from({ length: 7 }).map((_, index) =>
    createDailyDietDay(index, calories, normalizedType, preferences, {
      calories,
      protein: 120,
      carbs: 200,
      fats: 70
    })
  );
  plan.forEach((day) => {
    console.log(`\n${day.day}: ${day.totalCalories} kcal`);
    day.meals.forEach((meal) => {
      console.log(`  ${meal.type}: ${meal.food} (${meal.cal})`);
    });
  });
};

const preferences = {
  noOnion: true,
  noGarlic: true,
  glutenFree: false,
  lactoseFree: true,
  nutAllergy: false,
  sugarFree: true
};

testDietType('vegetarian', 1800, preferences);
testDietType('non-vegetarian', 1800, preferences);
testDietType('vegan', 1800, preferences);
