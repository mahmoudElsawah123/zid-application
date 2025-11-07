import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      setError("No authorization code found");
      setLoading(false);
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await fetch(
          "https://smartfit-ai-theta.vercel.app/api/authCallback",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem("zid_token", data.access_token);
          navigate("/dashboard");
        } else {
          setError("Failed to get access token");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    exchangeCode();
  }, [navigate]);

  if (loading) return <div>⏳ جاري الاتصال بمتجر زد...</div>;
  if (error) return <div>❌ خطأ: {error}</div>;

  return null;
}
