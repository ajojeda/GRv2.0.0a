import { useState } from 'react';
import { usePermissions } from '../../context/PermissionsContext';
import SiteList from '../../components/SiteList';
import AddSiteModal from '../../components/AddSiteModal';

export default function Sites() {
  const { canPerform } = usePermissions();
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sites</h1>

        {canPerform('Site Management', 'Edit Site') && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => setShowModal(true)}
          >
            + Add Site
          </button>
        )}
      </div>

      <SiteList key={refreshKey} />

      {showModal && (
        <AddSiteModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}