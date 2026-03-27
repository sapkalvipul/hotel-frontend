import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Loader fullPage={true} />;

    if (!user || user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;
