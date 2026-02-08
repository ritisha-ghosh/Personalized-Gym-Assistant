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
 
  // 🍽️ DIET PREFERENCES (NEW)
  
  dietType: {
    type: String,
    enum: ["vegetarian", "non-vegetarian"],
    default: "vegetarian"
  },

  noOnion: {
    type: Boolean,
    default: false
  },

  noGarlic: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });
>>>>>>> origin/main

module.exports = mongoose.model("User", userSchema);
