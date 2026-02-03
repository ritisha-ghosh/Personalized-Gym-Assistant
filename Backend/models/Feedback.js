const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true }, // ID of the diet/workout plan
    difficulty: { type: Number, required: true, min: 1, max: 5 }, // rating 1-5
    comment: { type: String }, // optional comment
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
