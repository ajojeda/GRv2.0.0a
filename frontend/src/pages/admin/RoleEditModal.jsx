import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import api from "../../utils/api.js";

export default function RoleEditModal({ role, isOpen, onClose, onSaved }) {
  const [formState, setFormState] = useState(role);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormState(role);
    setError("");
    setSaving(false);
  }, [role]);

  const toggleModuleVisibility = (modName) => {
    setFormState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [modName]: {
          ...prev.permissions[modName],
          visible: !prev.permissions[modName]?.visible,
        },
      },
    }));
  };

  const toggleAction = (modName, actionName) => {
    const current = formState.permissions[modName]?.actions?.[actionName] || false;
    setFormState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [modName]: {
          ...prev.permissions[modName],
          actions: {
            ...prev.permissions[modName]?.actions,
            [actionName]: !current,
          },
        },
      },
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      const { data } = await api.put(`/roles/${formState.id}`, formState);
      onSaved(data); // Update local role list
      onClose();
    } catch (err) {
      console.error("❌ Failed to save role:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const modules = Object.keys(formState.permissions || {});

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <div className="relative z-50 bg-white rounded shadow-xl w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Edit Role: {formState.name}
            </Dialog.Title>
            <button onClick={onClose} disabled={saving}>
              <FiX size={22} />
            </button>
          </div>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {modules.map((mod) => (
              <div key={mod} className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{mod}</h3>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formState.permissions[mod]?.visible || false}
                      onChange={() => toggleModuleVisibility(mod)}
                    />
                    Visible
                  </label>
                </div>

                {formState.permissions[mod]?.actions &&
                  Object.entries(formState.permissions[mod].actions).map(
                    ([action, value]) => (
                      <label key={action} className="block ml-4 text-sm">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleAction(mod, action)}
                          className="mr-2"
                        />
                        {action}
                      </label>
                    )
                  )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}