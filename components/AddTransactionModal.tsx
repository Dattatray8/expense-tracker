"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  type: "income" | "expense";
}

export default function AddTransactionModal({ isOpen, onClose, onAdd }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      axios.get("/api/categories")
        .then(res => setCategories(res.data.categories))
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
          ...formData,
          amount: Number(formData.amount)
      }
      const res = await axios.post("/api/transactions", payload);
      if (res.data.success) {
        toast.success("Transaction added!");
        onAdd(res.data.transaction); // Pass back updated tx to refresh UI
        onClose();
        setFormData({ ...formData, name: "", amount: "" }); // reset
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-2xl mb-6 text-center">Add Transaction</h3>
        
        <div className="tabs tabs-boxed mb-6 flex justify-center p-1">
          <button 
            className={`tab flex-1 text-base sm:text-lg font-semibold ${formData.type === 'expense' ? 'tab-active bg-error text-error-content' : ''}`}
            onClick={() => setFormData({...formData, type: 'expense', category: ''})}
          >
            Expense
          </button>
          <button 
            className={`tab flex-1 text-base sm:text-lg font-semibold ${formData.type === 'income' ? 'tab-active bg-success text-success-content' : ''}`}
            onClick={() => setFormData({...formData, type: 'income', category: ''})}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Amount (₹)</span></label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input input-lg input-bordered font-bold text-2xl w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Description / Title</span></label>
            <input
              type="text"
              placeholder="e.g. Groceries at Walmart"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Category</span></label>
            <select
              className="select select-bordered w-full"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="" disabled>Select category</option>
              {filteredCategories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-control">
            <label className="label"><span className="label-text">Date</span></label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="modal-action mt-6 gap-2 sm:gap-4 flex-col sm:flex-row">
            <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
