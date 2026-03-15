"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { handleSignOut } from "@/helper/client/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EditProfileModal from "./EditProfileModal";
import Link from "next/link";

export default function Navbar() {
  const { userData } = useSelector((state: any) => state.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const logout = async () => {
    await handleSignOut(router, dispatch);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-3 sm:px-4">
        <div className="flex-1 min-w-0">
          <Link href="/" className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary truncate">
            ExpenseTracker
          </Link>
        </div>
        <div className="flex-none gap-2">
          {userData ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full border-2 border-primary/20">
                  <Image
                    alt="User Profile"
                    src={userData.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="menu-title px-4 py-2">
                  <span className="text-base font-semibold text-base-content">{userData?.username}</span>
                  <span className="text-xs text-base-content/60">{userData?.email}</span>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={() => setIsEditModalOpen(true)} className="flex items-center justify-between">
                    Edit Profile
                    {/* SVG Edit icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                </li>
                <li>
                  <button onClick={logout} className="text-error">Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {userData && (
        <EditProfileModal
          user={userData}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
