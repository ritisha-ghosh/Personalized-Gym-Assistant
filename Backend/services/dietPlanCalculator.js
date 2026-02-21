const generateDietPlan = ({ tdee, weight, goal }) => {

  // Prevent negative or unrealistic calories
  let calories = Math.max(1000, tdee);

  if (goal === "muscle gain") {
    calories += 300;
  } else if (goal === "fat loss") {
    calories -= 400;
  }

  calories = Math.max(1000, calories);

  // Clamp weight for protein calculation
  const safeWeight = Math.max(30, Math.min(300, weight));

  // Protein: 2g per kg bodyweight
  const protein = Math.max(40, Math.round(safeWeight * 2));
  const proteinCalories = protein * 4;

  // Fat: 25%
  const fatCalories = calories * 0.25;
  const fats = Math.max(20, Math.round(fatCalories / 9));

  // Carbs: Remaining calories
  const carbCalories = calories - (proteinCalories + fatCalories);
  const carbs = Math.max(50, Math.round(carbCalories / 4));

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fats,
  };
};

module.exports = { generateDietPlan };
