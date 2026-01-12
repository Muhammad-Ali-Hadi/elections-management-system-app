const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');

// Create candidate (Admin only) - with validation
exports.createCandidate = async (req, res) => {
  try {
    const { name, position, flatNumber, wing, description, image, electionId } = req.body;

    // Validate required fields
    if (!name || !position || !electionId) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, position, and electionId are required' 
      });
    }

    // Validate electionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    const candidate = new Candidate({
      name: name.trim(),
      position: position.trim(),
      flatNumber: flatNumber?.trim() || '',
      wing: wing || '',
      description: description?.trim() || '',
      image: image || '',
      electionId,
      votes: 0
    });

    const savedCandidate = await candidate.save();
    
    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      candidate: savedCandidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create candidate. Please try again.' 
    });
  }
};

// Get all candidates for an election - optimized with lean()
exports.getCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    const candidates = await Candidate.find({ electionId })
      .select('name position flatNumber wing description image votes')
      .sort({ position: 1, name: 1 })
      .lean();
    
    res.json({
      success: true,
      count: candidates.length,
      candidates
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch candidates' 
    });
  }
};

// Get candidate by ID - optimized with lean()
exports.getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid candidate ID format' 
      });
    }

    const candidate = await Candidate.findById(candidateId).lean();
    
    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        message: 'Candidate not found' 
      });
    }
    
    res.json({
      success: true,
      candidate
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch candidate' 
    });
  }
};

// Update candidate - with validation
exports.updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { name, position, flatNumber, wing, description, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid candidate ID format' 
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (position) updateData.position = position.trim();
    if (flatNumber !== undefined) updateData.flatNumber = flatNumber.trim();
    if (wing !== undefined) updateData.wing = wing;
    if (description !== undefined) updateData.description = description.trim();
    if (image !== undefined) updateData.image = image;

    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        message: 'Candidate not found' 
      });
    }

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to update candidate' 
    });
  }
};

// Delete candidate - with proper response
exports.deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid candidate ID format' 
      });
    }

    const candidate = await Candidate.findByIdAndDelete(candidateId);
    
    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        message: 'Candidate not found' 
      });
    }

    res.json({
      success: true,
      message: 'Candidate deleted successfully',
      deletedCandidate: {
        id: candidate._id,
        name: candidate.name,
        position: candidate.position
      }
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete candidate' 
    });
  }
};

// Get candidates by position - optimized with lean()
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { electionId, position } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    const candidates = await Candidate.find({ electionId, position })
      .sort({ name: 1 })
      .lean();
    
    res.json({
      success: true,
      position,
      count: candidates.length,
      candidates
    });
  } catch (error) {
    console.error('Error fetching candidates by position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch candidates' 
    });
  }
};
