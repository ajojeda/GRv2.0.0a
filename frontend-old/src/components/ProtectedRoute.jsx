import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Wraps any route/component that requires:
 *  - Authentication
 *  - (Optionally) a specific module-level permission
 *
 * Props:
 *  - moduleKey: string (e.g. "User Management")
 */
export default function ProtectedRoute({ children, moduleKey }) {
  const { user } = useAuth();

  // 1) Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2) Admin bypasses permission checks
  if (user.sysAdmin) {
    return children;
  }

  // 3) No permissions loaded yet → do not render content (still loading)
  if (!user.permissions) {
    return <div className="min-h-screen flex items-center justify-center">Loading permissions...</div>;
  }

  // 4) No access to this module → redirect to dashboard
  if (moduleKey && !user.permissions[moduleKey]?.visible) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // 5) All good → render the protected content
  return children;
}