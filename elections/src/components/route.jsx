import { useState, useCallback } from 'react'
import { voterAPI, attendanceAPI } from '../services/api'
import VoteCasting from '../pages/vote_casting'
import Results from '../pages/results'
import AdminPanel from '../panels/adminpanel'
import UserPanel from '../panels/userPanel'
import Login from './Login'

function Router({ currentUser, setCurrentUser, electionData, setElectionData }) {
  const [currentPage, setCurrentPage] = useState('login')
  const [attendance, setAttendance] = useState({})
  const ENV_ELECTION_ID = import.meta.env.VITE_ELECTION_ID
  // Prefer env ID, then hydrated electionData, then fallback
  const ELECTION_ID = ENV_ELECTION_ID || electionData._id || electionData.electionId || '69657a9d6767a0bc1e83ec02'

  const handleLogin = useCallback(async (user) => {
    console.log('🔐 Router: handleLogin called with user:', user)
    
    if (!user) {
      console.error('❌ Router: No user provided to handleLogin')
      return
    }
    
    setCurrentUser(user)
    
    // Record attendance when voter logs in via API
    if (user.role !== 'admin') {
      // Update local attendance state immediately
      setAttendance(prev => ({
        ...prev,
        [user.flatNumber]: {
          name: user.name,
          flatNumber: user.flatNumber,
          loginTime: new Date().toLocaleString(),
          voted: false,
          voteTime: null
        }
      }))

      // Record attendance to API asynchronously
      try {
        const attendanceResponse = await attendanceAPI.recordAttendance(ELECTION_ID)
        console.log('📋 Attendance recorded:', attendanceResponse)
        
        // Update with server response
        if (attendanceResponse?.attendance) {
          setAttendance(prev => ({
            ...prev,
            [user.flatNumber]: {
              name: attendanceResponse.attendance.name || user.name,
              flatNumber: user.flatNumber,
              loginTime: attendanceResponse.attendance.loginTime 
                ? new Date(attendanceResponse.attendance.loginTime).toLocaleString() 
                : new Date().toLocaleString(),
              voted: attendanceResponse.attendance.voted || false,
              voteTime: attendanceResponse.attendance.voteTime 
                ? new Date(attendanceResponse.attendance.voteTime).toLocaleString() 
                : null
            }
          }))
        }
      } catch (error) {
        console.log('Attendance recording info:', error.message)
        // Continue anyway - attendance might already be recorded
      }
      
      console.log('📊 Setting page to vote')
      setCurrentPage('vote')
    } else {
      console.log('👤 Admin detected, setting page to admin')
      setCurrentPage('admin')
    }
  }, [ELECTION_ID, setCurrentUser])

  const recordVote = useCallback(async (user) => {
    // Update local attendance first for immediate UI feedback
    setAttendance(prev => ({
      ...prev,
      [user.flatNumber]: {
        ...prev[user.flatNumber],
        voted: true,
        voteTime: new Date().toLocaleString()
      }
    }))
    
    // Fetch updated attendance from API
    try {
      console.log('Fetching updated attendance for:', user.flatNumber)
      const attendanceData = await attendanceAPI.getAttendanceByFlat(user.flatNumber, ELECTION_ID)
      
      if (attendanceData) {
        setAttendance(prev => ({
          ...prev,
          [user.flatNumber]: {
            name: attendanceData.name || user.name,
            flatNumber: attendanceData.flatNumber,
            loginTime: attendanceData.loginTime ? new Date(attendanceData.loginTime).toLocaleString() : 'N/A',
            voteTime: attendanceData.voteTime ? new Date(attendanceData.voteTime).toLocaleString() : null,
            voted: attendanceData.voted || false
          }
        }))
      }
    } catch (error) {
      console.warn('Could not fetch attendance from API:', error)
      // Keep the local state update if API fails
    }
  }, [ELECTION_ID])

  const handleLogout = () => {
    voterAPI.logout()
    setCurrentUser(null)
    setAttendance({})
    setCurrentPage('login')
    
    // Clear all session-related state from localStorage
    localStorage.removeItem('selectedCandidates')
    localStorage.removeItem('voteSubmitted')
    localStorage.removeItem('adminActiveTab')
    localStorage.removeItem('resultsFinalized')
    localStorage.removeItem('resultsPage')
  }

  const renderPage = () => {
    console.log('📄 Rendering page:', currentPage, 'for user:', currentUser?.name || 'none')
    
    switch (currentPage) {
      case 'login':
        console.log('  → Rendering Login')
        return <Login onLogin={handleLogin} />
      case 'vote':
        console.log('  → Rendering VoteCasting')
        return <VoteCasting electionData={electionData} setElectionData={setElectionData} currentUser={currentUser} onNavigate={setCurrentPage} recordVote={recordVote} />
      case 'results':
        console.log('  → Rendering Results')
        return <Results electionData={electionData} onNavigate={setCurrentPage} isAdmin={currentUser?.role === 'admin'} />
      case 'admin':
        console.log('  → Rendering AdminPanel')
        return <AdminPanel electionData={electionData} setElectionData={setElectionData} onNavigate={setCurrentPage} attendance={attendance} />
      case 'profile':
        console.log('  → Rendering UserPanel')
        return <UserPanel currentUser={currentUser} electionData={electionData} onNavigate={setCurrentPage} attendance={attendance} />
      default:
        console.log('  → Default: Rendering Login (unknown page)')
        return <Login onLogin={handleLogin} />
    }
  }

  return (
    <div className="router-container">
      {console.log('🔄 Router rendering, currentPage:', currentPage, 'currentUser:', currentUser)}
      
      {currentUser && (
        <nav className="navbar">
          <div className="nav-brand">🏢 Elections Management</div>
          <div className="nav-links">
            {currentUser.role !== 'admin' && (
              <>
                <button onClick={() => setCurrentPage('vote')} className="nav-btn">Vote</button>
                <button onClick={() => setCurrentPage('profile')} className="nav-btn">My Profile</button>
              </>
            )}
            {currentUser.role === 'admin' && (
              <>
                <button onClick={() => setCurrentPage('admin')} className="nav-btn">Dashboard</button>
                <button onClick={() => setCurrentPage('results')} className="nav-btn">Results</button>
              </>
            )}
            <span className="current-user">{currentUser.flatNumber || currentUser.name || currentUser.username}</span>
            <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
          </div>
        </nav>
      )}
      
      <div style={{ minHeight: '100vh' }}>
        {renderPage()}
      </div>
    </div>
  )
}

export default Router
