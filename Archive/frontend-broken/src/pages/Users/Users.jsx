import { useState } from 'react';
import { usePermissions } from '../../context/PermissionsContext';
import UserList from '../../components/UserList';
import UserCreateModal from '../../components/UserCreateModal';

export default function Users() {
  const { canPerform } = usePermissions();
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserAdded = () => setRefreshKey((prev) => prev + 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        {canPerform('User Management', 'Create User') && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            + Create User
          </button>
        )}
      </div>

      <UserList key={refreshKey} />

      {showModal && (
        <UserCreateModal
          onClose={() => setShowModal(false)}
          onAdd={handleUserAdded}
        />
      )}
    </div>
  );
}
