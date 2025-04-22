// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const fullSysAdminPermissions = {
    Dashboard: { visible: true, actions: {} },
    "User Management": {
      visible: true,
      actions: {
        "Create User": true,
        "Edit User": true,
        "Delete User": true,
      },
      fields: {
        Email: "read/write",
        Role: "read/write",
      },
    },
    Tasks: {
      visible: true,
      actions: {
        "Create Task": true,
        "Edit Task": true,
      },
    },
    "Site Management": {
      visible: true,
      actions: {
        "Edit Site": true,
      },
    },
    "Role Management": {
      visible: true,
      actions: {
        "Edit Role": true,
      },
    },
  };

  const fetchPermissions = async (user) => {
    if (user?.sysAdmin) {
      console.log("🛡️ sysAdmin detected — injecting full permissions");
      return fullSysAdminPermissions;
    }

    try {
      const resp = await api.get("/roles/permissions");
      return resp.data.permissions || {};
    } catch (err) {
      console.error("❌ Failed to fetch permissions", err);
      return {};
    }
  };

  const login = async (email, password) => {
    const resp = await api.post("/auth/login", { email, password });
    const permissions = await fetchPermissions(resp.data.user);

    console.log("👤 Login user:", resp.data.user);
    console.log("🔐 Permissions received:", permissions);

    setUser({ ...resp.data.user, permissions });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.post("/auth/refresh");
        const permissions = await fetchPermissions(resp.data.user);

        console.log("🔄 Refreshed user:", resp.data.user);
        console.log("🔐 Permissions from refresh:", permissions);

        setUser({ ...resp.data.user, permissions });
      } catch (err) {
        console.log("⚠️ No valid session:", err.response?.status);
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);