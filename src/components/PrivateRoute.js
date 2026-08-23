import React from "react";
import { Navigate } from "react-router-dom";

// Props: children (component to render), allowedRoles (array of roles allowed)
const PrivateRoute = ({ children, allowedRoles }) => {
  // Get user role from localStorage (set on login/register)
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Logged in but not authorized
    return <Navigate to="/login" replace />;
  }

  // Authorized, render children
  return children;
};

export default PrivateRoute;

