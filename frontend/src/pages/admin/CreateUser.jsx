// frontend/src/pages/admin/CreateUser.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { hasPermission, fieldAccess } from "../../utils/permissions.js";

export default function CreateUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", name: "", role: "" });
  const [error, setError] = useState("");

  if (!hasPermission(user, "User Management", "Create User")) {
    return <p className="p-4 text-red-500">You do not have permission to create users.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      navigate("/app/users");
    } catch (err) {
      console.error("❌ Failed to create user", err);
      setError("Failed to create user");
    }
  };

  const renderField = (label, name) => {
    const access = fieldAccess(user, "User Management", label);
    if (access === "hidden") return null;
    const readOnly = access === "read";
    return (
      <div className="mb-4">
        <label className="block mb-1">{label}</label>
        <input
          type="text"
          name={name}
          value={form[name]}
          onChange={handleChange}
          readOnly={readOnly}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    );
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded">
        {renderField("Email", "email")}
        {renderField("Name", "name")}
        {renderField("Role", "role")}
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
