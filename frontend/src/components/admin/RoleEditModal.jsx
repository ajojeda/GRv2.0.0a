import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";

export default function RoleEditModal({ role, onClose, onSaved }) {
  const [permissions, setPermissions] = useState(role.permissions || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // If the user is sysAdmin, give them all permissions by default
  useEffect(() => {
    if (role.sysAdmin) {
      setPermissions({
        Dashboard: { visible: true, actions: {} },
        "User Management": {
          visible: true,
          actions: {
            "Create User": true,
            "Edit User": true,
            "Delete User": true,
          },
          fields: {
            Email: "read/write",
            Role: "read/write",
          },
        },
        Tasks: {
          visible: true,
          actions: {
            "Create Task": true,
            "Edit Task": true,
          },
        },
        "Site Management": {
          visible: true,
          actions: {
            "Edit Site": true,
          },
        },
        "Role Management": {
          visible: true,
          actions: {
            "Edit Role": true,
          },
        },
      });
    }
  }, [role]);

  const toggleModuleVisible = (moduleKey) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        visible: !prev[moduleKey]?.visible,
      },
    }));
  };

  const toggleAction = (moduleKey, actionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        actions: {
          ...prev[moduleKey]?.actions,
          [actionKey]: !prev[moduleKey]?.actions?.[actionKey],
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const { data } = await api.put(`/roles/${role.id}`, {
        permissions,
      });
      onSaved(data); // update parent state
      onClose();
    } catch (err) {
      console.error("❌ Failed to save role:", err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Edit Permissions: {role.name}</h2>

        {Object.entries(permissions).map(([moduleKey, mod]) => (
          <div key={moduleKey} className="mb-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{moduleKey}</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!mod.visible}
                  onChange={() => toggleModuleVisible(moduleKey)}
                />
                <span>Visible</span>
              </label>
            </div>
            {mod.visible && mod.actions && (
              <div className="ml-4 mt-2 space-y-1">
                {Object.entries(mod.actions).map(([actionKey, allowed]) => (
                  <label key={actionKey} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allowed}
                      onChange={() => toggleAction(moduleKey, actionKey)}
                    />
                    <span>{actionKey}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}