const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['President', 'Vice President', 'General Secretary', 'Joint Secretary', 'Finance Secretary'],
    index: true
  },
  flatNumber: {
    type: String,
    default: ''
  },
  wing: {
    type: String,
    enum: ['A', 'B', ''],
    default: ''
  },
  description: String,
  image: String,
  votes: {
    type: Number,
    default: 0,
    index: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for faster queries
CandidateSchema.index({ electionId: 1, position: 1 });
CandidateSchema.index({ electionId: 1, votes: -1 });

module.exports = mongoose.model('Candidate', CandidateSchema);
