// frontend/src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { usePermissions } from '../context/PermissionsContext';

const allLinks = [
  { name: 'Dashboard', to: '/', resource: 'Dashboard' },
  { name: 'Users', to: '/users', resource: 'User Management' },
  { name: 'Roles', to: '/roles', resource: 'Role Management' },
  { name: 'Sites', to: '/sites', resource: 'Site Management' },
];

export default function Sidebar() {
  const { user, canAccess, setUserContext } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout failed silently:', err);
    } finally {
      setUserContext(null, {}); // Clear context
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-4 text-xl font-bold border-b">GoodieRun</div>

      {user && (
        <div className="text-sm text-gray-600 p-4 border-b">
          Signed in as <strong>{user.name}</strong>
          <br />
          Role: {user.sysAdmin ? 'System Admin' : user.role || 'User'}
        </div>
      )}

      <nav className="p-4">
        {allLinks
          .filter(link => canAccess(link.resource))
          .map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
              }
            >
              {link.name}
            </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}