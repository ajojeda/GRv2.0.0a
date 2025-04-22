// frontend/src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../utils/api.js";

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  const canView = user?.permissions?.["User Management"]?.visible;

  useEffect(() => {
    if (!canView) return;

    (async () => {
      console.log("🔍 Fetching users…");
      try {
        const { data } = await api.get("/users");
        console.log("📋 Users data:", data);
        setUsers(data);
      } catch (err) {
        console.error("❌ Error loading users:", err);
        setError(
          err.response?.status === 401
            ? "Unauthorized – please log in again."
            : "Failed to load users."
        );
      }
    })();
  }, [canView]);

  if (!canView) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        🚫 Access Denied
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  if (!users) {
    return <p className="p-4">Loading users…</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{u.id}</td>
              <td className="px-4 py-2 border">{u.name}</td>
              <td className="px-4 py-2 border">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}