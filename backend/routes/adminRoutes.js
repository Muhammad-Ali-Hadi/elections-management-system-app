const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public route
router.post('/login', adminController.loginAdmin);

// Protected routes
router.get('/profile', verifyToken, isAdmin, adminController.getAdminProfile);

module.exports = router;
