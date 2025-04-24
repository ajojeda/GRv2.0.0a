import { useEffect, useState } from 'react';
import { usePermissions } from '../context/PermissionsContext';

export default function SiteList() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = usePermissions();

  useEffect(() => {
    const fetchSites = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch('/api/sites', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load sites');
        const data = await res.json();
        setSites(data);
      } catch (err) {
        console.error('Error loading sites:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [user]);

  if (loading) return <div className="text-gray-600">Loading sites...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!sites.length) return <div className="text-gray-500">No sites found.</div>;

  return (
    <table className="min-w-full bg-white border border-gray-300 shadow-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Location</th>
        </tr>
      </thead>
      <tbody>
        {sites.map((site) => (
          <tr key={site.id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">{site.name}</td>
            <td className="py-2 px-4 border-b">{site.location || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}