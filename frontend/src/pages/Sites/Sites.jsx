// 📁 src/pages/Sites/Sites.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalSite, setModalSite] = useState(null);
  const sitesPerPage = 10;

  const fetchSites = async () => {
    try {
      const response = await axios.get('/api/sites', { withCredentials: true });
      setSites(response.data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
      alert('Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const saveSite = async (e) => {
    e.preventDefault();
    try {
      if (modalSite.id) {
        await axios.put(`/api/sites/${modalSite.id}`, modalSite, { withCredentials: true });
        alert('Site updated!');
      } else {
        await axios.post('/api/sites', modalSite, { withCredentials: true });
        alert('Site created!');
      }
      setShowModal(false);
      fetchSites();
    } catch (error) {
      console.error('Error saving site:', error);
      alert('Failed to save site');
    }
  };

  const deleteSite = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    try {
      await axios.delete(`/api/sites/${id}`, { withCredentials: true });
      alert('Site deleted!');
      fetchSites();
    } catch (error) {
      console.error('Failed to delete site:', error);
      alert('Failed to delete site');
    }
  };

  const openModal = (site = null) => {
    setModalSite(site || { name: '' });
    setShowModal(true);
  };

  const filteredSites = sites.filter(site =>
    site.name?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPages = Math.ceil(filteredSites.length / sitesPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sites</h1>
        <p>Loading sites...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sites</h1>

      {/* Search + Add Site */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search sites..."
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
          + Add Site
        </button>
      </div>

      {/* Sites Table */}
      {currentSites.length > 0 ? (
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
              {currentSites.map(site => (
                <tr key={site.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{site.id}</td>
                  <td className="p-3">{site.name}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openModal(site)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSite(site.id)}
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
        <p>No sites found.</p>
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
              {modalSite?.id ? 'Edit Site' : 'Add Site'}
            </h2>
            <form onSubmit={saveSite} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm">Site Name</label>
                <input
                  type="text"
                  value={modalSite.name}
                  onChange={(e) => setModalSite({ ...modalSite, name: e.target.value })}
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

export default Sites;
