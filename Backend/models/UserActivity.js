const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  aiAnalysis: {
    intent: { type: String, default: 'unknown' },
    confidence: String,
    timestamp: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);