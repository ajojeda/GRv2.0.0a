// 📁 src/components/Sidebar.jsx
import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { PermissionsContext } from "../context/PermissionsContext";

// Helpers
const moduleMappings = {
  "Dashboard": { label: "Dashboard", path: "dashboard" },
  "User Management": { label: "Users", path: "users" },
  "Role Management": { label: "Roles", path: "roles" },
  "Site Management": { label: "Sites", path: "sites" },
  "Department Management": { label: "Departments", path: "departments" },
  "Tasks": { label: "Tasks", path: "tasks" },
};

const moduleIcons = {
  "Dashboard": HomeIcon,
  "Users": UserGroupIcon,
  "Roles": ShieldCheckIcon,
  "Sites": BuildingOfficeIcon,
  "Departments": BuildingLibraryIcon,
  "Tasks": ClipboardDocumentCheckIcon,
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { permissions } = useContext(PermissionsContext);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const persisted = localStorage.getItem("sidebar-collapsed");
    setCollapsed(persisted === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const filteredModules = Object.keys(permissions || {})
    .filter((moduleName) => permissions[moduleName]?.visible && moduleName.toLowerCase().includes(search.toLowerCase()))
    .sort();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-[#2C2C2C] text-[#E0E0E0] transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-xl font-bold">GoodieRun</h2>}
          <button onClick={toggleCollapse} className="p-1">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {!collapsed && (
          <div className="p-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="pl-8 pr-2 py-1 w-full bg-[#1E1E1E] rounded"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto mt-4 space-y-1">
          {filteredModules.length > 0 ? (
            filteredModules.map((moduleName) => {
              const { label, path } = moduleMappings[moduleName] || { label: moduleName, path: moduleName.toLowerCase().replace(/\s+/g, "") };
              const Icon = moduleIcons[label] || FolderIcon;
              return (
                <li key={moduleName}>
                  <NavLink
                    to={`/${path}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 mx-2 rounded transition-all ${
                        isActive
                          ? "bg-[#4B2E83] text-white font-semibold"
                          : "hover:bg-[#4B2E83] hover:text-white"
                      } ${collapsed ? "justify-center" : "justify-start"}`
                    }
                    title={collapsed ? label : undefined}
                    onClick={() => {
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <Icon className="h-6 w-6" />
                    {!collapsed && <span className="text-sm">{label}</span>}
                  </NavLink>
                </li>
              );
            })
          ) : (
            <div className="p-4 text-sm">No modules found.</div>
          )}
        </ul>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#2C2C2C] text-[#E0E0E0] p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">GoodieRun</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="space-y-2">
          {filteredModules.map((moduleName) => {
            const { label, path } = moduleMappings[moduleName] || { label: moduleName, path: moduleName.toLowerCase().replace(/\s+/g, "") };
            const Icon = moduleIcons[label] || FolderIcon;
            return (
              <li key={moduleName}>
                <NavLink
                  to={`/${path}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded text-sm ${
                      isActive ? "bg-[#4B2E83] text-white font-semibold" : "hover:bg-[#4B2E83] hover:text-white"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
