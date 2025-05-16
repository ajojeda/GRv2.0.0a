import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PermissionsContext } from '../context/PermissionsContext';

const ProtectedRoute = () => {
  const { user } = useContext(PermissionsContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
