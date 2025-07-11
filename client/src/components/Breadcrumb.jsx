import React from "react";
import { useNavigate } from "react-router-dom";

function Breadcrumb({ items }) {
  const navigate = useNavigate();

  return (
    <nav
      className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="inline-flex items-center">
              {!isLast ? (
                <>
                  <button
                    onClick={() => navigate(item.path)}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                    aria-label={`Go to ${item.label}`}
                  >
                    {item.icon && (
                      <span className="mr-2.5">{item.icon}</span>
                    )}
                    {item.label}
                  </button>

                  {/* Separator */}
                  <svg
                    className="block w-3 h-3 mx-1 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </>
              ) : (
                <span
                  className="ml-1 text-sm font-medium text-gray-500 md:ml-2"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
