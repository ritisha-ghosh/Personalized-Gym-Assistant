const mongoose = require('mongoose');

const userDietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    enum: ['muscle gain', 'fat loss', 'maintenance'],
    lowercase: true,
    trim: true
  },
  dietType: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian'],
    lowercase: true,
    trim: true
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    lowercase: true,
    trim: true,
    default: 'moderate'
  },
  preferences: {
    noOnion: { type: Boolean, default: false },
    noGarlic: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    lactoseFree: { type: Boolean, default: false },
    nutAllergy: { type: Boolean, default: false },
    sugarFree: { type: Boolean, default: false }
  },
  weeklyPlan: {
    type: Array,
    default: []
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  planSource: {
    type: String,
    default: 'ml'
  },
  recommendationId: {
    type: String,
    default: null
  }
}, { timestamps: true });

userDietPlanSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('UserDietPlan', userDietPlanSchema);
