// frontend/src/pages/Dashboard/Dashboard.jsx

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview and insights at a glance</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Users', value: '120 active' },
          { label: 'Sites', value: '15 registered' },
          { label: 'Roles', value: '6 configured' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700">{label}</h2>
            <p className="text-sm text-gray-500 mt-1">{value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
