// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  useEffect(() => console.log("🔑 Login mounted"), []);

  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("admin@goodierun.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label htmlFor="email" className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1 block w-full border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor="password" className="block mb-6">
          <span className="text-gray-700">Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 block w-full border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}