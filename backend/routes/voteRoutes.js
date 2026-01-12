const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { verifyToken, isVoter, isAdmin } = require('../middleware/auth');

// Voter routes
router.post('/cast', verifyToken, isVoter, voteController.castVote);
router.get('/status/:electionId', verifyToken, voteController.checkVoterStatus);

// Admin routes
router.get('/results/:electionId', verifyToken, isAdmin, voteController.getResults);
router.get('/position/:electionId/:position', verifyToken, isAdmin, voteController.getVotesByPosition);

module.exports = router;
