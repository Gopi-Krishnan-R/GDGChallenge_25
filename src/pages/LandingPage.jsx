import React from "react";

const LandingPage = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Event Notifier
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Never miss a college event again
        </p>

        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          A single source of truth for all college events. Exams, workshops,
          deadlines, and cultural activities — all in one place with intelligent
          filtering and priority indicators.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("login")} // Navigate to login page
            className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
