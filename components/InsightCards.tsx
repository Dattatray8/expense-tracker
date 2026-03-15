"use client";

import React from "react";
import { TrendingUp, TrendingDown, Award } from "lucide-react";

interface InsightCardsProps {
  summary: {
    totalExpense?: number;
    expensesByCategory?: { name: string; value: number }[];
  } | null;
  previousMonthSummary: { totalExpense?: number } | null;
  selectedMonth: number;
  selectedYear: number;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function InsightCards({ summary, previousMonthSummary, selectedMonth, selectedYear }: InsightCardsProps) {
  if (!summary) return null;

  const categories = summary.expensesByCategory || [];
  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const largest = sorted[0];
  const topCategory = sorted[0];
  const prevExpense = previousMonthSummary?.totalExpense ?? 0;
  const currExpense = summary.totalExpense ?? 0;
  const diff = prevExpense > 0 ? ((currExpense - prevExpense) / prevExpense) * 100 : 0;
  const prevMonthLabel = selectedMonth === 1 ? MONTH_NAMES[11] + " " + (selectedYear - 1) : MONTH_NAMES[selectedMonth - 2] + " " + selectedYear;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {largest && (
        <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
            <TrendingDown className="text-error" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-base-content/60">Largest expense</p>
            <p className="font-bold truncate">{largest.name}</p>
            <p className="text-sm text-error">₹{largest.value.toLocaleString()}</p>
          </div>
        </div>
      )}
      {topCategory && (
        <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Award className="text-primary" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-base-content/60">Top category</p>
            <p className="font-bold truncate">{topCategory.name}</p>
            <p className="text-sm text-base-content/70">
              {currExpense > 0 ? ((topCategory.value / currExpense) * 100).toFixed(0) : 0}% of spending
            </p>
          </div>
        </div>
      )}
      {prevExpense > 0 && (
        <div className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-200 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${diff <= 0 ? "bg-success/20" : "bg-warning/20"}`}>
            {diff <= 0 ? <TrendingDown className="text-success" size={20} /> : <TrendingUp className="text-warning" size={20} />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-base-content/60">vs {prevMonthLabel}</p>
            <p className="font-bold">
              {diff > 0 ? "+" : ""}
              {diff.toFixed(1)}%
            </p>
            <p className="text-sm text-base-content/70">
              {diff <= 0 ? "Spent less" : "Spent more"} than last month
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
