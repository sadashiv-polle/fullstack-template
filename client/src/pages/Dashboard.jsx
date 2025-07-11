import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-gray-600">This is a protected route.</p>
      </div>
    </>
  );
}

export default Dashboard;
