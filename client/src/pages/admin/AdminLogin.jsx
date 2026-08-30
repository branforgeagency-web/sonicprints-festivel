import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function AdminLogin() {
  const { admin, checking, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (checking) return null;
  if (admin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not sign in with provided credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin luxury-admin">
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-logo">✦</div>
          <h1>Sonic Prints Admin</h1>
          <p>Sign in to the Executive Suite to manage store orders, corporate enquiries, and product catalog.</p>
          
          {error && <div className="admin-error">⚠️ {error}</div>}
          
          <form className="admin-form" onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <label>Admin Email</label>
            <input
              type="email"
              placeholder="admin@sonicprints.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button className="admin-btn" type="submit" disabled={submitting} style={{ width: "100%", marginTop: 8 }}>
              {submitting ? "Authenticating…" : "Sign In to Executive Suite"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
