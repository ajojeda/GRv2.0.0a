// 📁 /src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true); // <-- NEW

  // New: Check if session exists
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        setUser(res.data.user);
        setPermissions(res.data.permissions);
      } catch (err) {
        console.error('No active session:', err);
        setUser(null);
        setPermissions(null);
      } finally {
        setLoading(false); // Session check done
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password }, { withCredentials: true });
    setUser(res.data.user);
    setPermissions(res.data.permissions);
  };

  const logout = async () => {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    setPermissions(null);
  };

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
