// 📁 src/components/Topbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { PermissionsContext } from '../context/PermissionsContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user, availableSites = [], currentSite, setCurrentSite, refreshPermissions, handleLogout } = useContext(PermissionsContext);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedSiteId = localStorage.getItem('currentSiteId');
    if (storedSiteId && availableSites.length > 0) {
      const matchingSite = availableSites.find(site => site.id === parseInt(storedSiteId, 10));
      if (matchingSite && (!currentSite || matchingSite.id !== currentSite.id)) {
        handleSiteChange(matchingSite, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSites]);

  const handleSiteChange = async (site, skipNavigate = false) => {
    setCurrentSite(site);
    localStorage.setItem('currentSiteId', site.id);
    setSiteDropdownOpen(false);

    await refreshPermissions(site.id);

    if (!skipNavigate) {
      navigate(location.pathname, { replace: true });
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">GoodieRun Platform</h1>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-6">
        {/* Site Switcher */}
        {Array.isArray(availableSites) && availableSites.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              className="px-3 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 text-sm"
            >
              {currentSite?.name || 'Select Site'}
            </button>
            {siteDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                {availableSites.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => handleSiteChange(site)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {site.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Info */}
        <div className="text-sm text-gray-700">
          {user.name} ({user.email})
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
