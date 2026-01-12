const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter',
    required: true,
    index: true
  },
  flatNumber: {
    type: String,
    required: true,
    index: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
    index: true
  },
  votes: {
    type: Map,
    of: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster lookups
VoteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
