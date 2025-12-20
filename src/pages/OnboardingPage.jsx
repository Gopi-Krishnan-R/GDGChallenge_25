import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const OnboardingPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    program: "BTech",
    branch: "",
    batch: "Batch 1",
    gradYear: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Session expired. Please login again.");
        navigate("login");
        return;
      }

      // Save profile data to Firestore using UID as document ID
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        email: user.email,
        onboardingComplete: true,
        joinedAt: new Date().toISOString(),
      });

      // Navigate to the Events Timeline
      navigate("events");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all duration-200 shadow-sm text-slate-700";
  const labelStyle = "block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-10">
        
        {/* Header Section */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome to Campus Notifier
          </h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Complete your profile to customize your event timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Full Name */}
          <div>
            <label className={labelStyle}>Full Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Rahul Sharma"
              className={inputStyle}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2. Program */}
            <div>
              <label className={labelStyle}>Program</label>
              <select
                className={inputStyle}
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              >
                <option value="BTech">BTech</option>
                <option value="MTech">MTech</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
                <option value="BArch">BArch</option>
              </select>
            </div>

            {/* 3. Branch */}
            <div>
              <label className={labelStyle}>Branch</label>
              <select
                required
                className={inputStyle}
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="AI&DS">AI & Data Science</option>
                <option value="CSE(CS)">CSE (Cyber Security)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 4. Batch */}
            <div>
              <label className={labelStyle}>Batch</label>
              <select
                className={inputStyle}
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              >
                <option value="Batch 1">Batch 1</option>
                <option value="Batch 2">Batch 2</option>
              </select>
            </div>

            {/* 5. Graduation Year */}
            <div>
              <label className={labelStyle}>Graduation Year</label>
              <input
                required
                type="number"
                placeholder="2026"
                min={new Date().getFullYear()}
                max="2032"
                className={inputStyle}
                value={formData.gradYear}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow clearing the field
                  if (value === "") {
                    setFormData({ ...formData, gradYear: "" });
                    return;
                  }

                  // Only allow up to 4 numeric characters
                  if (!/^\d{0,4}$/.test(value)) {
                    return;
                  }

                  // When 4 digits are entered, enforce the valid range
                  if (value.length === 4) {
                    const year = Number(value);
                    const currentYear = new Date().getFullYear();
                    if (year < currentYear || year > 2032) {
                      return;
                    }
                  }

                  setFormData({ ...formData, gradYear: value });
                }}
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white text-base shadow-xl transition-all transform active:scale-[0.98] ${
                loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-slate-900 hover:bg-black hover:shadow-2xl hover:shadow-slate-200"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Finalizing...</span>
                </div>
              ) : (
                "Finish Setup"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;