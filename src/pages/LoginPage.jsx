import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Placeholder login function
  const handleLogin = (e) => {
    e.preventDefault();
//    alert(`Login function will be handled by teammate\nEmail: ${email}\nPassword: ${password}`);
		const res = email.endsWith("@cet.ac.in");
		if (res === true){
			signInWithPopup(auth, googleProvider)
				.then((result) => {
					const email = result.user.email;
					if (!email.endsWith("@cet.ac.in")) {
						signOut(auth);
						alert("Only CET emails allowed");
					}
				});
		} else {
			alert(`Only @cet.ac.in email addresses are accepted for now!!`);
		}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

// Create New User.
// import { createUserWithEmailAndPassword } from "firebase/auth";
