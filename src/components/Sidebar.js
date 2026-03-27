import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaCalendarCheck,
  FaUser,
  FaStar,
  FaExclamationTriangle,
  FaBed,
  FaSignOutAlt,
  FaChevronRight
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const { logout, user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  const menuItems = isAdmin ? [
    { name: t("common.dashboard"), path: "/admin", icon: <FaThLarge /> },
    { name: t("common.rooms"), path: "/rooms", icon: <FaBed /> },
    { name: "Users", path: "/users", icon: <FaUser /> },
    { name: "Bookings", path: "/bookings", icon: <FaCalendarCheck /> },
    { name: "Reports", path: "/admin", icon: <FaExclamationTriangle /> },
  ] : [
    { name: t("common.dashboard"), path: "/dashboard", icon: <FaThLarge /> },
    { name: t("common.rooms"), path: "/rooms", icon: <FaBed /> },
    { name: t("common.bookings"), path: "/bookings", icon: <FaCalendarCheck /> },
    { name: t("common.profile"), path: "/profile", icon: <FaUser /> },
    { name: t("common.special_requests"), path: "/special-request", icon: <FaStar /> },
    { name: t("common.emergency"), path: "/emergency", icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className="sidebar-main">
      <div className="sidebar-brand">
        <div className="brand-icon">🏨</div>
        <h2>Hotel Booking System</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`menu-item ${isActive ? "active" : ""}`}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-text">{item.name}</span>
              {isActive && <FaChevronRight className="active-arrow" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
