const mongoose = require('mongoose');

const ElectionCommitteeMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Chief', 'Co-Chief', 'Member']
  },
  flatNumber: {
    type: String,
    required: true
  },
  wing: {
    type: String,
    enum: ['A', 'B'],
    required: true
  },
  email: String,
  phone: String,
  image: String,
  responsibilities: String,
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ElectionCommiteeMember', ElectionCommitteeMemberSchema);
