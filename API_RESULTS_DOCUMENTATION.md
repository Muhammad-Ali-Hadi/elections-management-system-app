# Results API Documentation

## Base URL
```
http://localhost:5000/api/results
```

---

## Endpoints

### 1. Get Live/Current Results
```
GET /api/results/:electionId
```

**Description**: Get ongoing election results with live vote counts

**Authentication**: None (Public)

**Example Request**:
```bash
curl http://localhost:5000/api/results/default_election
```

**Response**:
```json
{
  "success": true,
  "results": {
    "_id": "...",
    "electionId": "default_election",
    "candidateResults": [
      {
        "_id": "...",
        "candidateId": "...",
        "candidateName": "Raj Kumar",
        "totalVotes": 25,
        "votedByFlats": ["A-1", "A-2", "A-3", ...],
        "position": "President"
      },
      ...
    ],
    "votingStatistics": {
      "totalVoters": 50,
      "totalFlats": 105,
      "totalVotesCast": 50,
      "votingPercentage": 47.62,
      "nonVotingFlats": ["A-10", "A-11", ...]
    },
    "electionStatus": "ongoing",
    "declaredAt": null,
    "createdAt": "2026-01-02T...",
    "updatedAt": "2026-01-02T..."
  },
  "status": "ongoing"
}
```

---

### 2. Get Results by Position
```
GET /api/results/:electionId/position/:position
```

**Description**: Get results for a specific position

**Authentication**: None (Public)

**Parameters**:
- `electionId`: Election ID
- `position`: Position name (e.g., "President", "Secretary")

**Example Request**:
```bash
curl http://localhost:5000/api/results/default_election/position/President
```

**Response**:
```json
{
  "success": true,
  "position": "President",
  "statistics": {
    "totalVoters": 50,
    "totalFlats": 105,
    "totalVotesCast": 50,
    "votingPercentage": 47.62,
    "nonVotingFlats": [...]
  },
  "candidates": [
    {
      "candidateId": "...",
      "candidateName": "Raj Kumar",
      "totalVotes": 25,
      "votedByFlats": ["A-1", "A-2", ...],
      "position": "President"
    },
    ...
  ]
}
```

---

### 3. Declare Official Results (Admin Only)
```
POST /api/results/:electionId/declare
```

**Description**: Declare official election results (calculate statistics and finalize)

**Authentication**: Required (Admin Token)

**Authorization**: Admin only

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/results/default_election/declare \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

**Response**:
```json
{
  "success": true,
  "message": "Results declared successfully",
  "results": {
    "candidateResults": [
      {
        "candidateId": "...",
        "candidateName": "Raj Kumar",
        "totalVotes": 105,
        "votedByFlats": ["A-1", "A-2", ...],
        "position": "President",
        "votePercentage": "100.00"
      },
      ...
    ],
    "votingStatistics": {
      "totalVoters": 105,
      "totalFlats": 105,
      "totalVotesCast": 105,
      "votingPercentage": 100,
      "nonVotingFlats": []
    },
    "electionStatus": "declared",
    "declaredAt": "2026-01-02T15:30:00.000Z"
  },
  "statistics": {
    "totalFlats": 105,
    "totalVotesCast": 105,
    "votingPercentage": 100,
    "nonVotingCount": 0,
    "nonVotingFlats": []
  }
}
```

---

### 4. Get Finalized/Official Results
```
GET /api/results/:electionId/finalized
```

**Description**: Get official declared results with winners and losers

**Authentication**: None (Public)

**Requirements**: Results must be declared first

**Example Request**:
```bash
curl http://localhost:5000/api/results/default_election/finalized
```

**Response**:
```json
{
  "success": true,
  "results": {
    "statistics": {
      "totalVoters": 105,
      "totalFlats": 105,
      "totalVotesCast": 105,
      "votingPercentage": 100,
      "nonVotingFlats": []
    },
    "winners": [
      {
        "candidateName": "Raj Kumar",
        "position": "President",
        "totalVotes": 105,
        "votePercentage": "100.00",
        "votedBy": ["A-1", "A-2", ...]
      }
    ],
    "losers": [
      {
        "candidateName": "Priya Singh",
        "position": "President",
        "totalVotes": 0,
        "votePercentage": "0.00",
        "votedBy": []
      }
    ],
    "allCandidates": [
      {
        "candidateName": "Raj Kumar",
        "position": "President",
        "totalVotes": 105,
        "votePercentage": "100.00",
        "votedByCount": 105
      },
      ...
    ],
    "declaredAt": "2026-01-02T15:30:00.000Z"
  }
}
```

