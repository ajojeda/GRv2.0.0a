import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Nav() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  return user ? (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <span style={{ marginRight: '1rem' }}>Hello, {user.email}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  ) : null;
}
