function UserPanel({ currentUser, electionData, onNavigate, attendance = {} }) {
  const userVote = electionData.votes[currentUser.id]
  const userAttendance = attendance[currentUser.flatNumber]
  const positions = [...new Set(electionData.candidates.map(c => c.position))]

  return (
    <div className="user-panel-container">
      <div className="user-panel-card">
        <h2>My Profile</h2>

        <div className="profile-section">
          <h3>👤 Personal Information</h3>
          <div className="profile-info">
            <div className="info-row">
              <label>Flat Number:</label>
              <span className="flat-badge">{currentUser.flatNumber}</span>
            </div>
            <div className="info-row">
              <label>Name:</label>
              <span>{currentUser.name}</span>
            </div>
            <div className="info-row">
              <label>Role:</label>
              <span className="role-badge">{currentUser.role}</span>
            </div>
          </div>
        </div>

        {userAttendance && (
          <div className="profile-section">
            <h3>📋 Attendance Details</h3>
            <div className="attendance-info">
              <div className="info-row">
                <label>Login Time:</label>
                <span>{userAttendance.loginTime}</span>
              </div>
              <div className="info-row">
                <label>Status:</label>
                <span className={`status-badge ${userAttendance.voted ? 'voted' : 'pending'}`}>
                  {userAttendance.voted ? '✓ Voted' : '⏳ Not Yet Voted'}
                </span>
              </div>
              {userAttendance.voteTime && (
                <div className="info-row">
                  <label>Vote Time:</label>
                  <span>{userAttendance.voteTime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="profile-section">
          <h3>🗳️ Voting Information</h3>
          {userVote ? (
            <div>
              <p className="voted-status">✓ You have voted</p>
              <p className="vote-time">Voted on: {userVote.timestamp}</p>
              
              <div className="vote-summary">
                <h4>Your Votes:</h4>
                {positions.map(position => {
                  const candidateId = userVote[position]
                  const selectedCandidate = electionData.candidates.find(c => (c._id || c.id) === candidateId)
                  return (
                    <div key={position} className="vote-item">
                      <div className="vote-position">{position}:</div>
                      <div className="vote-candidate">
                        {selectedCandidate?.name || 'N/A'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="not-voted-status">✗ You have not voted yet</p>
              <button 
                className="btn-primary"
                onClick={() => onNavigate('vote')}
              >
                Go to Voting
              </button>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button 
            className="btn-secondary"
            onClick={() => onNavigate('vote')}
          >
            Back to Voting
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserPanel
