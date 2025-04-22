import { useState } from 'react';

export default function AddSiteModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      return setError('Name and location are required');
    }

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, location }),
      });

      if (!res.ok) throw new Error('Failed to add site');
      const newSite = await res.json();
      onAdd(newSite);
      onClose();
    } catch (err) {
      console.error('Add site failed:', err);
      setError('Failed to add site');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Site</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Site Name</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}