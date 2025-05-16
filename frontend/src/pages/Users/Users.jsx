import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles', { withCredentials: true });
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      alert('Failed to load roles');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      if (modalUser.id) {
        await axios.put(`/api/users/${modalUser.id}`, modalUser, { withCredentials: true });
        alert('User updated!');
      } else {
        await axios.post('/api/users', modalUser, { withCredentials: true });
        alert('User created!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/users/${id}`, { withCredentials: true });
      alert('User deleted!');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const openModal = (user = null) => {
    setModalUser(user || { name: '', email: '', role: '', password: '' });
    setShowModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Search + Add User */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          onClick={() => openModal()}
          className="ml-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      {currentUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalUser?.id ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={saveUser} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm">Name</label>
                <input
                  type="text"
                  value={modalUser.name}
                  onChange={(e) => setModalUser({ ...modalUser, name: e.target.value })}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  value={modalUser.email}
                  onChange={(e) => setModalUser({ ...modalUser, email: e.target.value })}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm">Role</label>
                <select
                  value={modalUser.role}
                  onChange={(e) => setModalUser({ ...modalUser, role: e.target.value })}
                  required
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {!modalUser?.id && (
                <div>
                  <label className="block text-gray-700 text-sm">Password</label>
                  <input
                    type="password"
                    value={modalUser.password}
                    onChange={(e) => setModalUser({ ...modalUser, password: e.target.value })}
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
