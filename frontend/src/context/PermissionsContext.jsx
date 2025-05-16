import React, { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [siteAccess, setSiteAccess] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedSite = localStorage.getItem('selectedSite');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.id) {
            setUser(parsedUser);
            if (storedSite) {
              setSelectedSite(parseInt(storedSite, 10));
            }
            await refreshSession();
            setLoading(false);
            return;
          }
        }
        await refreshSession();
      } catch (error) {
        console.error('Error restoring session:', error);
        if (location.pathname !== '/login') {
          handleLogout();
        } else {
          setLoading(false);
        }
      }
    };

    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshSession = async () => {
    try {
      const response = await axios.post('/auth/refresh', {}, { withCredentials: true });
      setUser(response.data.user);
      setPermissions(response.data.permissions);
      setSiteAccess(response.data.siteAccess || []);

      // Auto-select site if needed
      if (!selectedSite && response.data.siteAccess?.length) {
        const defaultSite = response.data.siteAccess.find(s => s.isPrimary) || response.data.siteAccess[0];
        setSelectedSite(defaultSite.siteId);
        localStorage.setItem('selectedSite', defaultSite.siteId);
      }

      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Session expired or refresh failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('selectedSite');
    setUser(null);
    setPermissions({});
    setSiteAccess([]);
    setSelectedSite(null);
    if (location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  };

  const updateSelectedSite = (siteId) => {
    setSelectedSite(siteId);
    localStorage.setItem('selectedSite', siteId);
  };

  return (
    <PermissionsContext.Provider value={{
      user,
      setUser,
      permissions,
      setPermissions,
      siteAccess,
      setSiteAccess,
      selectedSite,
      setSelectedSite: updateSelectedSite,
      handleLogout,
      loading
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};
