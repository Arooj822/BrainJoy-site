import React from "react";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default StudentDashboard;



