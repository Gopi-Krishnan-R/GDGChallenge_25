import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, update } from "firebase/database";
import { auth, db_log } from "../firebase/firebase";

const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@cet.ac.in")) {
      alert("Only @cet.ac.in email addresses are allowed");
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      navigate("events");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("Account does not exist. Please sign up first.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          CET Event Portal
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@cet.ac.in"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-4l mx-auto flex justify-between">
              <h1 className="text-2l font-bold">Admin Dashboard</h1>
              <button
                onClick={() => navigate('admin')}
                className="text-sm text-gray-600"
              >
                Click here
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("signup")}
            className="text-sm text-blue-600 hover:underline"
          >
            Create an account
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Only <span className="font-semibold">@cet.ac.in</span> email addresses
          are allowed
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
// Create New User.
// import { createUserWithEmailAndPassword } from "firebase/auth";
