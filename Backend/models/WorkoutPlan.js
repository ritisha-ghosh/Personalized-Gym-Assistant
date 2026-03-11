const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  goal: {
    type: String,
    enum: ["Weight Loss", "Muscle Gain", "Maintenance"],
    required: true
  },

  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true
  },

  durationWeeks: {
    type: Number,
    default: 4
  },

  daysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    default: 5
  },

  exercises: [
    {
      name: {
        type: String,
        required: true
      },

      // ⭐ NEW FIELD
      muscleGroup: {
        type: String,
        enum: [
          "chest",
          "back",
          "shoulders",
          "biceps",
          "triceps",
          "quads",
          "hamstrings",
          "glutes",
          "calves",
          "core"
        ],
        required: true
      },

      sets: {
        type: Number,
        required: true
      },

      reps: {
        type: Number,
        required: true
      },

      restSeconds: {
        type: Number,
        default: 60
      }
    }
  ],

  notes: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
