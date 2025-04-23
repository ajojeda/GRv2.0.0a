// frontend/src/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../context/PermissionsContext';
import { FaBars, FaUser, FaUsers, FaCog, FaHome } from 'react-icons/fa';

const menuItems = [
  { key: 'Dashboard', label: 'Dashboard', icon: <FaHome />, path: '/' },
  { key: 'User Management', label: 'Users', icon: <FaUsers />, path: '/users' },
  { key: 'Role Management', label: 'Roles', icon: <FaCog />, path: '/roles' },
  { key: 'Site Management', label: 'Sites', icon: <FaUser />, path: '/sites' },
];

export default function Sidebar({ isOpen, toggleSidebar, isMobile, closeSidebar }) {
  const location = useLocation();
  const { canAccess } = usePermissions();
  const [search, setSearch] = useState('');

  const filteredMenu = menuItems.filter(
    (item) => canAccess(item.key) && item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full bg-[#2C2C2C] text-white shadow-md flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}
      aria-label="Sidebar Navigation"
    >
      {/* Top Bar: Toggle & Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#3A3A3A]">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded"
        >
          <FaBars />
        </button>
        {isOpen && (
          <span className="ml-2 text-sm font-semibold truncate">GoodieRun</span>
        )}
      </div>

      {/* Search */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-[#3A3A3A]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#3A3A3A] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Search navigation"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-4 overflow-y-auto space-y-1">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              onClick={isMobile ? closeSidebar : undefined}
              className={`group flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150
                ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-[#404040] hover:text-white'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-base">{item.icon}</span>
              {isOpen && <span className="ml-3 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
