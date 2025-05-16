// 📁 src/context/MetadataContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MetadataContext = createContext();

export const MetadataProvider = ({ children }) => {
  const [modulesMetadata, setModulesMetadata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get('/api/metadata/modules', { withCredentials: true });
        setModulesMetadata(response.data);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <MetadataContext.Provider value={{ modulesMetadata, loading }}>
      {children}
    </MetadataContext.Provider>
  );
};
