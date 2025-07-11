import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./pages/Unauthorized";
import AdminPage from "./pages/AdminPage";
import About from "./pages/About";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import AdminUserPanel from "./pages/AdminUserPanel";
import CreateUser from "./pages/CreateUser"; // New admin page

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes - accessible to any logged-in user */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
        <Route
          path="/page1"
          element={
            <PrivateRoute>
              <Page1 />
            </PrivateRoute>
          }
        />
        <Route
          path="/page2"
          element={
            <PrivateRoute>
              <Page2 />
            </PrivateRoute>
          }
        />

        {/* Admin Routes - only accessible to 'superadmin' or 'admin' */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["superadmin", "admin"]}>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={["superadmin", "admin"]}>
              <AdminUserPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/create"
          element={
            <PrivateRoute allowedRoles={["superadmin", "admin"]}>
              <CreateUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
