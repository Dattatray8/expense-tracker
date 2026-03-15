"use client";
import React, { useState } from "react";

const Page = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    const isReady = email && password.length >= 8;
    if (!isReady) {
      toast.error("Please fill in all fields correctly.");
      return;
    }
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember:", remember);

    // future API login here
  };   // ✅ THIS WAS MISSING

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 perspective">

     <div className="card w-96 bg-base-100 shadow-xl p-8 transition-all duration-500 transform hover:rotate-x-6 hover:-rotate-y-6 hover:scale-105 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">
            Login
        </h2>

        <div className="flex flex-col gap-4">

          {/* Email */}
          <label className="input validator">

            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>

            <input
              type="email"
              placeholder="mail@site.com"
              required
            />

          </label>

          {/* Password */}
          <label className="input validator">

            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>

            <input
              type="password"
              required
              placeholder="Password"
              minLength={8}
            />

          </label>

          {/* Remember + Forgot */}
          <div className="flex justify-between text-sm mt-2">

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
              Remember me
            </label>

            <span className="link link-primary">
              Forgot password?
            </span>

          </div>

          {/* Login Button */}
          <button className="btn btn-primary mt-4">
            Login
          </button>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Google Login */}
          <button className="btn btn-outline">
            Continue with Google
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm mt-3">
            Don't have an account?
            <span className="link link-primary ml-1">
              Sign Up
            </span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Page;