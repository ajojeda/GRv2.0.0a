// frontend/src/layout/Topbar.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../context/PermissionsContext';
import { FaBars } from 'react-icons/fa';

export default function Topbar({ toggleSidebar }) {
  const { user, setUserContext } = usePermissions();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUserContext(null, {});
      navigate('/login');
    }
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-2 border-b border-gray-200 z-10">
      {/* Left: Title + Mobile Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-gray-800">
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold text-gray-700">GoodieRun</h1>
      </div>

      {/* Right: User Menu */}
      <div className="relative flex items-center gap-4">
        {/* Notifications */}
        <button
          className="text-gray-500 hover:text-gray-700 transition"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="ml-1 hidden sm:inline">
              {user?.name || user?.email || 'User'}
            </span>
            <span className="material-symbols-outlined ml-1">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
