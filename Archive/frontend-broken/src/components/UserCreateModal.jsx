import { useEffect, useState } from 'react';
import { usePermissions } from '../context/PermissionsContext';

export default function UserCreateModal({ onClose, onAdd }) {
  const { user } = usePermissions();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [siteId, setSiteId] = useState('');
  const [sites, setSites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch('/api/sites', { credentials: 'include' });
        const data = await res.json();

        if (user.sysAdmin) {
          setSites(data);
        } else if (user.siteAccess?.length) {
          setSites(data.filter((s) => user.siteAccess.includes(s.id)));
        } else if (user.siteId) {
          const match = data.find((s) => s.id === user.siteId);
          if (match) setSites([match]);
        }
      } catch (err) {
        console.error('Failed to load sites for user creation');
      }
    };

    fetchSites();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !siteId) {
      return setError('All fields are required');
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, siteId }),
      });

      if (!res.ok) throw new Error('Failed to add user');
      const newUser = await res.json();
      onAdd(newUser);
      onClose();
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Site</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={siteId}
              onChange={(e) => setSiteId(Number(e.target.value))}
              required
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
