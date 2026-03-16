"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { user } from "@/types/redux.types";
import { handleGoogleAuth, handleSignUp } from "@/helper/client/auth";

const Page = () => {
  const router = useRouter();

  const [formValue, setFormValue] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { authLoad } = useSelector((state: user) => state.user);

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-8 mx-4 sm:mx-0">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-1">Create Account</h2>
            <p className="text-base-content/60 text-sm">Join us today</p>
        </div>

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
            className="btn"
            onClick={async () => {
                        await handleSignUp({ formValue, dispatch });
                        router.push("/");
                      }}
            
          >
            {authLoad ? (
              <span className="loading loading-spinner text-neutral"></span>
            ) : (
              "Register"
            )}
          </button>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Google Login */}
          <button className="btn btn-outline" onClick={handleGoogleAuth}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
          {/* Login Link */}
          <p className="text-center text-sm mt-4">
            Already have an account?
            <span
              className="link link-primary font-medium ml-1 cursor-pointer"
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
