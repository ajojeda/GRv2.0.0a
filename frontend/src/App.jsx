// frontend/src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { PermissionsProvider } from './context/PermissionsContext';

export default function App() {
  return (
    <BrowserRouter>
      <PermissionsProvider>
        <div className="min-h-screen bg-slate-100 text-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white rounded shadow p-6 mb-6">
              <h1 className="text-2xl font-bold text-blue-700">GoodieRun Admin Portal</h1>
              <p className="mt-1 text-gray-600">Tailwind is working. Your app is now styled 🎉</p>
            </div>

            <AppRoutes />
          </div>
        </div>
      </PermissionsProvider>
    </BrowserRouter>
  );
}
