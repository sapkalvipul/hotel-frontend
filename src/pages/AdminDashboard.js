import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { FaUsers, FaHotel, FaMoneyBillWave, FaClock, FaCheckCircle, FaExclamationCircle, FaStar } from "react-icons/fa";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_bookings: 0,
    total_revenue: 0,
    total_users: 0,
    pending_bookings: 0,
    emergency_count: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [specialRequests, setSpecialRequests] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await API.get("/admin/stats");
      const bookingsRes = await API.get("/admin/bookings");
      const emergencyRes = await API.get("/admin/emergency");
      const specialRes = await API.get("/admin/special");

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 5));
      setEmergencies(emergencyRes.data);
      setSpecialRequests(specialRes.data);

      // Process bookings for trend chart (Last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toISOString().split('T')[0],
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          bookings: 0
        };
      });

      bookingsRes.data.forEach(b => {
        const dateStr = new Date(b.created_at || b.checkin).toISOString().split('T')[0]; // Use created_at if available, else checkin
        const dayStat = last7Days.find(d => d.date === dateStr);
        if (dayStat) {
          dayStat.bookings += 1;
        }
      });

      setTrendData(last7Days);

      setLoading(false);
    } catch (err) {
      console.error("Admin data fetch failed");
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage={true} />;

  return (
    <div className="admin-dashboard">
      <div className="page-header" style={{ marginBottom: "30px" }}>
        <h1>Admin Overview</h1>
        <p>Real-time analytics and management system.</p>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>TOTAL BOOKINGS</span>
            <FaHotel style={{ color: "var(--primary)" }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>{stats.total_bookings}</div>
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "5px" }}>+12% from last week</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>TOTAL REVENUE</span>
            <FaMoneyBillWave style={{ color: "#16a34a" }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>₹{stats.total_revenue?.toLocaleString() || "0"}</div>
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "5px" }}>+8.5% growth</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>ACTIVE USERS</span>
            <FaUsers style={{ color: "var(--secondary)" }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>{stats.total_users}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "5px" }}>Across 3 branches</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>PENDING</span>
            <FaClock style={{ color: "#f59e0b" }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800" }}>{stats.pending_bookings}</div>
          <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "5px" }}>Active Booking</div>
        </div>
        {stats.emergency_count > 0 && (
          <div className="card" style={{ background: "#fef2f2", border: "1px solid #fee2e2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <span style={{ fontSize: "14px", color: "#b91c1c", fontWeight: "700" }}>ACTIVE EMERGENCIES</span>
              <FaExclamationCircle style={{ color: "#ef4444" }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#b91c1c" }}>{stats.emergency_count}</div>
            <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", fontWeight: "600" }}>Immediate attention required</div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: "30px", marginBottom: "30px" }}>
        {/* Charts Section */}
        <div className="card">
          <h3 style={{ marginBottom: "25px" }}>Booking Analytics</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: '700' }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: "25px" }}>Revenue by Category</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Deluxe", value: 45000 },
                { name: "Premium", value: 32000 },
                { name: "Standard", value: 18000 }
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  <Cell fill="var(--primary)" />
                  <Cell fill="var(--secondary)" />
                  <Cell fill="var(--info)" />
                </Bar>
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "20px" }}>Recent Bookings</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "15px", fontSize: "13px", color: "var(--text-muted)" }}>GUEST</th>
                <th style={{ padding: "15px", fontSize: "13px", color: "var(--text-muted)" }}>ROOM</th>
                <th style={{ padding: "15px", fontSize: "13px", color: "var(--text-muted)" }}>CHECK-IN</th>
                <th style={{ padding: "15px", fontSize: "13px", color: "var(--text-muted)" }}>TOTAL</th>
                <th style={{ padding: "15px", fontSize: "13px", color: "var(--text-muted)" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "15px", fontWeight: "600" }}>{booking.user_name}</td>
                  <td style={{ padding: "15px" }}>{booking.room_name}</td>
                  <td style={{ padding: "15px", color: "var(--text-muted)" }}>{new Date(booking.checkin).toLocaleDateString()}</td>
                  <td style={{ padding: "15px", fontWeight: "700" }}>₹{booking.total_price.toLocaleString()}</td>
                  <td style={{ padding: "15px" }}>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status === "confirmed" ? <FaCheckCircle size={10} /> : <FaClock size={10} />} {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Emergencies Table */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#b91c1c" }}>
            <FaExclamationCircle /> Active Emergencies
          </h3>
          <div style={{ overflowX: "auto" }}>
            {emergencies.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#fef2f2", borderBottom: "1px solid #fee2e2" }}>
                    <th style={{ padding: "12px", fontSize: "12px", color: "#b91c1c" }}>GUEST</th>
                    <th style={{ padding: "12px", fontSize: "12px", color: "#b91c1c" }}>TYPE</th>
                    <th style={{ padding: "12px", fontSize: "12px", color: "#b91c1c" }}>TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencies.map((e) => (
                    <tr key={e.id} style={{ borderBottom: "1px solid #fee2e2" }}>
                      <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{e.user_name}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "12px", background: "#fee2e2", color: "#ef4444", fontSize: "12px", fontWeight: "700" }}>
                          {e.type}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                        {new Date(e.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No active emergencies</p>
            )}
          </div>
        </div>

        {/* Special Requests Table */}
        <div className="card">
          <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaStar style={{ color: "var(--primary)" }} /> Special Requests
          </h3>
          <div style={{ overflowX: "auto" }}>
            {specialRequests.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>GUEST</th>
                    <th style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>SERVICE</th>
                    <th style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {specialRequests.slice(0, 5).map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600" }}>{r.user_name}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{r.type || r.request || "General"}</td>
                      <td style={{ padding: "12px" }}>
                        <span className={`status-badge ${r.status.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No requests found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
