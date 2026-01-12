const ElectionCommiteeMember = require('../models/ElectionCommiteeMember');

// Create election committee member
exports.createMember = async (req, res) => {
  try {
    const { name, position, flatNumber, wing, email, phone, image, responsibilities, electionId } = req.body;

    const member = new ElectionCommiteeMember({
      name,
      position,
      flatNumber,
      wing,
      email,
      phone,
      image,
      responsibilities,
      electionId
    });

    await member.save();
    res.status(201).json({
      success: true,
      message: 'Election committee member added successfully',
      member
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all committee members for an election
exports.getMembers = async (req, res) => {
  try {
    const { electionId } = req.params;
    const members = await ElectionCommiteeMember.find({ electionId });
    res.json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await ElectionCommiteeMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { name, position, email, phone, image, responsibilities } = req.body;

    const member = await ElectionCommiteeMember.findByIdAndUpdate(
      memberId,
      { name, position, email, phone, image, responsibilities },
      { new: true }
    );

    res.json({
      success: true,
      member
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    await ElectionCommiteeMember.findByIdAndDelete(memberId);
    res.json({
      success: true,
      message: 'Committee member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
