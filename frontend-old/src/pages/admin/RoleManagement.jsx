// frontend/src/pages/admin/RoleManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import RoleEditModal from "./RoleEditModal.jsx";

export default function RoleManagement() {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/roles");
        setRoles(data);
      } catch (err) {
        console.error("❌ Failed to fetch roles:", err);
        setError("Unable to fetch roles.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRoleUpdated = (updated) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const handleCloseModal = () => setEditingRole(null);

  if (!user?.sysAdmin && !user?.siteAdmin) {
    return <div className="p-6 text-red-500">Access denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Role Management</h1>

      {loading ? (
        <div>Loading roles…</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Site</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Modules</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{role.name}</td>
                <td className="p-2 border">{role.siteId}</td>
                <td className="p-2 border">{role.departmentId}</td>
                <td className="p-2 border">
                  {Object.keys(role.permissions || {}).join(", ")}
                </td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => setEditingRole(role)}
                  >
                    Edit
                  </button>
                  {user?.sysAdmin && (
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingRole && (
        <RoleEditModal
          role={editingRole}
          isOpen={!!editingRole}
          onClose={handleCloseModal}
          onSave={handleRoleUpdated}
        />
      )}
    </div>
  );
}