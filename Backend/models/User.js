const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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

  age: Number,
  weight: Number,
  height: Number,

  goal: String,
  injury: String,
  experience: String,

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
