import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus, FaArrowLeft } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "phoneNumber") {
      const val = e.target.value.replace(/\D/g, ""); // Only digits
      if (val.length <= 10) {
        setFormData({ ...formData, phoneNumber: val });
      }
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });

      alert("Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      const msg = err.response?.data?.message || "Registration Failed. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card" style={{ width: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🌟</div>
          <h1 style={{ fontSize: "28px", color: "var(--text-header)" }}>Join Us</h1>
          <p style={{ color: "var(--text-muted)" }}>Experience the finest hotel stays today.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label><FaUser /> Username</label>
              <input type="text" name="username" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><FaPhone /> Phone</label>
              <input type="text" name="phoneNumber" placeholder="+91 98765..." value={formData.phoneNumber} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label><FaEnvelope /> Email Address</label>
            <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label><FaLock /> Password</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }} disabled={loading}>
            {loading ? "Processing..." : <>Create Account <FaUserPlus /></>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          <p style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
              Sign In <FaArrowLeft fontSize="12px" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
