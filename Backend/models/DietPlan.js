const generateDietPlan = ({ tdee, weight, goal }) => {
  let calories = tdee;

  // Goal-based calorie adjustment
  if (goal === "muscle gain") {
    calories += 300;
  } else if (goal === "fat loss") {
    calories -= 400;
  }
  // maintenance -> no change

  // Protein: 2g per kg bodyweight
  const protein = Math.round(weight * 2);
  const proteinCalories = protein * 4;

  // Fat: 25% of total calories
  const fatCalories = calories * 0.25;
  const fats = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const carbCalories = calories - (proteinCalories + fatCalories);
  const carbs = Math.round(carbCalories / 4);

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fats,
  };
};

module.exports = { generateDietPlan };
