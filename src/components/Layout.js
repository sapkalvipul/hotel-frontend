import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Navigate, Link } from "react-router-dom";
import { FaSearch, FaGlobe, FaBell, FaUserCircle, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function Layout({ children }) {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [isBackendUp, setIsBackendUp] = useState(true);
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        // Health check
        const checkHealth = async () => {
            try {
                await API.get("/health");
                setIsBackendUp(true);
            } catch (err) {
                setIsBackendUp(false);
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
        setShowLangMenu(false);
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "hi", name: "हिंदी" },
        { code: "mr", name: "मराठी" }
    ];

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="layout-wrapper">
            {/* Unified Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="layout-main">
                {!isBackendUp && (
                    <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 30px", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "600", borderBottom: "1px solid #fecaca", zIndex: 1000, position: "sticky", top: 0 }}>
                        <FaExclamationTriangle /> Backend server is currently unreachable. Some features may not work.
                    </div>
                )}
                {/* Top Header Bar */}
                <header className="top-bar">
                    <div className="top-search">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder={t("common.search")} />
                    </div>

                    <div className="top-actions">
                        <div className="action-item" style={{ position: "relative" }} onClick={() => setShowLangMenu(!showLangMenu)}>
                            <FaGlobe />
                            <span>{languages.find(l => l.code === i18n.language)?.name || "English"}</span>

                            {showLangMenu && (
                                <div className="card" style={{ position: "absolute", top: "45px", right: 0, width: "150px", padding: "10px", zIndex: 1001, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", textAlign: "left" }}>
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.code}
                                            className="lang-option"
                                            style={{
                                                padding: "10px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                fontSize: "14px",
                                                color: i18n.language === lang.code ? "var(--primary)" : "var(--text-main)",
                                                background: i18n.language === lang.code ? "#f1f5f9" : "transparent",
                                                marginBottom: "4px"
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                changeLanguage(lang.code);
                                            }}
                                        >
                                            {lang.name}
                                            {i18n.language === lang.code && <FaCheck size={10} />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="action-item">
                            <FaBell />
                            <span className="badge">3</span>
                        </div>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                            <Link to="/profile">
                                <FaUserCircle className="profile-icon" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
