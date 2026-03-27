import React, { useState } from "react";
import { FaExclamationTriangle, FaPhoneAlt, FaAmbulance, FaFireExtinguisher, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";

function Emergency() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleEmergency = async (type) => {
    if (!window.confirm(`Are you sure you want to trigger a ${type} emergency alert?`)) return;

    try {
      setLoading(true);
      await API.post("/emergency/create", { type });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      alert("Failed to send emergency alert. Please call the hotline immediately.");
    } finally {
      setLoading(false);
    }
  };

  const emergencyTypes = [
    { id: "Medical", icon: <FaAmbulance />, color: "#ef4444", description: "Immediate medical assistance needed" },
    { id: "Fire", icon: <FaFireExtinguisher />, color: "#f97316", description: "Smoke or fire detected in room" },
    { id: "Security", icon: <FaShieldAlt />, color: "#1e293b", description: "Threat or suspicious activity" },
    { id: "Technical", icon: <FaExclamationTriangle />, color: "#8b5cf6", description: "Gas leak or structural emergency" }
  ];

  if (loading) return <Loader fullPage={true} />;

  return (
    <div className="emergency-page">
      <div className="page-header" style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#b91c1c" }}>Emergency Assistance</h1>
        <p>Immediate response alerts for critical situations.</p>
      </div>

      {sent && (
        <div style={{ background: "#dcfce7", color: "#166534", padding: "20px", borderRadius: "10px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px", fontWeight: "600" }}>
          <FaCheckCircle /> Emergency alert has been sent. Help is on the way.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", maxWidth: "900px" }}>
        {emergencyTypes.map((type) => (
          <div
            key={type.id}
            className="card emergency-card"
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              padding: "25px",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            onClick={() => handleEmergency(type.id)}
          >
            <div style={{ width: "60px", height: "60px", borderRadius: "15px", background: type.color, color: "#white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
              {type.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "5px" }}>{type.id} Emergency</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>{type.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "40px", background: "#fef2f2", border: "1px solid #fee2e2", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px" }}>
        <div>
          <h2 style={{ color: "#b91c1c", marginBottom: "10px" }}>Direct Hotline</h2>
          <p style={{ color: "#991b1b", margin: 0 }}>Available 24/7 for immediate voice assistance.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#b91c1c", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaPhoneAlt size={24} /> +91 1800-HOTEL-HELP
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px", color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>
        <p>Triggering false emergency alerts may result in penalties. Use only in real emergencies.</p>
      </div>
    </div>
  );
}

export default Emergency;
