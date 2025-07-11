import Navbar from "../components/Navbar";

function Page1() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Page 1</h1>
        <p className="mt-2 text-gray-600">This is the first additional page.</p>
      </div>
    </>
  );
}

export default Page1;
