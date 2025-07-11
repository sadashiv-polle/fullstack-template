import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Navbar from "../components/Navbar"; // Top nav with logout and links

function CreateUser() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const API_BASE = "http://localhost:5003";

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/admin/users");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password || !form.role) {
      setError("Please fill all required fields: Username, Email, Password, and Role.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/auth/users`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/admin/users", {
        state: {
          message: `✅ User ${form.email} created successfully by ${currentUser?.email || "Unknown"}.`,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating user.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated Breadcrumb (removed Dashboard)
  const breadcrumbItems = [
    { label: "Users", path: "/admin/users" },
    { label: "Create User" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white shadow px-4 py-3">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Create User Form */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Create New User</h2>

          {(!form.username || !form.email || !form.password || !form.role) && !error && (
            <p className="mb-6 text-gray-600 text-sm">
              <strong>Username, Email, Password, and Role</strong> are{" "}
              <span className="text-red-600">required</span>.
            </p>
          )}

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">{error}</p>
          )}

          <form onSubmit={handleCreate} className="space-y-5" autoComplete="off">
            <input
              type="text"
              name="username"
              placeholder="Username (e.g., sadashiv)"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email (e.g., test@gmail.com)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password (••••••••••)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />

            <select
              name="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded transition"
              >
                {loading ? "Creating..." : "Create User"}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateUser;
