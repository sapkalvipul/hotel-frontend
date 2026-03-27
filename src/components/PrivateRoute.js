import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullPage={true} />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin tries to access user dashboard, let Layout/Sidebar handle redirection if necessary
  // but usually we just allow it if they are logged in.

  return children;
};

export default PrivateRoute;
