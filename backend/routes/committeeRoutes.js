const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeMemberController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/:electionId', committeeController.getMembers);
router.get('/by-id/:memberId', committeeController.getMemberById);

// Admin only routes
router.post('/create', verifyToken, isAdmin, committeeController.createMember);
router.put('/:memberId', verifyToken, isAdmin, committeeController.updateMember);
router.delete('/:memberId', verifyToken, isAdmin, committeeController.deleteMember);

module.exports = router;
