const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    refreshToken: {
      type: String
    },

    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    goal: String,
    injury: String,
    experience: String,

    activityLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate"
    },

    dietType: {
      type: String,
      enum: ["standard", "veg", "non-veg", "keto", "vegan"],
      default: "standard"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
