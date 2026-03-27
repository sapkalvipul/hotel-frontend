import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaStar, FaWallet, FaBolt, FaArrowRight, FaMapMarkerAlt, FaConciergeBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    activeBookings: 0,
    rewardPoints: 1250,
    totalStays: 0
  });
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const bookingRes = await API.get("/bookings/my");
      const active = bookingRes.data.filter(b => b.status === "confirmed").length;
      const latest = bookingRes.data.find(b => b.status === "confirmed");

      setStats({
        activeBookings: active,
        rewardPoints: 1250,
        totalStays: bookingRes.data.length
      });
      setUpcoming(latest);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard data fetch failed");
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page">
      <div className="welcome-banner" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)", padding: "40px", borderRadius: "20px", color: "white", marginBottom: "30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>{t("dashboard.banner_title", { name: user?.name })}</h1>
          <p style={{ fontSize: "16px", opacity: "0.9" }}>{t("dashboard.banner_subtitle")}</p>
        </div>
        <div style={{ position: "absolute", right: "-20px", top: "-20px", opacity: 0.1 }}>
          <FaBolt size={200} />
        </div>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px", marginBottom: "30px" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "15px", background: "#eef2ff", color: "var(--primary)", borderRadius: "12px" }}>
            <FaCalendarCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{stats.activeBookings}</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("dashboard.active_bookings")}</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "15px", background: "#fef9c3", color: "#a16207", borderRadius: "12px" }}>
            <FaStar size={24} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{stats.rewardPoints}</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("dashboard.reward_points")}</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ padding: "15px", background: "#ecfdf5", color: "#059669", borderRadius: "12px" }}>
            <FaWallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>{stats.totalStays}</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("dashboard.total_stays")}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "30px" }}>
        {/* Upcoming Reservation */}
        <div>
          <h3 style={{ marginBottom: "20px" }}>{t("dashboard.upcoming")}</h3>
          {upcoming ? (
            <div className="card" style={{ display: "flex", gap: "25px", padding: "25px" }}>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                alt="Room"
                style={{ width: "200px", height: "140px", borderRadius: "12px", objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h2 style={{ fontSize: "22px", margin: 0 }}>{upcoming.room_name}</h2>
                  <span className="status-badge confirmed">Confirmed</span>
                </div>
                <div style={{ display: "flex", gap: "20px", marginBottom: "15px", fontSize: "14px", color: "var(--text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaMapMarkerAlt /> Antigravity Grand, Mumbai</span>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>CHECK-IN</div>
                    <div style={{ fontSize: "15px", fontWeight: "700" }}>{new Date(upcoming.checkin).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>CHECK-OUT</div>
                    <div style={{ fontSize: "15px", fontWeight: "700" }}>{new Date(upcoming.checkout).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--text-muted)" }}>No upcoming reservations found.</p>
              <Link to="/rooms" className="btn-primary" style={{ display: "inline-block", marginTop: "15px", textDecoration: "none" }}>Book Now</Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 style={{ marginBottom: "20px" }}>{t("dashboard.quick_actions")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <Link to="/rooms" className="card action-link" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", color: "inherit", padding: "20px", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ width: "40px", height: "40px", background: "#fef2f2", color: "#ef4444", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><FaBolt /></div>
                <div>
                  <div style={{ fontWeight: "700" }}>{t("dashboard.book_room")}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Browse available luxury suites</div>
                </div>
              </div>
              <FaArrowRight color="#cbd5e1" />
            </Link>
            <Link to="/special-request" className="card action-link" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", color: "inherit", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ width: "40px", height: "40px", background: "#ecfdf5", color: "#10b981", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><FaConciergeBell /></div>
                <div>
                  <div style={{ fontWeight: "700" }}>{t("dashboard.request_service")}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Order food or laundry service</div>
                </div>
              </div>
              <FaArrowRight color="#cbd5e1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
