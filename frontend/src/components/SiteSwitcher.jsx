// 📁 src/components/SiteSwitcher.jsx
import React, { useContext } from 'react';
import { PermissionsContext } from '../context/PermissionsContext';

const SiteSwitcher = () => {
  const { siteAccess, selectedSite, setSelectedSite } = useContext(PermissionsContext);

  if (!siteAccess || siteAccess.length === 0) {
    return null; // No sites available
  }

  const handleChange = (e) => {
    const siteId = parseInt(e.target.value, 10);
    setSelectedSite(siteId);
  };

  return (
    <div className="mb-6">
      <label className="block mb-1 text-gray-700 text-sm font-semibold">Site</label>
      <select
        value={selectedSite || ''}
        onChange={handleChange}
        className="w-full border p-2 rounded bg-white text-gray-700"
      >
        {siteAccess.map((site) => (
          <option key={site.siteId} value={site.siteId}>
            {site.siteName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SiteSwitcher;
