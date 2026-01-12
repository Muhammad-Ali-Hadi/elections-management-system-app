const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, isAdmin, isVoter } = require('../middleware/auth');

// Admin routes (place specific paths before param paths to avoid conflicts)
router.get('/report/:electionId', verifyToken, isAdmin, attendanceController.getAttendanceReport);
router.put('/:attendanceId/vote-status', verifyToken, isAdmin, attendanceController.updateVoteStatus);

// Voter routes
router.post('/record', verifyToken, isVoter, attendanceController.recordAttendance);
router.get('/by-flat/:flatNumber/:electionId', verifyToken, attendanceController.getAttendanceByFlat);

module.exports = router;
