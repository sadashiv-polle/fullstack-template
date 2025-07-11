import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar"; // Top nav bar with logout

function AdminUserPanel() {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const API_BASE = "http://localhost:5003";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = res.data.filter((u) => !u.isSystemUser);
      setUsers(filteredUsers);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setAlert({ type: "error", message: "Failed to load users." });
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token || !user || !["admin", "superadmin"].includes(user.role)) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [token, user, navigate, fetchUsers]);

  useEffect(() => {
    if (location.state?.message) {
      setAlert({ type: "success", message: location.state.message });
      const timeout = setTimeout(() => {
        setAlert(null);
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handlePasswordChange = async (userId) => {
    const newPassword = prompt("Please enter a new password (minimum 6 characters):");
    if (!newPassword) return;
    if (newPassword.length < 6) {
      setAlert({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }
    try {
      await axios.put(
        `${API_BASE}/api/auth/users/${userId}/password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert({ type: "success", message: "Password updated successfully." });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Error updating password.",
      });
    }
  };

  const getAllowedRolesForUser = (targetUser) => {
    if (!user) return [];
    if (user.role === "superadmin") return ["user", "admin", "superadmin"];
    if (user.role === "admin") return ["user", "admin"];
    return [];
  };

  const canChangeRole = (targetUser) => {
    if (!user) return false;
    if (user.role === "superadmin") return true;
    if (user.role === "admin") return targetUser.role === "admin" || targetUser.role === "user";
    return false;
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_BASE}/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const changedUser = users.find((u) => u.id === userId);
      const email = changedUser?.email || "Unknown";
      setAlert({
        type: "success",
        message: `User ${email} role updated to ${newRole} successfully.`,
      });
      fetchUsers();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Error updating role.",
      });
    }
  };

  if (!token || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-10 px-4">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Users</h2>
          <button
            onClick={() => navigate("/admin/users/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add New User
          </button>
        </div>

        <table className="w-full border rounded bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border-b">Name</th>
              <th className="text-left p-2 border-b">Email</th>
              <th className="text-left p-2 border-b">Role</th>
              <th className="text-left p-2 border-b">Updated At</th>
              <th className="text-left p-2 border-b">Updated By</th>
              <th className="text-left p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border-b">{u.username || "N/A"}</td>
                <td className="p-2 border-b">{u.email}</td>
                <td className="p-2 border-b capitalize">
                  {canChangeRole(u) ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      {getAllowedRolesForUser(u).map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td className="p-2 border-b">
                  {u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "N/A"}
                </td>
                <td className="p-2 border-b">
                  {u.updatedBy
                    ? typeof u.updatedBy === "string"
                      ? `${u.updatedBy}`
                      : typeof u.updatedBy === "object"
                      ? `${
                          u.updatedBy.name ||
                          u.updatedBy.fullName ||
                          u.updatedBy.username ||
                          "Unknown"
                        } (${u.updatedBy.email || "No Email"})`
                      : "Unknown"
                    : "N/A"}
                </td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handlePasswordChange(u.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Change Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default AdminUserPanel;
