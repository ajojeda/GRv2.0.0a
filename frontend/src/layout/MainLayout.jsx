// frontend/src/layout/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored !== null) {
      setSidebarOpen(stored === 'true');
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    localStorage.setItem('sidebarOpen', next.toString());
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    localStorage.setItem('sidebarOpen', 'false');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F8F8] text-gray-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        closeSidebar={closeSidebar}
      />

      {/* Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 min-h-screen transform transition-transform duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? 'translate-x-64' : '') : sidebarOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 bg-[#F8F8F8] overflow-y-auto">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
