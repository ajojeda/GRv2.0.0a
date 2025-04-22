// frontend/src/routes/index.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/Users';
import Roles from '../pages/Roles/Roles';
import Sites from '../pages/Sites/Sites';
import Login from '../pages/Login/Login';
import { usePermissions } from '../context/PermissionsContext';

export default function AppRoutes() {
  const { user, setUserContext } = usePermissions();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/auth/refresh', { credentials: 'include' });
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUserContext(data.user, data.permissions);
      } catch (err) {
        console.warn('⚠️ Not authenticated:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUserContext]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  const isAuthed = !!user;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={isAuthed ? <MainLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="sites" element={<Sites />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={isAuthed ? '/' : '/login'} replace />} />
    </Routes>
  );
}