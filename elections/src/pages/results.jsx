import { useState, useEffect } from 'react'
import { resultsAPI } from '../services/api'

function Results({ onNavigate }) {
  const ELECTION_ID = '6957030455dee196ac3b31c4'
  
  const [finalizedResults, setFinalizedResults] = useState(null)
  const [currentResults, setCurrentResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resultsPage, setResultsPage] = useState(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem('resultsPage')
    return saved || 'ongoing'
  })

  // Save resultsPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resultsPage', resultsPage)
  }, [resultsPage])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        if (resultsPage === 'finalized') {
          const data = await resultsAPI.getFinalizedResults(ELECTION_ID)
          setFinalizedResults(data)
        } else {
          const data = await resultsAPI.getCurrentResults(ELECTION_ID)
          setCurrentResults(data)
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching results:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
    const pollInterval = setInterval(fetchResults, 5000) // Poll every 5 seconds
    return () => clearInterval(pollInterval)
  }, [resultsPage])

  const renderOngoingResults = () => {
    if (!currentResults?.candidateResults) return null

    const positions = [...new Set(currentResults.candidateResults.map(c => c.position))]
    const stats = currentResults.votingStatistics || {}

    return (
      <div className="results-card">
        <h2>Live Election Results</h2>
        
        <div className="results-statistics">
          <div className="stat-box">
            <div className="stat-label">Total Votes Cast</div>
            <div className="stat-value">{stats.totalVotesCast || 0}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total Flats</div>
            <div className="stat-value">{stats.totalFlats || 0}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Voting Percentage</div>
            <div className="stat-value">{stats.votingPercentage || 0}%</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Non-Voting Flats</div>
            <div className="stat-value">{stats.nonVotingFlats?.length || 0}</div>
          </div>
        </div>

        {positions.map(position => (
          <div key={position} className="results-position">
            <h3>{position}</h3>
            <div className="results-list">
              {currentResults.candidateResults
                .filter(c => c.position === position)
                .sort((a, b) => b.totalVotes - a.totalVotes)
                .map((candidate, index) => (
                  <div key={candidate._id || candidate.candidateId} className="result-item">
                    <div className="result-rank">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div className="result-info">
                      <div className="result-name">{candidate.candidateName || candidate.name}</div>
                      <div className="result-stats">
                        {candidate.totalVotes} votes ({candidate.votePercentage || 0}%)
                      </div>
                      <div className="voted-by">Voted by: {candidate.votedByFlats?.join(', ') || 'N/A'}</div>
                    </div>
                    <div className="result-bar">
                      <div
                        className="result-bar-fill"
                        style={{ width: `${candidate.votePercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {stats.nonVotingFlats?.length > 0 && (
          <div className="non-voting-section">
            <h3>Non-Voting Flats ({stats.nonVotingFlats.length})</h3>
            <div className="non-voting-list">
              {stats.nonVotingFlats.map(flat => (
                <span key={flat} className="non-voting-flat">{flat}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderFinalizedResults = () => {
    if (!finalizedResults) return null

    const { statistics, winners, losers } = finalizedResults

    return (
      <div className="results-card">
        <h2>Final Election Results</h2>
        
        <div className="results-statistics">
          <div className="stat-box">
            <div className="stat-label">Total Votes Cast</div>
            <div className="stat-value">{statistics.totalVotesCast}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total Flats</div>
            <div className="stat-value">{statistics.totalFlats}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Voting Percentage</div>
            <div className="stat-value">{statistics.votingPercentage}%</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Non-Voting Flats</div>
            <div className="stat-value">{statistics.nonVotingFlats?.length || 0}</div>
          </div>
        </div>

        <div className="winners-section">
          <h3>🏆 WINNERS 🏆</h3>
          <div className="winners-list">
            {winners.map((winner, index) => (
              <div key={index} className="winner-item">
                <div className="winner-medal">🥇</div>
                <div className="winner-info">
                  <div className="winner-name">{winner.candidateName}</div>
                  <div className="winner-position">{winner.position}</div>
                  <div className="winner-stats">
                    {winner.totalVotes} votes ({winner.votePercentage}%)
                  </div>
                </div>
                <div className="result-bar">
                  <div
                    className="result-bar-fill winner-bar"
                    style={{ width: `${winner.votePercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="losers-section">
          <h3>Other Candidates</h3>
          <div className="losers-list">
            {losers.map((loser, index) => (
              <div key={index} className="loser-item">
                <div className="loser-info">
                  <div className="loser-name">{loser.candidateName}</div>
                  <div className="loser-position">{loser.position}</div>
                  <div className="loser-stats">
                    {loser.totalVotes} votes ({loser.votePercentage}%)
                  </div>
                </div>
                <div className="result-bar">
                  <div
                    className="result-bar-fill"
                    style={{ width: `${loser.votePercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {statistics.nonVotingFlats?.length > 0 && (
          <div className="non-voting-section">
            <h3>Non-Voting Flats ({statistics.nonVotingFlats.length})</h3>
            <div className="non-voting-list">
              {statistics.nonVotingFlats.map(flat => (
                <span key={flat} className="non-voting-flat">{flat}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Election Results</h1>
        <div className="results-tabs">
          <button
            className={`tab-button ${resultsPage === 'ongoing' ? 'active' : ''}`}
            onClick={() => setResultsPage('ongoing')}
          >
            Live Results
          </button>
          <button
            className={`tab-button ${resultsPage === 'finalized' ? 'active' : ''}`}
            onClick={() => setResultsPage('finalized')}
          >
            Final Results
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading results...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
        resultsPage === 'ongoing' ? renderOngoingResults() : renderFinalizedResults()
      )}

      <div className="results-actions">
        <button onClick={() => onNavigate('vote')} className="btn-secondary">
          Back to Voting
        </button>
      </div>
    </div>
  )
}

export default Results

