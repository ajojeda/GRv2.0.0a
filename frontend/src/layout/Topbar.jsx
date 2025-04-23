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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 bg-white border-b border-gray-200 shadow-sm px-4">
      {/* Sidebar Toggle + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={18} />
        </button>
        <span className="text-lg font-semibold text-gray-800 tracking-tight">
          GoodieRun
        </span>
      </div>

      {/* Notifications & User Menu */}
      <div className="flex items-center gap-4 relative">
        {/* 🔔 Notifications */}
        <button
          title="Notifications"
          aria-label="Notifications"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* 👤 User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition"
            aria-label="User Menu"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="hidden sm:inline font-medium truncate max-w-[120px]">
              {user?.name || user?.email || 'User'}
            </span>
            <span className="material-symbols-outlined">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
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
