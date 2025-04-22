import { useEffect, useState } from 'react';
import Modal from './Modal';
import { usePermissions } from '../context/PermissionsContext';

export default function RoleEditModal({ role = null, sites = [], departments = [], onSave, onClose }) {
  const isEdit = Boolean(role);
  const { user } = usePermissions();

  const [name, setName] = useState(role?.name || '');
  const [siteId, setSiteId] = useState(role?.siteId || user.siteId || '');
  const [selectedDepartments, setSelectedDepartments] = useState(role?.departments || []);
  const [permissions, setPermissions] = useState(role?.permissions || {});
  const [metadata, setMetadata] = useState([]); // ✅ new

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch('/api/metadata/modules', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load metadata');
        const data = await res.json();
        setMetadata(data);
      } catch (err) {
        console.error('❌ Failed to load metadata:', err);
      }
    };

    fetchMetadata();
  }, []);

  const filteredDepartments = departments.filter(d => d.siteId === parseInt(siteId));

  const toggleModuleVisibility = (moduleName) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        visible: !prev[moduleName]?.visible,
      },
    }));
  };

  const toggleAction = (moduleName, action) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        actions: {
          ...prev[moduleName]?.actions,
          [action]: !prev[moduleName]?.actions?.[action],
        },
      },
    }));
  };

  const setFieldAccess = (moduleName, fieldCode, level) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        fields: {
          ...prev[moduleName]?.fields,
          [fieldCode]: level,
        },
      },
    }));
  };

  const handleSubmit = () => {
    const payload = {
      id: role?.id,
      name,
      siteId: parseInt(siteId),
      departments: selectedDepartments,
      permissions,
    };
    onSave(payload);
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Role' : 'Create Role'}</h2>

        {/* Role Metadata */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-medium">Role Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Site</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              disabled={!user.sysAdmin}
            >
              <option value="">Select Site</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Departments</label>
            <select
              multiple
              className="w-full border rounded px-3 py-2 h-32"
              value={selectedDepartments}
              onChange={(e) =>
                setSelectedDepartments([...e.target.selectedOptions].map(o => parseInt(o.value)))
              }
            >
              {filteredDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Permissions Editor */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto">
          {metadata.map((app) => (
            <div key={app.id} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{app.name}</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={permissions[app.name]?.visible || false}
                    onChange={() => toggleModuleVisibility(app.name)}
                  />
                  <span>Visible</span>
                </label>
              </div>

              <div className="flex gap-6 mb-2">
                {['Create', 'Edit', 'Delete'].map((action) => (
                  <label key={action} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={permissions[app.name]?.actions?.[action] || false}
                      onChange={() => toggleAction(app.name, action)}
                    />
                    <span>{action}</span>
                  </label>
                ))}
              </div>

              {app.sections.map(section => (
                <div key={section.id} className="mb-4">
                  <label className="block font-medium mb-1">{section.name}</label>
                  <div className="grid grid-cols-2 gap-4">
                    {section.fields.map(field => (
                      <div key={field.id}>
                        <label className="block text-sm">{field.fieldLabel}</label>
                        <select
                          className="w-full border rounded px-2 py-1"
                          value={permissions[app.name]?.fields?.[field.fieldCode] || 'hidden'}
                          onChange={(e) => setFieldAccess(app.name, field.fieldCode, e.target.value)}
                        >
                          {['hidden', 'read', 'read/write'].map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>
            {isEdit ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>
    </Modal>
  );
}