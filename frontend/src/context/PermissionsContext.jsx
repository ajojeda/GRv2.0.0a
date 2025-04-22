import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState({});
  const [user, setUser] = useState(null);
  const [siteAccess, setSiteAccess] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const location = useLocation();

  const getSysAdminPermissions = () => ({
    Dashboard: { visible: true, actions: {} },
    "User Management": {
      visible: true,
      actions: { "Create User": true, "Edit User": true, "Delete User": true },
      fields: { email: "read/write", role: "read/write" }
    },
    Tasks: {
      visible: true,
      actions: { "Create Task": true, "Edit Task": true }
    },
    "Site Management": {
      visible: true,
      actions: { "Edit Site": true }
    },
    "Role Management": {
      visible: true,
      actions: { "Edit Role": true }
    }
  });

  const setUserContext = (userObj, perms = {}) => {
    setUser(userObj);
    setPermissions(userObj?.sysAdmin ? getSysAdminPermissions() : perms);
    setSiteAccess(userObj?.siteAccess || []);

    if (userObj?.sysAdmin) {
      setSelectedSiteId(null);
    } else if (userObj?.allSites && userObj.siteAccess?.length) {
      setSelectedSiteId(userObj.siteAccess[0]);
    } else {
      setSelectedSiteId(userObj?.siteId || null);
    }
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      if (location.pathname === "/login") return; // ✅ skip on login page

      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Not authorized');
        const data = await res.json();
        setUserContext(data.user, data.permissions);
      } catch (err) {
        console.error('Failed to load user permissions:', err);
        setUser(null);
        setPermissions({});
        setSiteAccess([]);
        setSelectedSiteId(null);
      }
    };

    fetchPermissions();
  }, [location.pathname]);

  const canAccess = (resource) => {
    return permissions?.[resource]?.visible === true;
  };

  const canPerform = (resource, action) => {
    return permissions?.[resource]?.actions?.[action] === true;
  };

  const canAccessSite = (siteId) => {
    if (user?.sysAdmin) return true;
    if (user?.allSites) return siteAccess.includes(siteId);
    return user?.siteId === siteId;
  };

  return (
    <PermissionsContext.Provider
      value={{
        user,
        permissions,
        canAccess,
        canPerform,
        canAccessSite,
        siteAccess,
        selectedSiteId,
        setSelectedSiteId,
        setUserContext,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => useContext(PermissionsContext);
