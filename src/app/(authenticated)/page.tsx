export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Example E-commerce Cards */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
        <div className="text-2xl font-bold">$45,231.89</div>
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
        <div className="text-2xl font-bold">+2350</div>
      </div>
    </div>
  );
}