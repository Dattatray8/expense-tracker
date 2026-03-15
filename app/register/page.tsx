"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {

  const router = useRouter();

  const [formValue, setFormValue] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSignup = () => {
    const isReady= formValue.username.length >= 3 && formValue.username.length <= 30 &&
      formValue.email.includes("@") &&
      formValue.password.length >= 8;
    if (!isReady) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    console.log("User Data:", formValue);

    // you can add API call here later

    // redirect to login page
    router.push("/login");

    // or redirect to home page
    // router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      
      <div className="card w-96 bg-base-100 shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <div className="flex flex-col gap-4">

          {/* Username */}
          <label className="input validator">
            <input
              type="text"
              placeholder="Username"
              minLength={3}
              maxLength={30}
              value={formValue.username}
              onChange={(e) =>
                setFormValue({ ...formValue, username: e.target.value })
              }
            />
          </label>

          {/* Email */}
          <label className="input validator">
            <input
              type="email"
              placeholder="mail@site.com"
              value={formValue.email}
              onChange={(e) =>
                setFormValue({ ...formValue, email: e.target.value })
              }
            />
          </label>

          {/* Password */}
          <label className="input validator">
            <input
              type="password"
              placeholder="Password"
              minLength={8}
              value={formValue.password}
              onChange={(e) =>
                setFormValue({ ...formValue, password: e.target.value })
              }
            />
          </label>

          {/* Signup Button */}
          <button
            className="btn btn-primary mt-2"
            onClick={handleSignup}
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="text-center text-sm mt-2">
            Already have an account?
            <span
              className="link link-primary ml-1 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Page;