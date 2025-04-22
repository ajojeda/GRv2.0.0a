import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SiteSwitcher from '../components/SiteSwitcher';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800">GoodieRun Admin</h1>
          <SiteSwitcher />
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}