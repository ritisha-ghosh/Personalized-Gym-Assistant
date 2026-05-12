const mongoose = require("mongoose");

const userDietTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  completedMeals: [{
    type: String // e.g. "Breakfast", "Lunch", "Pre-Workout", "Dinner"
  }],
  notes: [{
    time: { type: Date, default: Date.now },
    text: String
  }]
}, { timestamps: true });

// Ensure unique entry per user per date
userDietTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("UserDietTracking", userDietTrackingSchema);
