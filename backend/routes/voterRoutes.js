const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', voterController.loginVoter);

// Protected routes
router.get('/profile', verifyToken, voterController.getVoterProfile);
router.put('/profile', verifyToken, voterController.updateVoter);

// Admin only routes
router.post('/create', verifyToken, isAdmin, voterController.createVoter);
router.get('/all', verifyToken, isAdmin, voterController.getAllVoters);
router.delete('/:voterId', verifyToken, isAdmin, voterController.deleteVoter);

module.exports = router;
