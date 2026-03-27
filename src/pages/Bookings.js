import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === "admin" ? "/admin/bookings" : "/bookings/my";
      const res = await API.get(endpoint);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      setError("Unable to load bookings. Please try again later.");
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <span className="status-badge confirmed"><FaCheckCircle /> Confirmed</span>;
      case "cancelled":
        return <span className="status-badge cancelled"><FaTimesCircle /> Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="bookings-page">
      <div className="page-header" style={{ marginBottom: "30px" }}>
        <h1>{user?.role === "admin" ? "All Bookings" : "My Bookings"}</h1>
        <p>Manage your reservations and stay history.</p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div className="bookings-list" style={{ display: "grid", gap: "20px" }}>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="card booking-card" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", padding: "20px" }}>
              <div className="booking-info">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0 }}>{booking.room_name}</h3>
                  {getStatusBadge(booking.status)}
                </div>

                <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", fontSize: "14px", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCalendarAlt style={{ color: "var(--primary)" }} />
                    <strong>Check-in:</strong> {new Date(booking.checkin).toLocaleDateString()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCalendarAlt style={{ color: "var(--primary)" }} />
                    <strong>Check-out:</strong> {new Date(booking.checkout).toLocaleDateString()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong>Total Price:</strong> <span style={{ color: "var(--primary)", fontWeight: "700" }}>₹{(booking.total_price || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="booking-actions">

                {booking.status !== "cancelled" && (
                  <button
                    className="btn-secondary"
                    onClick={() => handleCancel(booking.id)}
                    style={{ background: "#fff1f2", color: "#e11d48", border: "1px solid #fecaca" }}
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: "60px", textAlign: "center" }}>
            <h2 style={{ color: "var(--text-muted)", marginBottom: "20px" }}>No bookings found.</h2>
            <p style={{ marginBottom: "25px", color: "var(--text-muted)" }}>You haven't made any reservations yet. Start exploring our rooms!</p>
            <button className="btn-primary" onClick={() => window.location.href = "/rooms"}>Explore Rooms</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
