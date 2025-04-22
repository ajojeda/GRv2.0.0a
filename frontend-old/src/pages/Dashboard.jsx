// frontend/src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  useEffect(() => console.log("🏠 Dashboard mounted"), []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user.email}!
        </h1>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}