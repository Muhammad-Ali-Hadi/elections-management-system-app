const Results = require('../models/Results');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const Attendance = require('../models/Attendance');
const Election = require('../models/Election');
const mongoose = require('mongoose');

// Get current results (ongoing) - optimized
exports.getCurrentResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid election ID format' 
      });
    }

    const results = await Results.findOne({ electionId })
      .populate('candidateResults.candidateId', 'name position votes')
      .lean();
    
    if (!results) {
      return res.status(404).json({ 
        success: false,
        message: 'No results found for this election' 
      });
    }

    res.json({
      success: true,
      results,
      status: results.electionStatus
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch results' 
    });
  }
};

// Declare/Finalize results
exports.declareResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    // Get all voters for this election
    const election = await Election.findById(electionId);
    const allVoters = await Voter.find({ electionId });
    const attendanceRecords = await Attendance.find({ electionId });

    // Calculate voting statistics
    const totalFlats = allVoters.length;
    const votersWhoVoted = attendanceRecords.filter(a => a.voted).length;
    const votingPercentage = totalFlats > 0 ? ((votersWhoVoted / totalFlats) * 100).toFixed(2) : 0;

    // Get non-voting flat numbers
    const votedFlatNumbers = attendanceRecords
      .filter(a => a.voted)
      .map(a => a.flatNumber);
    const nonVotingFlats = allVoters
      .map(v => v.flatNumber)
      .filter(flat => !votedFlatNumbers.includes(flat));

    // Update results document
    let results = await Results.findOne({ electionId });
    
    if (!results) {
      return res.status(404).json({ message: 'No results found' });
    }

    // Calculate winner and loser for each candidate
    const candidateStats = results.candidateResults.map(result => {
      const percentage = votersWhoVoted > 0 
        ? ((result.totalVotes / votersWhoVoted) * 100).toFixed(2) 
        : 0;
      return {
        ...result,
        votePercentage: percentage
      };
    });

    results.votingStatistics = {
      totalVoters: allVoters.length,
      totalFlats,
      totalVotesCast: votersWhoVoted,
      votingPercentage: parseFloat(votingPercentage),
      nonVotingFlats
    };
    
    results.candidateResults = candidateStats;
    results.electionStatus = 'declared';
    results.declaredAt = new Date();

    await results.save();

    res.json({
      success: true,
      message: 'Results declared successfully',
      results,
      statistics: {
        totalFlats,
        totalVotesCast: votersWhoVoted,
        votingPercentage: parseFloat(votingPercentage),
        nonVotingCount: nonVotingFlats.length,
        nonVotingFlats
      }
    });
  } catch (error) {
    console.error('Error declaring results:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get finalized results
exports.getFinalizedResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const results = await Results.findOne({ 
      electionId, 
      electionStatus: 'declared' 
    }).populate('candidateResults.candidateId');

    if (!results) {
      return res.status(404).json({ message: 'Results have not been declared yet' });
    }

    // Sort candidates by votes to identify winners and losers
    const sortedCandidates = [...results.candidateResults].sort((a, b) => b.totalVotes - a.totalVotes);
    
    // Group by position to find winners
    const positionGroups = {};
    sortedCandidates.forEach(candidate => {
      const position = candidate.position;
      if (!positionGroups[position]) {
        positionGroups[position] = [];
      }
      positionGroups[position].push(candidate);
    });

    const winners = [];
    const losers = [];

    Object.values(positionGroups).forEach(group => {
      if (group.length > 0) {
        winners.push(group[0]); // First is winner
        losers.push(...group.slice(1)); // Rest are losers
      }
    });

    res.json({
      success: true,
      results: {
        statistics: results.votingStatistics,
        winners: winners.map(w => ({
          candidateName: w.candidateName,
          position: w.position,
          totalVotes: w.totalVotes,
          votePercentage: w.votePercentage,
          votedBy: w.votedByFlats
        })),
        losers: losers.map(l => ({
          candidateName: l.candidateName,
          position: l.position,
          totalVotes: l.totalVotes,
          votePercentage: l.votePercentage,
          votedBy: l.votedByFlats
        })),
        allCandidates: sortedCandidates.map(c => ({
          candidateName: c.candidateName,
          position: c.position,
          totalVotes: c.totalVotes,
          votePercentage: c.votePercentage,
          votedByCount: c.votedByFlats.length
        })),
        declaredAt: results.declaredAt
      }
    });
  } catch (error) {
    console.error('Error fetching finalized results:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get results by position
exports.getResultsByPosition = async (req, res) => {
  try {
    const { electionId, position } = req.params;

    const results = await Results.findOne({ electionId });
    
    if (!results) {
      return res.status(404).json({ message: 'No results found' });
    }

    const positionResults = results.candidateResults.filter(r => r.position === position);

    res.json({
      success: true,
      position,
      statistics: results.votingStatistics,
      candidates: positionResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
