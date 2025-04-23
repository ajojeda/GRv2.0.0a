// frontend/src/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../context/PermissionsContext';
import { FaBars, FaUser, FaUsers, FaCog, FaHome } from 'react-icons/fa';

const menuItems = [
  {
    key: 'Dashboard',
    label: 'Dashboard',
    icon: <FaHome />,
    path: '/',
  },
  {
    key: 'User Management',
    label: 'Users',
    icon: <FaUsers />,
    path: '/users',
  },
  {
    key: 'Role Management',
    label: 'Roles',
    icon: <FaCog />,
    path: '/roles',
  },
  {
    key: 'Site Management',
    label: 'Sites',
    icon: <FaUser />,
    path: '/sites',
  },
];

export default function Sidebar({ isOpen, toggleSidebar, isMobile, closeSidebar }) {
  const location = useLocation();
  const { canAccess } = usePermissions();
  const [search, setSearch] = useState('');

  const filteredMenu = menuItems.filter(
    (item) => canAccess(item.key) && item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen bg-[#2C2C2C] text-[#E0E0E0] shadow-lg transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        ${isMobile ? 'translate-x-0' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#3A3A3A]">
        <button onClick={toggleSidebar} className="text-[#E0E0E0] focus:outline-none">
          <FaBars />
        </button>
        {isOpen && <span className="font-bold ml-2">GoodieRun</span>}
      </div>

      {/* Search Bar */}
      {isOpen && (
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1 text-sm rounded bg-[#3A3A3A] placeholder-gray-400"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 space-y-1">
        {filteredMenu.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            onClick={isMobile ? closeSidebar : undefined}
            className={`flex items-center px-4 py-2 hover:bg-[#404040] transition-colors ${
              location.pathname === item.path ? 'bg-[#444] font-semibold' : ''
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
