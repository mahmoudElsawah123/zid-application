import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './AuthCallback.css'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Check for OAuth error parameters
    if (errorParam) {
      setError(
        `OAuth Error: ${errorParam}${errorDescription ? ` - ${errorDescription}` : ''}`
      )
      setLoading(false)
      return
    }

    if (!code) {
      setError('No authorization code received. The OAuth provider may have rejected the request.')
      setLoading(false)
      return
    }

    // Call the internal API route
    // In production, this will use the Vercel serverless function
    // For local dev, use Vercel CLI: vercel dev
    const apiUrl = '/api/authCallback'
    
    console.log('Exchanging authorization code for token...', { code: code.substring(0, 10) + '...' })
    
    axios
      .get(`${apiUrl}?code=${code}`)
      .then((response) => {
        const { access_token } = response.data

        if (access_token) {
          // Store token in localStorage
          localStorage.setItem('zid_token', access_token)
          console.log('Token stored successfully, redirecting to dashboard...')
          // Redirect to dashboard
          navigate('/dashboard')
        } else {
          setError('No access token received from server')
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Error exchanging code for token:', err)
        const errorMessage = err.response?.data?.error || 
                            err.response?.data?.message || 
                            err.message || 
                            'Failed to authenticate'
        const errorDetails = err.response?.data?.details || ''
        setError(
          `${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`
        )
        setLoading(false)
      })
  }, [searchParams, navigate])

  if (loading) {
    return (
      <div className="auth-callback-container">
        <div className="loading-spinner"></div>
        <p>Authenticating with Zid...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="error-message">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback

