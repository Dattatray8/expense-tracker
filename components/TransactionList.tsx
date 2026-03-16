"use client";

import React from "react";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, ReceiptText, Download, Pencil, Plus } from "lucide-react";
import { Transaction } from "@/types/transaction.types";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (tx: Transaction) => void;
  onAddFirst?: () => void;
}

export default function TransactionList({ transactions, onEdit, onAddFirst }: TransactionListProps) {
    
    const handleExportCSV = () => {
        if (!transactions || transactions.length === 0) return;

        // Create CSV Header
        const headers = ["Date", "Type", "Category", "Description", "Amount (₹)"];
        
        // Create CSV Rows
        const rows = transactions.map(tx => [
            format(new Date(tx.date), "yyyy-MM-dd"),
            tx.type,
            tx.category?.name || "Uncategorized",
            `"${(tx.description || "").replace(/"/g, '""')}"`, // escape quotes for CSV
            tx.amount
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create Blob and Download Link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `transactions_${format(new Date(), "yyyy-MM")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    if (!transactions || transactions.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center justify-center bg-base-100 rounded-2xl border border-base-200">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ReceiptText size={32} className="text-primary" />
                </div>
                <p className="text-lg font-semibold text-base-content mb-1">No transactions yet</p>
                <p className="text-sm text-base-content/60 mb-6 text-center max-w-xs">Add your first income or expense to start tracking.</p>
                {onAddFirst && (
                    <button type="button" className="btn btn-primary gap-2" onClick={onAddFirst}>
                        <Plus size={18} /> Add your first transaction
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Action Bar */}
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleExportCSV}
                    className="btn btn-sm btn-outline gap-2 shadow-sm"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {transactions.map((tx) => {
                    const amountStr = tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    return (
                    <div key={tx._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-base-100 rounded-2xl shadow-sm border border-base-100/50 hover:shadow-md hover:border-base-300 transition-all duration-300 group gap-4 sm:gap-0">
                        <div className="flex items-center gap-4 w-full">
                            <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${tx.type === "income" ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}>
                                {tx.type === "income" ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-base-content text-lg leading-tight truncate">{tx.description || tx.category?.name}</p>
                                <p className="text-sm font-medium opacity-60 flex items-center gap-1 mt-1 flex-wrap">
                                    {format(new Date(tx.date), "MMM dd, yyyy")} <span className="opacity-50 mx-1">•</span> <span className="badge badge-sm badge-ghost">{tx.category?.name || "Unknown"}</span>
                                    {tx._pending && <span className="badge badge-sm badge-warning">Pending sync</span>}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <div className={`font-extrabold text-xl font-mono ${tx.type === "income" ? "text-success" : "text-error"}`}>
                            {tx.type === "income" ? "+" : "-"}₹{amountStr}
                        </div>
                        {onEdit && !tx._pending && (
                            <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => onEdit(tx)} aria-label="Edit">
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}
