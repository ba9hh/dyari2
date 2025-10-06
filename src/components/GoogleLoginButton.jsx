import React from "react";

const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Login with Google"
      className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 active:scale-95 transition duration-150 ease-in-out"
    >
      {/* Google Logo */}
      <svg
        className="w-5 h-5"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.64 1.22 9.12 3.6l6.82-6.82C35.46 2.54 30.1 0 24 0 14.62 0 6.38 5.38 2.56 13.22l7.96 6.18C12.1 13.26 17.62 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24.5c0-1.64-.15-3.2-.44-4.71H24v9.02h12.7c-.55 2.94-2.2 5.42-4.68 7.09l7.34 5.7C43.68 37.88 46.5 31.64 46.5 24.5z"
        />
        <path
          fill="#FBBC05"
          d="M10.52 28.41c-.5-1.46-.77-3.02-.77-4.66s.27-3.2.77-4.66l-7.96-6.18C1.05 15.44 0 19.62 0 23.75c0 4.13 1.05 8.31 2.56 11.84l7.96-6.18z"
        />
        <path
          fill="#34A853"
          d="M24 47.5c6.1 0 11.46-2.02 15.26-5.49l-7.34-5.7c-2.05 1.4-4.67 2.24-7.92 2.24-6.38 0-11.9-3.76-14.48-9.14l-7.96 6.18C6.38 42.62 14.62 47.5 24 47.5z"
        />
      </svg>
      <span className="font-medium">Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
