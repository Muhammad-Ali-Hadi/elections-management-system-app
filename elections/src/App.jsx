import { useState, useEffect } from 'react'
import './App.css'
import Router from './components/route'
import { candidateAPI } from './services/api'

const ENV_ELECTION_ID = import.meta.env.VITE_ELECTION_ID
const DEFAULT_ELECTION_ID = '69657a9d6767a0bc1e83ec02'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [electionData, setElectionData] = useState({
    _id: ENV_ELECTION_ID || DEFAULT_ELECTION_ID,
    candidates: [],
    votes: {},
    isOpen: true
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    // Fetch election and candidates from backend
    const fetchElectionData = async () => {
      try {
        const electionId = ENV_ELECTION_ID || DEFAULT_ELECTION_ID

        console.log('Fetching candidates for election:', electionId)
        const candidatesResponse = await candidateAPI.getCandidates(electionId)
        console.log('Candidates fetched:', candidatesResponse)
        
        // Handle both array and object responses
        const candidatesArray = Array.isArray(candidatesResponse) 
          ? candidatesResponse 
          : (candidatesResponse?.data || candidatesResponse?.candidates || [])
        
        console.log('Candidates array:', candidatesArray)
        
        const inferredElectionId = electionId || candidatesArray[0]?.electionId || null

        setElectionData(prev => ({
          ...prev,
          _id: inferredElectionId,
          candidates: candidatesArray,
          votes: {}
        }))
      } catch (error) {
        console.error('Error fetching election data:', error)
        setLoadError(error.message)
        // Fallback to actual seeded candidate data with proper IDs
        setElectionData(prev => ({
          ...prev,
          candidates: [
            { _id: '6956ad99c2d8af3e886ee45d', name: 'Ahmed Hassan', position: 'President', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee45e', name: 'Fatima Khan', position: 'President', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee45f', name: 'Mohammed Ali', position: 'Vice President', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee460', name: 'Aisha Malik', position: 'Vice President', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee461', name: 'Ibrahim Said', position: 'Secretary', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee462', name: 'Zainab Ahmed', position: 'Secretary', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee463', name: 'Omar Hassan', position: 'Treasurer', votes: 0 },
            { _id: '6956ad99c2d8af3e886ee464', name: 'Noor Ibrahim', position: 'Treasurer', votes: 0 }
          ],
          votes: {}
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchElectionData()
  }, [])

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'white', flexDirection: 'column', gap: '20px' }}>
        <div>Loading Elections System...</div>
        {loadError && <div style={{ color: '#fca5a5', fontSize: '0.9rem' }}>Note: {loadError}</div>}
      </div>
    )
  }

  return (
    <div className="app-container">
      <Router 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        electionData={electionData}
        setElectionData={setElectionData}
      />
    </div>
  )
}

export default App
