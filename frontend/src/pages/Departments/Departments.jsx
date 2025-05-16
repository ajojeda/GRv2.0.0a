import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalDepartment, setModalDepartment] = useState(null);
  const departmentsPerPage = 10;

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments', { withCredentials: true });
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      alert('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const saveDepartment = async (e) => {
    e.preventDefault();
    try {
      if (modalDepartment.id) {
        await axios.put(`/api/departments/${modalDepartment.id}`, modalDepartment, { withCredentials: true });
        alert('Department updated!');
      } else {
        await axios.post('/api/departments', modalDepartment, { withCredentials: true });
        alert('Department created!');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department');
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`/api/departments/${id}`, { withCredentials: true });
      alert('Department deleted!');
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert('Failed to delete department');
    }
  };

  const openModal = (department = null) => {
    setModalDepartment(department || { name: '' });
    setShowModal(true);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastDept = currentPage * departmentsPerPage;
  const indexOfFirstDept = indexOfLastDept - departmentsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstDept, indexOfLastDept);
  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Departments</h1>
        <p>Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Departments</h1>

      {/* Search + Add Department */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search departments..."
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
          + Add Department
        </button>
      </div>

      {/* Departments Table */}
      {currentDepartments.length > 0 ? (
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
              {currentDepartments.map(dept => (
                <tr key={dept.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{dept.id}</td>
                  <td className="p-3">{dept.name}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openModal(dept)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDepartment(dept.id)}
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
        <p>No departments found.</p>
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
              {modalDepartment?.id ? 'Edit Department' : 'Add Department'}
            </h2>
            <form onSubmit={saveDepartment} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm">Department Name</label>
                <input
                  type="text"
                  value={modalDepartment.name}
                  onChange={(e) => setModalDepartment({ ...modalDepartment, name: e.target.value })}
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

export default Departments;
