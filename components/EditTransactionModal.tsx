"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Transaction } from "@/types/transaction.types";

interface Category {
  _id: string;
  name: string;
  type: "income" | "expense";
}

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditTransactionModal({ transaction, isOpen, onClose, onSaved }: EditTransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ name: "", amount: "", type: "expense" as "income" | "expense", category: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && transaction) {
      setFormData({
        name: transaction.description || "",
        amount: String(transaction.amount ?? ""),
        type: transaction.type || "expense",
        category: transaction.category?._id || "",
        date: transaction.date ? new Date(transaction.date).toISOString().split("T")[0] : "",
      });
      axios.get("/api/categories").then((res) => setCategories(res.data.categories || [])).catch(() => {});
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;
  if (transaction._pending) return null;

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`/api/transactions/${transaction._id}`, {
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        description: formData.name,
      });
      toast.success("Transaction updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof axios.AxiosError ? err.response?.data?.error : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this transaction?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/transactions/${transaction._id}`);
      toast.success("Transaction deleted");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof axios.AxiosError ? err.response?.data?.error : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md w-[95%] max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-4">Edit transaction</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Amount (₹)</span></label>
            <input type="number" min="0.01" step="0.01" className="input input-bordered w-full" value={formData.amount} onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Description</span></label>
            <input type="text" className="input input-bordered w-full" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Type</span></label>
            <select className="select select-bordered w-full" value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value as "income" | "expense", category: "" }))}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Category</span></label>
            <select className="select select-bordered w-full" value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))} required>
              <option value="">Select</option>
              {filteredCategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Date</span></label>
            <input type="date" className="input input-bordered w-full" value={formData.date} onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))} required />
          </div>
          <div className="modal-action justify-between mt-4">
            <button type="button" className="btn btn-error btn-outline btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
