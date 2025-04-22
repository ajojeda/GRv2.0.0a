import { useEffect, useState } from 'react';
import { usePermissions } from '../context/PermissionsContext';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { selectedSiteId, user } = usePermissions();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      if (!user.sysAdmin && !selectedSiteId) return;

      setLoading(true);
      try {
        const url = user.sysAdmin
          ? '/api/users'
          : `/api/users?siteId=${selectedSiteId}`;

        const res = await fetch(url, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to load users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error loading users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedSiteId, user]);

  if (loading) return <div className="text-gray-600">Loading users...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!users.length) return <div className="text-gray-500">No users found.</div>;

  return (
    <table className="min-w-full bg-white border border-gray-300 shadow-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Email</th>
          <th className="py-2 px-4 border-b">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">{user.name}</td>
            <td className="py-2 px-4 border-b">{user.email}</td>
            <td className="py-2 px-4 border-b">{user.role || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}