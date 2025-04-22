import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiMenu,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiUsers,
  FiClipboard,
  FiSettings,
} from "react-icons/fi";

const MENU_CONFIG = [
  {
    name: "Dashboard",
    icon: <FiHome size={24} />,
    permissionKey: "Dashboard",
    children: [{ name: "Overview", route: "/app/dashboard", action: null }],
  },
  {
    name: "User Management",
    icon: <FiUsers size={24} />,
    permissionKey: "User Management",
    children: [
      { name: "View Users", route: "/app/users", action: null },
      { name: "Create User", route: "/app/users/create", action: "Create User" },
    ],
  },
  {
    name: "Tasks",
    icon: <FiClipboard size={24} />,
    permissionKey: "Tasks",
    children: [
      { name: "View Tasks", route: "/app/tasks", action: null },
      { name: "Create Task", route: "/app/tasks/create", action: "Create Task" },
    ],
  },
  {
    name: "Settings",
    icon: <FiSettings size={24} />,
    permissionKey: "Site Management",
    children: [
      { name: "Site Settings", route: "/app/settings", action: "Edit Site" },
    ],
  },
  {
    name: "Role Management",
    icon: <FiSettings size={24} />,
    permissionKey: "Role Management",
    children: [
      { name: "Edit Roles", route: "/app/roles", action: "Edit Role" },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const perms = user?.sysAdmin ? Object.fromEntries(
    MENU_CONFIG.map((mod) => [mod.permissionKey, { visible: true, actions: Object.fromEntries(mod.children.map(c => [c.action, true])) }])
  ) : user?.permissions || {};

  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [search, setSearch] = useState("");
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const toggleModule = (key) => {
    setOpenModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleModules = MENU_CONFIG.filter((mod) => {
    const modPerm = perms[mod.permissionKey];
    if (!modPerm?.visible) return false;
    if (!search) return true;
    const lower = search.toLowerCase();
    if (mod.name.toLowerCase().includes(lower)) return true;
    return mod.children.some((c) => c.name.toLowerCase().includes(lower));
  });

  const linkClass = ({ isActive }) =>
    `flex items-center p-2 rounded text-sm ${
      isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <aside
      className={`flex flex-col bg-[#2C2C2C] text-[#E0E0E0] transition-all duration-300 h-full shadow-md overflow-hidden ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold">GoodieRun</span>}
        <button onClick={() => setCollapsed((c) => !c)}>
          <FiMenu size={20} />
        </button>
      </div>

      {!collapsed && (
        <div className="p-2 border-b border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-2 top-2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto">
        {visibleModules.map((mod) => (
          <div key={mod.name}>
            <button
              onClick={() => toggleModule(mod.name)}
              className={`flex items-center w-full p-2 transition-colors duration-200 ${
                collapsed ? "justify-center border-b border-gray-600" : ""
              } ${openModules[mod.name] ? "bg-gray-700" : ""}`}
            >
              <span className={`${collapsed ? "w-full justify-center flex" : "mr-2"}`}>{mod.icon}</span>
              {!collapsed && <span className="flex-1 text-left">{mod.name}</span>}
              {!collapsed && (openModules[mod.name] ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />)}
            </button>

            {!collapsed && openModules[mod.name] && (
              <div className="pl-8">
                {mod.children.map((child) => {
                  if (child.action && !perms[mod.permissionKey]?.actions?.[child.action]) return null;
                  return (
                    <NavLink key={child.name} to={child.route} className={linkClass} end>
                      {child.name}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
