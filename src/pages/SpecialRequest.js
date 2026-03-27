import React, { useState, useEffect } from "react";
import { FaUtensils, FaConciergeBell, FaTshirt, FaTaxi, FaPaperPlane, FaClock, FaCheckCircle } from "react-icons/fa";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";

function SpecialRequest() {
  const [activeTab, setActiveTab] = useState("Dining");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    details: "",
    urgency: "Normal"
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/special-request/my");
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch requests");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const urgencyMap = {
      "Normal": "low",
      "Urgent": "medium",
      "Immediate": "high"
    };

    try {
      await API.post("/special-request/create", {
        type: activeTab,
        details: formData.details,
        urgency: urgencyMap[formData.urgency]
      });
      setFormData({ details: "", urgency: "Normal" });
      fetchRequests();
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  const categories = [
    { id: "Dining", icon: <FaUtensils />, label: "Room Dining" },
    { id: "Laundry", icon: <FaTshirt />, label: "Laundry Service" },
    { id: "Concierge", icon: <FaConciergeBell />, label: "Concierge" },
    { id: "Transport", icon: <FaTaxi />, label: "Transport" }
  ];

  return (
    <div className="special-request-page">
      <div className="page-header" style={{ marginBottom: "30px" }}>
        <h1>Special Services</h1>
        <p>Request additional services to make your stay more comfortable.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "30px" }}>
        {/* Request Form */}
        <div>
          <div className="card" style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "20px" }}>Place a New Request</h3>

            <div className="service-tabs" style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    flex: 1,
                    padding: "15px",
                    borderRadius: "12px",
                    border: activeTab === cat.id ? "2px solid var(--primary)" : "1px solid #e2e8f0",
                    background: activeTab === cat.id ? "#eef2ff" : "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontSize: "20px", color: activeTab === cat.id ? "var(--primary)" : "#64748b" }}>{cat.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: activeTab === cat.id ? "var(--primary)" : "#64748b" }}>{cat.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Request Details</label>
                <textarea
                  placeholder={`Tell us what you need for ${activeTab}...`}
                  style={{ width: "100%", height: "120px", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", resize: "none" }}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Urgency Level</label>
                <div style={{ display: "flex", gap: "15px" }}>
                  {["Normal", "Urgent", "Immediate"].map((level) => (
                    <label key={level} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                      <input
                        type="radio"
                        name="urgency"
                        value={level}
                        checked={formData.urgency === level}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      /> {level}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 25px" }} disabled={submitting}>
                <FaPaperPlane /> {submitting ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>

        {/* History / Active Requests */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaClock style={{ color: "var(--primary)" }} /> Active Requests
          </h3>

          <div className="active-requests-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {requests.length > 0 ? (
              requests.map((req) => (
                <div key={req.id} style={{ padding: "15px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>{req.type}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ fontSize: "13px", margin: "5px 0", color: "#1e293b" }}>{req.details}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <span style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      background: req.urgency === "Immediate" ? "#fee2e2" : "#e0f2fe",
                      color: req.urgency === "Immediate" ? "#ef4444" : "#0284c7"
                    }}>
                      {req.urgency}
                    </span>
                    <span style={{ fontSize: "12px", color: req.status === "completed" ? "#16a34a" : "#f59e0b", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                      {req.status === "completed" ? <FaCheckCircle size={12} /> : <FaClock size={12} />} {req.status}
                    </span>
                  </div>
                  {req.status === "pending" && (
                    <button
                      onClick={async () => {
                        try {
                          await API.put(`/special-request/update/${req.id}`, { status: "completed" });
                          fetchRequests();
                        } catch (err) {
                          alert("Failed to confirm request");
                        }
                      }}
                      style={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "8px",
                        background: "#dcfce7",
                        color: "#15803d",
                        border: "1px solid #bbf7d0",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#bbf7d0"}
                      onMouseOut={(e) => e.target.style.background = "#dcfce7"}
                    >
                      Confirm Received
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                <p>No active requests currently.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecialRequest;
