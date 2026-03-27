import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaSnowflake, FaChevronRight } from "react-icons/fa";
import API from "../api/axiosConfig";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";

function Rooms() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "All",
    ac: "All",
    price: "All"
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await API.get("/rooms");
      setRooms(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch rooms. Please check your backend connection.");
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const typeMatch = filters.type === "All" || room.category === filters.type;
    const acMatch = filters.ac === "All" || (filters.ac === "AC" ? room.ac_type === "AC" : room.ac_type !== "AC");
    const priceMatch = filters.price === "All" ||
      (filters.price === "Under 3000" && room.price <= 3000) ||
      (filters.price === "3000-5000" && room.price > 3000 && room.price <= 5000) ||
      (filters.price === "Over 5000" && room.price > 5000);

    return typeMatch && acMatch && priceMatch;
  });

  if (loading) return <Loader fullPage={false} />;

  if (error) {
    return (
      <div className="error-message">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchRooms}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <div className="page-header">
        <h1>{t("rooms.title")}</h1>
        <p>{t("rooms.subtitle")}</p>
      </div>

      <div className="card filter-section" style={{ marginBottom: "30px", display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary)", fontWeight: "600" }}>
          <FaFilter /> {t("rooms.filters")}:
        </div>

        <select
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
        >
          <option value="All">{t("rooms.all_categories")}</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Premium">Premium</option>
          <option value="Standard">Standard</option>
          <option value="Executive">Executive Suite</option>
          <option value="Family">Family Room</option>
        </select>

        <select
          className="filter-select"
          value={filters.ac}
          onChange={(e) => setFilters({ ...filters, ac: e.target.value })}
          style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
        >
          <option value="All">{t("rooms.all_ac")}</option>
          <option value="AC">AC Rooms</option>
          <option value="Non-AC">Non-AC Rooms</option>
        </select>

        <select
          className="filter-select"
          value={filters.price}
          onChange={(e) => setFilters({ ...filters, price: e.target.value })}
          style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
        >
          <option value="All">{t("rooms.all_prices")}</option>
          <option value="Under 3000">Under ₹3000</option>
          <option value="3000-5000">₹3000 - ₹5000</option>
          <option value="Over 5000">Over ₹5000</option>
        </select>

        <div style={{ marginLeft: "auto", fontSize: "14px", color: "var(--text-muted)" }}>
          Showing {filteredRooms.length} rooms
        </div>
      </div>

      <div className="room-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <div key={room.id} className="card room-card">
              <div style={{ position: "relative" }}>
                <img src={JSON.parse(room.images || "[]")[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} alt={room.name} className="room-image" />
                <span className={`status-badge ${room.is_available ? "available" : "full"}`} style={{ position: "absolute", top: "15px", right: "15px" }}>
                  {room.is_available ? `${room.availability_count} ${t("rooms.available")}` : t("rooms.full")}
                </span>
              </div>

              <div className="room-details">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600", textTransform: "uppercase" }}>{room.category}</span>
                  {room.ac_type === "AC" && <span title="Air Conditioned" style={{ color: "var(--info)" }}><FaSnowflake /></span>}
                </div>
                <h3 style={{ marginBottom: "10px" }}>{room.name}</h3>
                <div className="room-price">₹{room.price.toLocaleString()} <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "400" }}>/ night</span></div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/room/${room.id}`)}
                  >
                    {t("rooms.book_now")}
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ background: "#f1f5f9", border: "none", color: "#1e293b", padding: "10px", borderRadius: "10px", cursor: "pointer" }}
                    onClick={() => navigate(`/room/${room.id}`)}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px" }}>
            <h2 style={{ color: "var(--text-muted)" }}>No rooms found matching your criteria.</h2>
            <button className="btn-primary" style={{ marginTop: "20px" }} onClick={() => setFilters({ type: "All", ac: "All", price: "All" })}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;
