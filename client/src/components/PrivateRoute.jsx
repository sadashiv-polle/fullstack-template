import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    // If parsing fails, treat as no user
    user = null;
  }

  // If no token or no user info, redirect to login/home
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // If user role is not in allowedRoles, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized, render the children components
  return children;
}

export default PrivateRoute;
