// ----------------------------
// 🔐 SAFE INPUT LIMITS
// ----------------------------
const LIMITS = {
  weight: { min: 30, max: 300 },     // kg
  height: { min: 100, max: 250 },    // cm
  age: { min: 10, max: 100 }         // years
};

const clamp = (value, min, max) => {
  if (typeof value !== "number" || isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
};

// ----------------------------
// 🧠 SAFE BMR CALCULATION
// ----------------------------
const calculateBMR = ({ gender, weight, height, age }) => {
  // Clamp extreme values
  weight = clamp(weight, LIMITS.weight.min, LIMITS.weight.max);
  height = clamp(height, LIMITS.height.min, LIMITS.height.max);
  age = clamp(age, LIMITS.age.min, LIMITS.age.max);

  let bmr;

  if (gender === "male") {
    bmr =
      88.362 +
      13.397 * weight +
      4.799 * height -
      5.677 * age;
  } else {
    bmr =
      447.593 +
      9.247 * weight +
      3.098 * height -
      4.33 * age;
  }

  // Prevent impossible BMR
  return Math.max(800, Math.round(bmr));
};

// ----------------------------
// 🏃 ACTIVITY MULTIPLIERS
// ----------------------------
const activityMultiplier = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultiplier[activityLevel] || 1.2;

  const tdee = bmr * multiplier;

  // Prevent impossible calorie outputs
  return Math.max(1000, Math.round(tdee));
};

module.exports = {
  calculateBMR,
  calculateTDEE,
};
