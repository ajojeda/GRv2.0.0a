// frontend/src/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../context/PermissionsContext';
import {
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { key: 'Dashboard', label: 'Dashboard', icon: HomeIcon, path: '/' },
  { key: 'User Management', label: 'Users', icon: UsersIcon, path: '/users' },
  { key: 'Role Management', label: 'Roles', icon: ShieldCheckIcon, path: '/roles' },
  { key: 'Site Management', label: 'Sites', icon: BuildingOfficeIcon, path: '/sites' },
];

export default function Sidebar({ isOpen, toggleSidebar, isMobile, closeSidebar }) {
  const location = useLocation();
  const { canAccess } = usePermissions();
  const [search, setSearch] = useState('');

  const filteredMenu = menuItems.filter(
    (item) =>
      canAccess(item.key) &&
      item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#2C2C2C] text-white transition-all duration-300 ease-in-out shadow-md flex flex-col
        ${isOpen ? 'w-64' : 'w-16'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#3A3A3A]">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white p-1 rounded"
          aria-label="Toggle Sidebar"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        {isOpen && <span className="ml-2 text-sm font-semibold">GoodieRun</span>}
      </div>

      {/* Search */}
      {isOpen && (
        <div className="px-4 py-3 border-b border-[#3A3A3A]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md bg-[#3A3A3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.path}
              onClick={isMobile ? closeSidebar : undefined}
              className={`group flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-[#404040] hover:text-white'}
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
