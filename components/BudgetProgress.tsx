"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Target, Plus } from "lucide-react";

interface BudgetLimit {
  _id: string;
  category: { _id: string; name: string; type: string };
  limitAmount: number;
}

interface BudgetProgressProps {
  expensesByCategory: { name: string; value: number }[];
  onLimitSet?: () => void;
}

export default function BudgetProgress({ expensesByCategory, onLimitSet }: BudgetProgressProps) {
  const [limits, setLimits] = useState<BudgetLimit[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState("");

  useEffect(() => {
    Promise.all([axios.get("/api/budgets"), axios.get("/api/categories")])
      .then(([b, c]) => {
        setLimits(b.data.limits || []);
        setCategories(c.data.categories || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveLimit = async (categoryId: string) => {
    const amount = Number(newLimit);
    if (isNaN(amount) || amount < 0) return;
    try {
      await axios.post("/api/budgets", { category: categoryId, limitAmount: amount });
      const res = await axios.get("/api/budgets");
      setLimits(res.data.limits || []);
      setEditingCategory(null);
      setNewLimit("");
      onLimitSet?.();
    } catch {}
  };

  const categoriesWithLimits = limits.filter((l) => l.category?.type === "expense");
  if (loading && limits.length === 0) return null;
  if (categoriesWithLimits.length === 0 && !expensesByCategory?.length) return null;

  const categoryList = expensesByCategory || [];
  const limitMap = Object.fromEntries(limits.map((l) => [l.category?.name, l]));
  const categoryIdByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  return (
    <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
      <h3 className="font-bold text-lg mb-4 text-base-content/80 flex items-center gap-2">
        <Target size={20} /> Budget by category
      </h3>
      <div className="space-y-4">
        {categoryList.map((cat) => {
          const limit = limitMap[cat.name];
          const spent = cat.value || 0;
          const limitAmount = limit?.limitAmount || 0;
          const pct = limitAmount > 0 ? Math.min(100, (spent / limitAmount) * 100) : 0;
          const isOver = limitAmount > 0 && spent > limitAmount;
          const categoryId = limit?.category?._id || categoryIdByName[cat.name];
          return (
            <div key={cat.name} className="flex flex-col gap-1">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-medium text-base-content/80">{cat.name}</span>
                {limit ? (
                  <span className="text-sm">
                    ₹{spent.toLocaleString()} / ₹{limitAmount.toLocaleString()}
                  </span>
                ) : editingCategory === cat.name ? (
                  <div className="flex gap-1 items-center">
                    <input
                      type="number"
                      min="0"
                      placeholder="Limit"
                      className="input input-bordered input-sm w-24"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => categoryId && handleSaveLimit(categoryId)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs gap-1"
                    onClick={() => setEditingCategory(cat.name)}
                  >
                    <Plus size={12} /> Set limit
                  </button>
                )}
              </div>
              {limitAmount > 0 && (
                <progress
                  className={`progress w-full ${isOver ? "progress-error" : "progress-primary"}`}
                  value={pct}
                  max="100"
                />
              )}
            </div>
          );
        })}
        {categoryList.length === 0 && (
          <p className="text-sm text-base-content/50">Add expenses to set category budgets.</p>
        )}
      </div>
    </div>
  );
}
