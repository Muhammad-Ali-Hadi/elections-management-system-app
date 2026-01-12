const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  wing: {
    type: String,
    enum: ['A', 'B'],
    required: true,
    index: true
  },
  floorNumber: Number,
  email: String,
  phone: String,
  role: {
    type: String,
    default: 'voter'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for login queries
VoterSchema.index({ flatNumber: 1, password: 1 });

module.exports = mongoose.model('Voter', VoterSchema);
