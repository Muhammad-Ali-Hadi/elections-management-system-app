import { useState } from 'react'
import { voterAPI, adminAPI } from '../services/api'

function Login({ onLogin }) {
  const [flatNumber, setFlatNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (showAdminLogin) {
        // For admin login, authenticate with the adminAPI
        console.log('🔐 Attempting admin login with username:', flatNumber)
        const response = await adminAPI.login(flatNumber, password)
        console.log('✅ Admin login response:', response)
        if (!response.user) {
          console.error('❌ No user object in response:', response)
          throw new Error('Invalid response from admin login')
        }
        console.log('✅ Admin login successful:', response.user)
        onLogin(response.user)
      } else {
        // For voter login, call the backend API
        console.log('🔓 Attempting voter login with flat:', flatNumber)
        const response = await voterAPI.login(flatNumber, password)
        console.log('✅ Voter login response:', response)
        if (!response.user) {
          console.error('❌ No user object in response:', response)
          throw new Error('Invalid response from voter login')
        }
        console.log('✅ Voter login successful:', response.user)
        onLogin(response.user)
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏢 Allah Noor Elections Portal</h1>
        <p className="login-subtitle">
          {showAdminLogin ? 'Administrator Login' : 'Resident Login'}
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="flatNumber">
              {showAdminLogin ? 'Admin Username' : 'Flat Number'}
            </label>
            <input
              type="text"
              id="flatNumber"
              placeholder={showAdminLogin ? 'Enter admin' : 'e.g., A-1, B-45'}
              value={flatNumber}
              onChange={(e) => setFlatNumber(showAdminLogin ? e.target.value : e.target.value.toUpperCase())}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button
          className="toggle-admin-btn"
          type="button"
          onClick={() => {
            setShowAdminLogin(!showAdminLogin)
            setFlatNumber('')
            setPassword('')
            setError('')
          }}
        >
          {showAdminLogin ? '← Back to Resident Login' : 'Switch to Admin Login →'}
        </button>

        <div className="login-info">
          <h3>Demo Credentials:</h3>
          <p><strong>Admin:</strong> admin, Password: admin@12345</p>
          <p><strong>Voter:</strong> A-1, Password: password@123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
