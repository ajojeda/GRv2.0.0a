// 📁 src/pages/Roles/Roles.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState(null);
  const rolesPerPage = 10;

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles', { withCredentials: true });
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      alert('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const saveRole = async (e) => {
    e.preventDefault();
    try {
      if (modalRole.id) {
        await axios.put(`/api/roles/${modalRole.id}`, modalRole, { withCredentials: true });
        alert('Role updated!');
      } else {
        await axios.post('/api/roles', modalRole, { withCredentials: true });
        alert('Role created!');
      }
      setShowModal(false);
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role');
    }
  };

  const deleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await axios.delete(`/api/roles/${id}`, { withCredentials: true });
      alert('Role deleted!');
      fetchRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert('Failed to delete role');
    }
  };

  const openModal = (role = null) => {
    setModalRole(role || { name: '' });
    setShowModal(true);
  };

  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Roles</h1>
        <p>Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Roles</h1>

      {/* Search + Add Role */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search roles..."
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
          + Add Role
        </button>
      </div>

      {/* Roles Table */}
      {currentRoles.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map(role => (
                <tr key={role.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{role.id}</td>
                  <td className="p-3">{role.name}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openModal(role)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRole(role.id)}
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
        <p>No roles found.</p>
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
              {modalRole?.id ? 'Edit Role' : 'Add Role'}
            </h2>
            <form onSubmit={saveRole} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm">Role Name</label>
                <input
                  type="text"
                  value={modalRole.name}
                  onChange={(e) => setModalRole({ ...modalRole, name: e.target.value })}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
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

export default Roles;
