import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function Home() {
  const clientId = "5374"; // 🔹 Client ID
  const redirectUri = "https://smartfit-ai-theta.vercel.app/auth/callback"; // 🔹 نفس اللي في لوحة زد
  const scopes = "openid products orders webhooks addons";
  const authUrl = `https://oauth.zid.sa/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scopes)}`;

  console.log('OAuth URL:', authUrl);
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>SmartFit AI</h1>
        <p className="subtitle">توصيل متجرك بذكاء الاصطناعي لتوليد الأوتفيت</p>
        <a href={authUrl} className="auth-button">
          🔗 الاتصال بمتجر زد
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
