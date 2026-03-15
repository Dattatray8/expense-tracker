"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getUser } from "@/helper/client/user";
import toast from "react-hot-toast";

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(user?.username || "");
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("monthlyIncome", (monthlyIncome || 0).toString());
      if (imageFile) {
        formData.append("file", imageFile);
      }

      const res = await axios.put("/api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        await getUser(dispatch); // Fetch updated data
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Monthly Income (Base)</span>
            </label>
            <input
              type="number"
              min="0"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Profile Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="modal-action mt-6 gap-2 sm:gap-4 flex-col sm:flex-row">
            <button
              type="button"
              className="btn btn-ghost w-full sm:w-auto"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Save"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
