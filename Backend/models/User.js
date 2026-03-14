const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  refreshToken: {
    type: String
  },

  // -------------------------
  // 🧬 BIOLOGICAL DATA
  // -------------------------

  age: {
    type: Number,
    min: 10,
    max: 100
  },

  weight: {
    type: Number,
    min: 30,
    max: 300
  },

  height: {
    type: Number,
    min: 100,
    max: 250
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    lowercase: true
  },

  // ✅ FIXED (lowercase, matches calculator)
  goal: {
    type: String,
    enum: ["muscle gain", "fat loss", "maintenance"],
    lowercase: true,
    trim: true
  },

  injury: {
    type: String,
    default: "none"
  },

  experience: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    lowercase: true
  },

  // -------------------------
  // 🍽️ DIET PREFERENCES
  // -------------------------

  dietType: {
    type: String,
    enum: ["vegetarian", "non-vegetarian"],

    default: "vegetarian",
    lowercase: true

  },

  noOnion: {
    type: Boolean,
    default: false
  },

  noGarlic: {
    type: Boolean,
    default: false
  }

}, 
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
