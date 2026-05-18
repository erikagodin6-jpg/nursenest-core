async function getData() {
  const res = await fetch("/api/admin/analytics", { cache: "no-store" });
  return res.json();
}

export default async function AdminDashboard() {
  const data = await getData();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Total Sessions</h2>
          <p>{data.totalSessions}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Total Duration (sec)</h2>
          <p>{data.totalDurationSeconds}</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mt-6">Game Usage</h2>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
          {JSON.stringify(data.byGame, null, 2)}
        </pre>
      </div>
    </div>
  );
}