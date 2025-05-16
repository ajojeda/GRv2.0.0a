import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PermissionsContext } from './context/PermissionsContext';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Roles from './pages/Roles/Roles';
import Sites from './pages/Sites/Sites';
import Departments from './pages/Departments/Departments';
import Tasks from './pages/Tasks/Tasks';
import Login from './pages/Login/Login';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { loading } = useContext(PermissionsContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
