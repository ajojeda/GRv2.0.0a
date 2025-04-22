import { usePermissions } from '../../context/PermissionsContext';
import { useEffect, useState } from 'react';
import RoleList from '../../components/RoleList';
import RoleEditModal from '../../components/RoleEditModal';

export default function Roles() {
  const { canPerform } = usePermissions();
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sites, setSites] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load roles
  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/roles', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load roles');
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load sites + departments (for role creation)
  const fetchMeta = async () => {
    try {
      const [siteRes, deptRes] = await Promise.all([
        fetch('/api/sites', { credentials: 'include' }),
        fetch('/api/departments', { credentials: 'include' })
      ]);
      if (!siteRes.ok || !deptRes.ok) throw new Error('Failed to load metadata');
      const [siteData, deptData] = await Promise.all([
        siteRes.json(),
        deptRes.json()
      ]);
      setSites(siteData);
      setDepartments(deptData);
    } catch (err) {
      console.error('Error loading site/department metadata:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchMeta();
  }, []);

  const handleRoleSaved = (newRole) => {
    setShowModal(false);
    fetchRoles();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Roles Management</h1>

        {canPerform('Role Management', 'Edit Role') && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowModal(true)}
          >
            + Create Role
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 italic">Loading roles...</div>
      ) : (
        <RoleList roles={roles} />
      )}

      {showModal && (
        <RoleEditModal
          onSave={handleRoleSaved}
          onClose={() => setShowModal(false)}
          sites={sites}
          departments={departments}
        />
      )}
    </div>
  );
}