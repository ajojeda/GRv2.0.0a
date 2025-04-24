import { useState } from 'react';
import RoleEditModal from './RoleEditModal';
import { usePermissions } from '../context/PermissionsContext';

export default function RoleList({ roles }) {
  const { canPerform } = usePermissions();
  const [editingRole, setEditingRole] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      window.location.reload(); // Simplest way to refresh roles
    } catch (err) {
      console.error('❌ Failed to delete role:', err);
      alert('Error deleting role.');
    }
  };

  return (
    <div className="overflow-x-auto border rounded shadow-sm bg-white">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Site</th>
            <th className="py-2 px-4">Departments</th>
            <th className="py-2 px-4 w-32 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50 border-t">
              <td className="py-2 px-4 font-medium">{role.name}</td>
              <td className="py-2 px-4 text-sm">{role.siteId}</td>
              <td className="py-2 px-4 text-sm">
                {Array.isArray(role.departments) ? role.departments.join(', ') : '—'}
              </td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                {canPerform('Role Management', 'Edit Role') && (
                  <button
                    onClick={() => setEditingRole(role)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                )}
                {canPerform('Role Management', 'Edit Role') && (
                  <button
                    onClick={() => setShowConfirm(role)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRole && (
        <RoleEditModal
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onSave={() => window.location.reload()}
          sites={[]} // ⛳️ Optionally preload sites/depts if needed
          departments={[]}
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded shadow p-6 max-w-sm w-full">
            <h2 className="font-bold text-lg mb-2">Delete Role</h2>
            <p>Are you sure you want to delete <strong>{showConfirm.name}</strong>?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowConfirm(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => handleDelete(showConfirm.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}