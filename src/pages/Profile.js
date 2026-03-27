import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function Profile() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: ""
    });
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.name || "",
                email: user.email || "",
                phoneNumber: user.phone_number || ""
            });
        }
    }, [user]);

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
            setMessage({ type: "error", text: "Phone number must be exactly 10 digits!" });
            return;
        }
        setLoading(true);
        setMessage({ type: "", text: "" });

        const res = await updateProfile(formData);
        if (res.success) {
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } else {
            setMessage({ type: "error", text: res.message });
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: "error", text: "New passwords don't match" });
            return;
        }

        const res = await updateProfile({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        });

        if (res.success) {
            setMessage({ type: "success", text: "Password updated successfully!" });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            setMessage({ type: "error", text: res.message });
        }
    };

    if (!user) return <Loader fullPage={true} />;

    return (
        <div className="profile-page">
            <div className="page-header" style={{ marginBottom: "30px" }}>
                <h1>Account Settings</h1>
                <p>Manage your profile information and security preferences.</p>
            </div>

            {message.text && (
                <div style={{
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    background: message.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: message.type === "success" ? "#166534" : "#991b1b",
                    border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    {message.type === "success" ? <FaCheckCircle /> : <FaLock />} {message.text}
                </div>
            )}

            <div className="profile-container" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
                {/* Profile Card */}
                <div className="profile-sidebar">
                    <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
                        <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px" }}>
                            <img
                                src={user.profile_photo || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=120`}
                                alt="Profile"
                                style={{ borderRadius: "50%", border: "4px solid #f1f5f9", width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <button
                                onClick={() => {
                                    const url = prompt("Enter Image URL for profile photo:");
                                    if (url) {
                                        // Simplified photo update call (ideally add to AuthContext)
                                        import("../api/axiosConfig").then(m => {
                                            m.default.put("/user/update-photo", { photoUrl: url })
                                                .then(() => alert("Photo updated! Please refresh."))
                                                .catch(() => alert("Failed to update photo"));
                                        });
                                    }
                                }}
                                style={{ position: "absolute", bottom: "5px", right: "5px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <FaCamera size={14} />
                            </button>
                        </div>
                        <h2 style={{ marginBottom: "5px" }}>{user.name}</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "14px", textTransform: "capitalize" }}>{user.role} Account</p>

                        <div style={{ marginTop: "30px", textAlign: "left", background: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
                            <h4 style={{ marginBottom: "10px", fontSize: "13px", color: "var(--text-muted)" }}>ACCOUNT DETAILS</h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", fontSize: "14px" }}>
                                <FaEnvelope style={{ color: "var(--primary)" }} /> {user.email}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
                                <FaPhone style={{ color: "var(--primary)" }} /> {user.phone_number || "Not provided"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Forms */}
                <div className="profile-content">
                    <div className="card" style={{ marginBottom: "30px" }}>
                        <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaUser style={{ color: "var(--primary)" }} /> Personal Information
                        </h3>
                        <form onSubmit={handleInfoSubmit}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                                <div className="form-group">
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: "25px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ maxWidth: "300px" }}
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val.length <= 10) {
                                            setFormData({ ...formData, phoneNumber: val });
                                        }
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaLock style={{ color: "var(--secondary)" }} /> Security & Password
                        </h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group" style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    style={{ maxWidth: "400px" }}
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                                <div className="form-group">
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-secondary">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
