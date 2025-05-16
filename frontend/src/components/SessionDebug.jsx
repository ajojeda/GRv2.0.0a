import React, { useContext } from 'react';
import { PermissionsContext } from '../context/PermissionsContext';

const SessionDebug = () => {
  const { user, permissions, loading } = useContext(PermissionsContext);

  if (loading) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      overflowWrap: 'anywhere',
      zIndex: 9999
    }}>
      <strong>Session Info:</strong>
      <pre style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
{JSON.stringify({ user, permissions }, null, 2)}
      </pre>
    </div>
  );
};

export default SessionDebug;
