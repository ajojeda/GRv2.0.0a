import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import RoleManagement from "./pages/admin/RoleManagement.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public login */}
      <Route path="/" element={<Login />} />

      {/* Protected layout for authenticated users */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect /app → /app/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Protected child routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute moduleKey="Dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute moduleKey="User Management">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute moduleKey="Role Management">
              <RoleManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}