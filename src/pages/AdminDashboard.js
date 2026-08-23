// src/pages/AdminDashboard.js
import React from "react";
import { logoutUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Manage users, roles, content, and platform analytics here.</p>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
    </div>
  );
};

export default AdminDashboard;
