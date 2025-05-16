// 📁 src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PermissionsProvider } from './context/PermissionsContext';
import App from './App';
import './index.css'; // or your Tailwind/global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PermissionsProvider>
        <App />
      </PermissionsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
