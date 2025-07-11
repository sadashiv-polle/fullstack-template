import { NavLink, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const role = user?.role;

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  const baseLinkClass =
    "text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium px-3 py-2 rounded-md";
  const activeLinkClass =
    "text-blue-600 font-semibold border-b-2 border-blue-600 px-3 py-2 rounded-md";

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - Logo and links */}
            <div className="flex items-center gap-8">
              <img
                src="/logo192.png"
                alt="logo"
                className="h-10 w-10 rounded-md shadow-md"
              />
              <div className="hidden md:flex space-x-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? activeLinkClass : baseLinkClass
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? activeLinkClass : baseLinkClass
                  }
                >
                  About
                </NavLink>

                <NavLink
                  to="/page1"
                  className={({ isActive }) =>
                    isActive ? activeLinkClass : baseLinkClass
                  }
                >
                  Page 1
                </NavLink>

                <NavLink
                  to="/page2"
                  className={({ isActive }) =>
                    isActive ? activeLinkClass : baseLinkClass
                  }
                >
                  Page 2
                </NavLink>

                {(role === "superadmin" || role === "admin") && (
                  <>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive ? activeLinkClass : baseLinkClass
                      }
                    >
                      Admin
                    </NavLink>

                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        isActive ? activeLinkClass : baseLinkClass
                      }
                    >
                      Manage Users
                    </NavLink>
                  </>
                )}
              </div>
            </div>

            {/* Right side - User info & buttons */}
            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <span className="text-gray-700 font-semibold text-sm truncate max-w-xs">
                    {user.email}
                  </span>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 rounded-md shadow-sm transition"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-md shadow-sm transition"
                  aria-label="Login"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div
          id="popup-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4 sm:mx-0">
            <div className="text-center">
              {/* Info icon */}
              <svg
                className="mx-auto mb-4 text-blue-500 w-14 h-14"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>

              <h3
                id="modal-title"
                className="mb-6 text-xl font-semibold text-gray-800"
              >
                Are you sure you want to logout?
              </h3>

              <div className="flex justify-center gap-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleLogout();
                  }}
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg px-6 py-2 shadow-md transition"
                >
                  Yes, I’m sure
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 rounded-lg px-6 py-2 transition"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
