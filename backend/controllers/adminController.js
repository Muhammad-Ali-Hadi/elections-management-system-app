const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login admin - optimized with lean query
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Use lean() for faster query - returns plain JS object
    const admin = await Admin.findOne({ username }).lean();
    if (!admin) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with admin role
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Admin login successful:', { username: admin.username, token: token.substring(0, 20) + '...' });

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
