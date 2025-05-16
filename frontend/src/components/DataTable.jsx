import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const DataTable = ({ columns, data = [], apiEndpoint = null, rowsPerPage = 10 }) => {
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch from API if provided
  useEffect(() => {
    if (!apiEndpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(apiEndpoint, { withCredentials: true });
        setApiData(response.data || []);
      } catch (err) {
        console.error("API fetch error:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  const rawData = apiEndpoint ? apiData : data;

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return rawData;

    return [...rawData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rawData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [currentPage, sortedData, rowsPerPage]);

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const totalPages = Math.ceil(rawData.length / rowsPerPage);

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      {/* Loading and Error States */}
      {loading && (
        <div className="p-8 text-center text-gray-500 animate-pulse">
          Loading...
        </div>
      )}

      {error && (
        <div className="p-8 text-center text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-4 py-2 font-semibold text-gray-700 cursor-pointer select-none hover:bg-gray-200"
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 border-b last:border-none"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-2 text-gray-700">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-10 text-gray-400"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;
