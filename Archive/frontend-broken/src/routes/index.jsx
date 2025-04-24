// frontend/src/routes/index.jsx
import { usePermissions } from '../context/PermissionsContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/Users';
import Roles from '../pages/Roles/Roles';
import Sites from '../pages/Sites/Sites';
import Login from '../pages/Login/Login';
import TestTailwind from '../pages/TestTailwind';

export default function AppRoutes() {
  const { user, loading } = usePermissions();
  const isAuthed = !!user;

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={isAuthed ? <MainLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="sites" element={<Sites />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthed ? '/' : '/login'} replace />} />
      <Route path="/test" element={<TestTailwind />} />
    </Routes>
  );
}
