// Vercel serverless function to handle Zid OAuth callback
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { code } = req.query

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' })
  }

  // Get credentials from environment variables
  // Try multiple possible env var names for client ID
  const clientId = process.env.REACT_APP_ZID_CLIENT_ID || 
                   process.env.VITE_ZID_CLIENT_ID || 
                   process.env.ZID_CLIENT_ID || 
                   '5374' // Fallback for debugging - should be set via env vars in production
  const clientSecret = process.env.ZID_CLIENT_SECRET
  
  // Redirect URI must match exactly what was used in the authorization request
  // Use environment variable or fallback to production URL
  const redirectUri = process.env.ZID_REDIRECT_URI || 
    (process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/auth/callback`
      : 'https://smartfit-ai-theta.vercel.app/auth/callback')
  
  console.log('Token exchange request:', {
    hasCode: !!code,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    redirectUri
  })

  if (!clientId || !clientSecret) {
    console.error('Missing environment variables:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      envVarsChecked: [
        'REACT_APP_ZID_CLIENT_ID',
        'VITE_ZID_CLIENT_ID', 
        'ZID_CLIENT_ID',
        'ZID_CLIENT_SECRET'
      ]
    })
    return res.status(500).json({
      error: 'Server configuration error: Missing Zid credentials',
      message: 'Please ensure ZID_CLIENT_SECRET is set in Vercel environment variables',
      details: {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      }
    })
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth.zid.sa/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        body: errorText,
      })
      return res.status(tokenResponse.status).json({
        error: 'Failed to exchange authorization code for token',
        details: errorText,
      })
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return res.status(500).json({
        error: 'No access token in response',
        response: tokenData,
      })
    }

    // Return the access token to the frontend
    return res.status(200).json({
      access_token: tokenData.access_token,
    })
  } catch (error) {
    console.error('Error in authCallback:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    })
  }
}

