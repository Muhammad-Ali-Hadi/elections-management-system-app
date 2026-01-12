const Voter = require('../models/Voter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login voter - optimized with lean query
exports.loginVoter = async (req, res) => {
  try {
    const { flatNumber, password } = req.body;

    if (!flatNumber || !password) {
      return res.status(400).json({ message: 'Flat number and password are required' });
    }

    // Use lean() for faster query - returns plain JS object
    const voter = await Voter.findOne({ flatNumber }).lean();
    if (!voter) {
      return res.status(400).json({ message: 'Invalid flat number or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, voter.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid flat number or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: voter._id, flatNumber: voter.flatNumber, role: 'voter' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: voter._id,
        flatNumber: voter.flatNumber,
        name: voter.name,
        wing: voter.wing,
        role: 'voter'
      }
    });
  } catch (error) {
    console.error('Voter login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// Get voter profile
exports.getVoterProfile = async (req, res) => {
  try {
    const voter = await Voter.findById(req.userId).select('-password');
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    res.json(voter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create voter (Admin only)
exports.createVoter = async (req, res) => {
  try {
    const { flatNumber, name, password, wing, email, phone } = req.body;

    // Check if voter already exists
    const existingVoter = await Voter.findOne({ flatNumber });
    if (existingVoter) {
      return res.status(400).json({ message: 'Flat number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const voter = new Voter({
      flatNumber,
      name,
      password: hashedPassword,
      wing,
      email,
      phone,
      role: 'voter'
    });

    await voter.save();
    res.status(201).json({
      success: true,
      message: 'Voter registered successfully',
      voter: {
        id: voter._id,
        flatNumber: voter.flatNumber,
        name: voter.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all voters (Admin only)
exports.getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find().select('-password');
    res.json({
      success: true,
      count: voters.length,
      voters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update voter
exports.updateVoter = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const voter = await Voter.findByIdAndUpdate(
      req.userId,
      { name, email, phone },
      { new: true }
    ).select('-password');
    res.json({
      success: true,
      voter
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete voter (Admin only)
exports.deleteVoter = async (req, res) => {
  try {
    const { voterId } = req.params;
    await Voter.findByIdAndDelete(voterId);
    res.json({
      success: true,
      message: 'Voter deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
