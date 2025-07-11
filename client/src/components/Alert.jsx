import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const alertStyles = {
  info: {
    bg: "bg-blue-50 dark:bg-gray-800",
    text: "text-blue-800 dark:text-blue-400",
    ring: "focus:ring-blue-400",
    hover: "hover:bg-blue-200 dark:hover:bg-gray-700",
  },
  error: {
    bg: "bg-red-50 dark:bg-gray-800",
    text: "text-red-800 dark:text-red-400",
    ring: "focus:ring-red-400",
    hover: "hover:bg-red-200 dark:hover:bg-gray-700",
  },
  success: {
    bg: "bg-green-50 dark:bg-gray-800",
    text: "text-green-800 dark:text-green-400",
    ring: "focus:ring-green-400",
    hover: "hover:bg-green-200 dark:hover:bg-gray-700",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-gray-800",
    text: "text-yellow-800 dark:text-yellow-300",
    ring: "focus:ring-yellow-400",
    hover: "hover:bg-yellow-200 dark:hover:bg-gray-700",
  },
  neutral: {
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-300",
    ring: "focus:ring-gray-400",
    hover: "hover:bg-gray-200 dark:hover:bg-gray-700",
  },
};

function Alert({
  type = "info",
  message,
  linkText,
  linkHref,
  onClose,
  dismissible = true,
  duration = 5000,
}) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const style = alertStyles[type];

  useEffect(() => {
    if (duration && dismissible) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setVisible(false);
          onClose?.();
        }, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, dismissible, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={clsx(
        "flex items-center p-4 mb-4 rounded-lg transition-opacity duration-300",
        style.bg,
        style.text,
        {
          "opacity-0": fadeOut,
          "opacity-100": !fadeOut,
        }
      )}
    >
      <div className="text-sm font-medium">
        {message}{" "}
        {linkText && linkHref && (
          <a
            href={linkHref}
            className="font-semibold underline hover:no-underline"
          >
            {linkText}
          </a>
        )}
      </div>

      {dismissible && (
        <button
          onClick={() => {
            setFadeOut(true);
            setTimeout(() => {
              setVisible(false);
              onClose?.();
            }, 300);
          }}
          type="button"
          className={clsx(
            "ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors",
            style.bg,
            style.text,
            style.ring,
            style.hover
          )}
          aria-label="Close"
        >
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(["info", "error", "success", "warning", "neutral"]),
  message: PropTypes.string.isRequired,
  linkText: PropTypes.string,
  linkHref: PropTypes.string,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool,
  duration: PropTypes.number,
};

export default Alert;
