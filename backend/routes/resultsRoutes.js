const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');
const { adminAuth } = require('../middleware/auth');

// Get current results (ongoing) - accessible to everyone
router.get('/:electionId', resultsController.getCurrentResults);

// Get results by position
router.get('/:electionId/position/:position', resultsController.getResultsByPosition);

// Declare/Finalize results - admin only
router.post('/:electionId/declare', adminAuth, resultsController.declareResults);

// Get finalized results - accessible to everyone
router.get('/:electionId/finalized', resultsController.getFinalizedResults);

module.exports = router;
