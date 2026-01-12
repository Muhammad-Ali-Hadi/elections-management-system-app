const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/:electionId', candidateController.getCandidates);
router.get('/position/:electionId/:position', candidateController.getCandidatesByPosition);
router.get('/by-id/:candidateId', candidateController.getCandidateById);

// Admin only routes
router.post('/create', verifyToken, isAdmin, candidateController.createCandidate);
router.put('/:candidateId', verifyToken, isAdmin, candidateController.updateCandidate);
router.delete('/:candidateId', verifyToken, isAdmin, candidateController.deleteCandidate);

module.exports = router;
