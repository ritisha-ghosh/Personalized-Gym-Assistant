const calculateBMR = ({ gender, weight, height, age }) => {
  if (gender === "male") {
    return (
      88.362 +
      13.397 * weight +
      4.799 * height -
      5.677 * age
    );
  } else {
    return (
      447.593 +
      9.247 * weight +
      3.098 * height -
      4.33 * age
    );
  }
};

const activityMultiplier = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const calculateTDEE = (bmr, activityLevel) => {
  return bmr * (activityMultiplier[activityLevel] || 1.2);
};

module.exports = {
  calculateBMR,
  calculateTDEE,
};
