// 📁 src/pages/Dashboard/Dashboard.jsx
import React, { useContext } from 'react';
import { PermissionsContext } from '../../context/PermissionsContext';

const Dashboard = () => {
  const { user, selectedSite, siteAccess, selectedDepartments } = useContext(PermissionsContext);

  const currentSite = siteAccess.find(site => site.siteId === selectedSite);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name || 'User'}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Your Info</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>SysAdmin:</strong> {user?.sysAdmin ? 'Yes' : 'No'}</p>
          <p><strong>SiteAdmin:</strong> {user?.siteAdmin ? 'Yes' : 'No'}</p>
        </div>

        {/* Site Info */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Current Site & Departments</h2>
          {currentSite ? (
            <>
              <p><strong>Site Name:</strong> {currentSite.siteName}</p>
              <p><strong>Site ID:</strong> {currentSite.siteId}</p>
              {selectedDepartments?.length > 0 ? (
                <ul className="list-disc list-inside mt-2">
                  {selectedDepartments.map((dept) => (
                    <li key={dept.departmentId}>{dept.departmentName}</li>
                  ))}
                </ul>
              ) : (
                <p>No departments selected</p>
              )}
            </>
          ) : (
            <p>No site selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
