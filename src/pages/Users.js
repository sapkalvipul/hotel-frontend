import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";
import { FaUser, FaEnvelope, FaPhone, FaTrash } from "react-icons/fa";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load users.");
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await API.delete(`/admin/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            alert("Failed to delete user. They might have active bookings.");
        }
    };

    if (loading) return <Loader fullPage={false} />;

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>User Management</h1>
                <p>View and manage registered users.</p>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="users-list" style={{ display: "grid", gap: "20px" }}>
                {users.map((user) => (
                    <div key={user.id} className="card user-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                        <div className="user-avatar" style={{ background: "#e2e8f0", padding: "15px", borderRadius: "50%" }}>
                            <FaUser size={24} color="#64748b" />
                        </div>
                        <div className="user-info">
                            <h3>{user.username}</h3>
                            <div style={{ display: "flex", gap: "15px", color: "var(--text-muted)", fontSize: "14px" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><FaEnvelope /> {user.email}</span>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><FaPhone /> {user.phone_number}</span>
                                <span className={`role-badge ${user.role}`} style={{ padding: "2px 8px", borderRadius: "4px", background: user.role === "admin" ? "#dbeafe" : "#f1f5f9", color: user.role === "admin" ? "#1e40af" : "#475569" }}>{user.role}</span>
                            </div>
                        </div>
                        {user.role !== "admin" && (
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                style={{ marginLeft: "auto", background: "#fee2e2", color: "#ef4444", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }}
                                title="Delete User"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
