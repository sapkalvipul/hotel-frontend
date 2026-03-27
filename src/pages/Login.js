import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaSignInAlt, FaArrowRight } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(result.message || "Login Failed");
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏨</div>
          <h1 style={{ fontSize: "28px", color: "var(--text-header)" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-muted)" }}>Login to manage your hotel appointments.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><FaLock /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input type="checkbox" /> Remember me
            </label>
            <span style={{ color: "var(--primary)", fontWeight: "600", cursor: "pointer" }}>Forgot Password?</span>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} disabled={loading}>
            {loading ? "Signing in..." : <>Sign In <FaSignInAlt /></>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          <p style={{ color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
              Create Account <FaArrowRight fontSize="12px" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
