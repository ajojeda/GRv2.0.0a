import React from "react";

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-gray-600 text-sm mt-1">Track and assign tasks here.</p>
      </div>

      {/* Table Placeholder */}
      <div className="bg-white rounded shadow p-6">
        <div className="text-gray-500 text-center py-12">
          (Tasks table will go here)
        </div>
      </div>
    </div>
  );
};

export default Tasks;
