import { useEffect, useState } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('zid_token')
    setToken(storedToken)
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome to SmartFit AI</h1>
        {token ? (
          <div className="token-display">
            <h2>Zid Access Token:</h2>
            <div className="token-box">
              <code>{token}</code>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('zid_token')
                setToken(null)
              }}
              className="clear-token-btn"
            >
              Clear Token
            </button>
          </div>
        ) : (
          <div className="no-token">
            <p>No token found. Please authenticate with Zid first.</p>
            <a href="/" className="home-link">
              Go to Home
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

