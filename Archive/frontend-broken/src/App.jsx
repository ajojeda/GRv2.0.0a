// frontend/src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { PermissionsProvider } from './context/PermissionsContext';

export default function App() {
  return (
    <BrowserRouter>
      <PermissionsProvider>
        <AppRoutes />
      </PermissionsProvider>
    </BrowserRouter>
  );
}
