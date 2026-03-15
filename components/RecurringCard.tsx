"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarClock, Plus, Trash2 } from "lucide-react";

interface RecurringItem {
  _id: string;
  title: string;
  amount: number;
  type: string;
  dayOfMonth: number;
  category?: { name: string };
}

export default function RecurringCard() {
  const [list, setList] = useState<RecurringItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", dayOfMonth: "1", type: "expense" as "income" | "expense" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/recurring").then((res) => setList(res.data.recurring || [])).catch(() => {});
  }, []);

  const today = new Date().getDate();
  const nextUp = list
    .map((r) => ({
      ...r,
      nextDay: r.dayOfMonth >= today ? r.dayOfMonth : null,
      label: r.dayOfMonth === 1 ? "1st" : r.dayOfMonth === 2 ? "2nd" : r.dayOfMonth === 3 ? "3rd" : r.dayOfMonth + "th",
    }))
    .sort((a, b) => (a.dayOfMonth || 32) - (b.dayOfMonth || 32))
    .slice(0, 5);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.dayOfMonth) return;
    setLoading(true);
    try {
      await axios.post("/api/recurring", {
        title: form.title,
        amount: Number(form.amount),
        type: form.type,
        dayOfMonth: Math.min(31, Math.max(1, Number(form.dayOfMonth))),
      });
      const res = await axios.get("/api/recurring");
      setList(res.data.recurring || []);
      setForm({ title: "", amount: "", dayOfMonth: "1", type: "expense" });
      setShowForm(false);
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/recurring/${id}`);
      setList((prev) => prev.filter((r) => r._id !== id));
    } catch {}
  };

  return (
    <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-base-content/80 flex items-center gap-2">
          <CalendarClock size={20} /> Recurring
        </h3>
        <button type="button" className="btn btn-ghost btn-sm gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-4 p-3 bg-base-200 rounded-xl">
          <input
            type="text"
            placeholder="Title (e.g. Rent)"
            className="input input-bordered input-sm flex-1 min-w-[100px]"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            className="input input-bordered input-sm w-24"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            required
          />
          <select
            className="select select-bordered select-sm w-24"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "income" | "expense" }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="Day"
            className="input input-bordered input-sm w-16"
            value={form.dayOfMonth}
            onChange={(e) => setForm((f) => ({ ...f, dayOfMonth: e.target.value }))}
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            Save
          </button>
        </form>
      )}
      <ul className="space-y-2">
        {nextUp.map((r) => (
          <li key={r._id} className="flex justify-between items-center gap-2 py-2 border-b border-base-200 last:border-0">
            <div>
              <span className="font-medium">{r.title}</span>
              <span className="text-sm text-base-content/60 ml-2">
                {r.label} · ₹{r.amount.toLocaleString()} ({r.type})
              </span>
            </div>
            <button type="button" className="btn btn-ghost btn-xs btn-square text-error" onClick={() => handleDelete(r._id)}>
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {list.length === 0 && !showForm && <p className="text-sm text-base-content/50">No recurring items. Add rent, subscriptions, etc.</p>}
      </ul>
    </div>
  );
}
