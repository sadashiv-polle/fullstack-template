import Navbar from "../components/Navbar";

function AdminPage() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Admin Only Area</h1>
        <p className="mt-2 text-gray-600">This page is visible only to admins and superadmins.</p>
      </div>
    </>
  );
}

export default AdminPage;
