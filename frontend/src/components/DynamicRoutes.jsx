import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PermissionsContext } from '../context/PermissionsContext';

// Load known components
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/Users';
import CreateUser from '../pages/CreateUser/CreateUser';
import Settings from '../pages/Settings/Settings';

// Map route paths to known components
const pageComponents = {
  '/dashboard': Dashboard,
  '/users': Users,
  '/users/create': CreateUser,
  '/settings': Settings,
};

// Generic placeholder for missing routes
const Placeholder = ({ title }) => (
  <div className="p-8 text-center text-xl text-gray-600">
    🚧 <strong>{title}</strong> is under construction.
  </div>
);

const NotFound = () => (
  <div className="p-8 text-center text-2xl text-red-600">404 Page Not Found</div>
);

const DynamicRoutes = () => {
  const { metadata } = useContext(PermissionsContext);
  if (!metadata || metadata.length === 0) return null;

  const routes = [];

  metadata.forEach((app) => {
    // App-level route
    if (app.path) {
      routes.push(
        <Route
          key={app.path}
          path={app.path}
          element={pageComponents[app.path] ? React.createElement(pageComponents[app.path]) : <Placeholder title={app.name} />}
        />
      );
    }

    // Section/Field-level routes
    if (app.sections) {
      app.sections.forEach((section) => {
        if (section.fields) {
          section.fields.forEach((field) => {
            const path = field.path;
            if (path) {
              routes.push(
                <Route
                  key={path}
                  path={path}
                  element={pageComponents[path] ? React.createElement(pageComponents[path]) : <Placeholder title={field.fieldLabel || path} />}
                />
              );
            }
          });
        }
      });
    }
  });

  return (
    <Routes>
      {routes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default DynamicRoutes;
