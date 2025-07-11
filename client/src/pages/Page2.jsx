import Navbar from "../components/Navbar";

function Page2() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Page 2</h1>
        <p className="mt-2 text-gray-600">This is the second additional page.</p>
      </div>
    </>
  );
}

export default Page2;
