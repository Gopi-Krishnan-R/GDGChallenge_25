import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, update } from "firebase/database";
import { auth, db_log } from "../firebase";

const LoginPage = () => {
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

      await update(ref(db_log, `users/${user.uid}`), {
        lastLogin: Date.now(),
      });

      console.log("Login successful:", user.email);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = result.user;

        await set(ref(db_log, `users/${user.uid}`), {
          email: user.email,
          role: "user",
          createdAt: Date.now(),
          lastLogin: Date.now(),
        });

        console.log("User created:", user.email);
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
            Login / Sign Up
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