---

## Error Responses

### Unauthorized (Missing Token)
```json
{
  "message": "No token provided"
}
```
Status: 401

### Forbidden (Not Admin)
```json
{
  "message": "Access denied. Admin only."
}
```
Status: 403

### Not Found
```json
{
  "message": "No results found for this election"
}
```
Status: 404

### Results Not Declared Yet
```json
{
  "message": "Results have not been declared yet"
}
```
Status: 404

---

## JavaScript/React Usage

### Import API Service
```javascript
import { resultsAPI } from '../services/api'
```

### Get Live Results
```javascript
const fetchLiveResults = async () => {
  try {
    const data = await resultsAPI.getCurrentResults('default_election')
    console.log('Live Results:', data)
    // data.candidateResults - array of candidates with votes
    // data.votingStatistics - overall stats
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Get Results by Position
```javascript
const fetchPositionResults = async () => {
  const data = await resultsAPI.getResultsByPosition(
    'default_election',
    'President'
  )
  console.log('President Results:', data)
}
```

### Declare Results (Admin)
```javascript
const handleFinalizeResults = async () => {
  try {
    const response = await resultsAPI.declareResults('default_election')
    console.log('Results declared:', response)
    alert('Results officially declared!')
  } catch (error) {
    console.error('Error:', error)
    alert(`Failed: ${error.message}`)
  }
}
```

### Get Finalized Results
```javascript
const fetchFinalResults = async () => {
  try {
    const data = await resultsAPI.getFinalizedResults('default_election')
    console.log('Winners:', data.winners)
    console.log('Losers:', data.losers)
    console.log('Statistics:', data.statistics)
  } catch (error) {
    console.error('Results not yet declared:', error)
  }
}
```

---

## Real-Time Polling Example

```javascript
import { useState, useEffect } from 'react'
import { resultsAPI } from '../services/api'

function ResultsComponent() {
  const [results, setResults] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      const data = await resultsAPI.getCurrentResults('default_election')
      setResults(data)
    }

    // Initial fetch
    fetchResults()

    // Poll every 5 seconds
    const interval = setInterval(fetchResults, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {results && (
        <>
          <h2>Results</h2>
          <p>Total Votes: {results.votingStatistics.totalVotesCast}</p>
          {results.candidateResults.map(candidate => (
            <div key={candidate.candidateId}>
              <h3>{candidate.candidateName}</h3>
              <p>Votes: {candidate.totalVotes}</p>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default ResultsComponent
```

---

## Data Structures

### Candidate Result Object
```javascript
{
  _id: "ObjectId",
  candidateId: "ObjectId",
  candidateName: "String",
  totalVotes: Number,
  votedByFlats: ["A-1", "A-2", ...],  // Array of flat numbers
  position: "String",
  votePercentage: "String" // Only after declaration
}
```

### Voting Statistics Object
```javascript
{
  totalVoters: Number,              // Same as totalVotesCast
  totalFlats: Number,                // Total apartments (105)
  totalVotesCast: Number,           // Actual votes cast
  votingPercentage: Number,         // (votes cast / total flats) * 100
  nonVotingFlats: ["A-10", ...]     // List of flats that didn't vote
}
```

### Winner Object
```javascript
{
  candidateName: "String",
  position: "String",
  totalVotes: Number,
  votePercentage: "String",
  votedBy: ["A-1", "A-2", ...]     // Flat numbers that voted
}
```

---

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Not authorized (not admin) |
| 404 | Not Found | Election/Results not found |
| 500 | Server Error | Internal server error |

---

## Notes

- All timestamps are in ISO 8601 format
- Vote percentages are calculated as: (votes / totalVotesCast) * 100
- Participation rate: (totalVotesCast / totalFlats) * 100
- Results declaration is a one-time action (cannot be undone)
- Flat numbers must be in format: "A-1" to "A-45", "B-1" to "B-60"
- Results update in real-time as votes come in
- Frontend should poll every 5 seconds for best user experience
