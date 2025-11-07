# SmartFit AI - Zid OAuth Integration

A React application integrated with Zid OAuth system for authentication.

## 🚀 Features

- React + Vite frontend
- Zid OAuth integration
- Serverless API route for secure token exchange
- Dashboard to display authenticated token
- Ready for Vercel deployment

## 📁 Project Structure

```
├── src/
│   ├── pages/
│   │   ├── AuthCallback.jsx    # Handles OAuth redirect
│   │   ├── AuthCallback.css
│   │   ├── Dashboard.jsx        # Displays token after auth
│   │   └── Dashboard.css
│   ├── App.jsx                  # Main app with routing
│   ├── App.css
│   └── main.jsx
├── api/
│   └── authCallback.js         # Vercel serverless function
├── vercel.json                  # Vercel configuration
└── package.json
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with:

```env
REACT_APP_ZID_CLIENT_ID=your_client_id_here
# or
VITE_ZID_CLIENT_ID=your_client_id_here

ZID_CLIENT_SECRET=your_client_secret_here
```

**Note:** 
- `REACT_APP_ZID_CLIENT_ID` or `VITE_ZID_CLIENT_ID` can be used (Vite will use `VITE_` prefix)
- `ZID_CLIENT_SECRET` is only used in the serverless function and should NEVER be exposed to the frontend

### 3. Local Development

For local development, you'll need to:

1. **Run the Vite dev server:**
   ```bash
   npm run dev
   ```

2. **For testing the API locally**, you can use Vercel CLI:
   ```bash
   npm install -g vercel
   vercel dev
   ```

   Or set up a simple Express server for local API testing (see below).

### 4. Build for Production

```bash
npm run build
```

## 🌐 Deployment on Vercel

1. **Push your code to GitHub**

2. **Import your project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `REACT_APP_ZID_CLIENT_ID` or `VITE_ZID_CLIENT_ID` (your Zid client ID)
     - `ZID_CLIENT_SECRET` (your Zid client secret)

4. **Deploy!**

   Vercel will automatically detect the Vite configuration and deploy your app.

5. **Update Redirect URI:**
   - Make sure your Zid OAuth app's redirect URI matches: `https://your-app.vercel.app/auth/callback`

## 🔄 OAuth Flow

1. User clicks "Connect with Zid" on the home page
2. User is redirected to Zid OAuth authorization page
3. After authorization, Zid redirects to `/auth/callback?code=XYZ`
4. The callback page extracts the code and calls `/api/authCallback?code=XYZ`
5. The serverless function exchanges the code for an access token
6. The token is stored in localStorage and user is redirected to `/dashboard`
7. Dashboard displays the stored token

## 📝 API Route

The `/api/authCallback` endpoint:
- Receives the authorization `code` from query params
- Exchanges it for an `access_token` using Zid's token endpoint
- Returns the `access_token` to the frontend

**Security Note:** The client secret is only used server-side in the Vercel serverless function and never exposed to the client.

## 🧪 Testing Locally

For local testing, you can create a simple Express server:

```bash
npm install express cors dotenv
```

Create `server.js`:
```javascript
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())

// Import and use the Vercel function logic
// Or replicate the authCallback logic here

app.listen(3000, () => {
  console.log('API server running on http://localhost:3000')
})
```

Then run both servers:
- Terminal 1: `node server.js` (or use Vercel CLI: `vercel dev`)
- Terminal 2: `npm run dev`

## 📦 Dependencies

- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API requests
- `vite` - Build tool and dev server

## 🔐 Security Considerations

- Never expose `ZID_CLIENT_SECRET` to the frontend
- Always use HTTPS in production
- Consider implementing token refresh logic
- Store tokens securely (consider httpOnly cookies for production)

## 📄 License

MIT
