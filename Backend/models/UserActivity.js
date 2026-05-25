const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String
  },
  query: {
    type: String,
    required: true
  },
  response: {
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