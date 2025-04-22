import { usePermissions } from '../../context/PermissionsContext';

export default function Tasks() {
  const { canPerform } = usePermissions();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Center</h1>

        {canPerform('Tasks', 'Create Task') && (
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            + Create Task
          </button>
        )}
      </div>

      {/* TODO: Task list goes here */}
      <div className="text-gray-500 italic">Task list will go here...</div>
    </div>
  );
}