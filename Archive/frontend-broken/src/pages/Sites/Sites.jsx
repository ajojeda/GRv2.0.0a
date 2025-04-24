// frontend/src/pages/Sites/Sites.jsx
import { useEffect, useState } from "react";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/sites", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sites");
      const data = await res.json();
      setSites(data);
    } catch (err) {
      console.error("❌ Error loading sites:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingId ? `/api/sites/${editingId}` : "/api/sites";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save site");
      await fetchSites();
      resetForm();
    } catch (err) {
      console.error("❌ Error saving site:", err);
      setError(err.message);
    }
  };

  const handleEdit = (site) => {
    setEditingId(site.id);
    setFormData({
      code: site.code || "",
      name: site.name || "",
      description: site.description || "",
      isActive: site.isActive ?? true,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sites</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium">Code</label>
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="border px-3 py-1 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border px-3 py-1 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border px-3 py-1 rounded w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label className="font-medium">Active</label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Site" : "Add Site"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table of sites */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Code</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-left">Active</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id} className="border-t">
              <td className="px-4 py-2">{site.code}</td>
              <td className="px-4 py-2">{site.name}</td>
              <td className="px-4 py-2">{site.description || "—"}</td>
              <td className="px-4 py-2">{site.isActive ? "✅" : "❌"}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(site)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
