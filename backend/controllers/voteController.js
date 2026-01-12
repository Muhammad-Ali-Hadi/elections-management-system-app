const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Attendance = require('../models/Attendance');
const Results = require('../models/Results');
const Voter = require('../models/Voter');
const mongoose = require('mongoose');

// Cast vote - simplified for single-node MongoDB (no replica transactions)
exports.castVote = async (req, res) => {
  try {
    const { electionId, votes } = req.body;
    const voterId = req.userId;
    const flatNumber = req.userFlatNumber;

    console.log('Vote casting started:', { voterId, flatNumber, electionId });

    // Validate inputs
    if (!electionId || !votes || Object.keys(votes).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Election ID and votes are required' 
      });
    }

    // Check if voter has already voted - use lean for faster check
    const existingVote = await Vote.findOne({ voterId, electionId }).lean();
    if (existingVote) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already voted in this election',
        alreadyVoted: true
      });
    }

    // Validate that all votes are valid MongoDB ObjectIds
    const voteErrors = [];
    for (const [position, candidateId] of Object.entries(votes)) {
      if (!candidateId) {
        voteErrors.push(`No candidate selected for ${position}`);
        continue;
      }
      
      if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        voteErrors.push(`Invalid candidate ID for ${position}`);
      }
    }
    
    if (voteErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid vote data', 
        errors: voteErrors 
      });
    }

    // Create vote record with Map type
    const voteMap = new Map(Object.entries(votes));
    const vote = new Vote({
      voterId,
      flatNumber,
      electionId,
      votes: voteMap,
      timestamp: new Date()
    });

    const savedVote = await vote.save();
    console.log('Vote saved to DB:', savedVote._id);

    // Update candidate votes count
    for (const candidateId of Object.values(votes)) {
      await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { votes: 1 } },
        { new: true }
      );
    }

    // Update or create attendance record - mark as voted
    const attendanceUpdate = await Attendance.findOneAndUpdate(
      { voterId, electionId },
      { 
        $set: { 
          voted: true, 
          voteTime: new Date(),
          flatNumber,
          updatedAt: new Date()
        },
        $setOnInsert: {
          loginTime: new Date(),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      },
      { 
        upsert: true, 
        new: true
      }
    );

    // If attendance record was just created, add voter name
    if (!attendanceUpdate.name) {
      const voter = await Voter.findById(voterId).select('name').lean();
      if (voter) {
        await Attendance.updateOne(
          { _id: attendanceUpdate._id },
          { $set: { name: voter.name } }
        );
      }
    }

    console.log('Attendance updated:', attendanceUpdate._id);

    // Update Results collection
    for (const [position, candidateId] of Object.entries(votes)) {
      const candidate = await Candidate.findById(candidateId).select('name').lean();
      
      const resultUpdate = await Results.findOneAndUpdate(
        { electionId, 'candidateResults.candidateId': new mongoose.Types.ObjectId(candidateId) },
        { 
          $inc: { 'candidateResults.$.totalVotes': 1 },
          $addToSet: { 'candidateResults.$.votedByFlats': flatNumber }
        }
      );

      // If candidate not in results, add them
      if (!resultUpdate) {
        await Results.findOneAndUpdate(
          { electionId },
          { 
            $push: { 
              candidateResults: {
                candidateId: new mongoose.Types.ObjectId(candidateId),
                candidateName: candidate?.name || 'Unknown',
                totalVotes: 1,
                votedByFlats: [flatNumber],
                position
              }
            },
            $inc: { 'votingStatistics.totalVotesCast': 1 }
          },
          { upsert: true }
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Vote recorded successfully',
      vote: {
        id: savedVote._id,
        flatNumber: savedVote.flatNumber,
        timestamp: savedVote.timestamp
      }
    });
  } catch (error) {
    console.error('Vote casting error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already voted in this election',
        alreadyVoted: true
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to record vote. Please try again.' 
    });
  }
};

// Get election results - optimized
exports.getResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    const [totalVotes, candidates] = await Promise.all([
      Vote.countDocuments({ electionId }),
      Candidate.find({ electionId }).select('name position votes').sort({ position: 1, votes: -1 }).lean()
    ]);

    // Group candidates by position
    const candidateResults = {};
    const positionWinners = {};
    
    candidates.forEach(candidate => {
      if (!candidateResults[candidate.position]) {
        candidateResults[candidate.position] = [];
        positionWinners[candidate.position] = null;
      }
      candidateResults[candidate.position].push(candidate);
      
      // First candidate in sorted list is the leader
      if (!positionWinners[candidate.position]) {
        positionWinners[candidate.position] = candidate;
      }
    });

    res.json({
      success: true,
      results: {
        totalVotes,
        candidateResults,
        positionWinners
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch results' 
    });
  }
};

// Get vote count by position - optimized
exports.getVotesByPosition = async (req, res) => {
  try {
    const { electionId, position } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    const candidates = await Candidate.find({ electionId, position })
      .select('name position votes flatNumber wing')
      .sort({ votes: -1 })
      .lean();
    
    res.json({
      success: true,
      position,
      count: candidates.length,
      candidates
    });
  } catch (error) {
    console.error('Error fetching votes by position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch votes' 
    });
  }
};

// Check if voter has voted - optimized
exports.checkVoterStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    const voterId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    // Use lean and select only necessary fields for speed
    const vote = await Vote.findOne({ voterId, electionId })
      .select('timestamp flatNumber')
      .lean();
    
    const hasVoted = !!vote;

    // Also check attendance status
    const attendance = await Attendance.findOne({ voterId, electionId })
      .select('voted voteTime loginTime')
      .lean();

    res.json({
      success: true,
      hasVoted,
      vote: hasVoted ? {
        timestamp: vote.timestamp,
        flatNumber: vote.flatNumber
      } : null,
      attendance: attendance ? {
        voted: attendance.voted,
        voteTime: attendance.voteTime,
        loginTime: attendance.loginTime
      } : null
    });
  } catch (error) {
    console.error('Error checking voter status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to check voter status' 
    });
  }
};
