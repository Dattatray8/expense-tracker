"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getUser } from "@/helper/client/user";
import { useSession } from "next-auth/react";
import EditProfileModal from "@/components/EditProfileModal";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionList from "@/components/TransactionList";
import MonthlySummaryCharts from "@/components/MonthlySummaryCharts";
import axios from "axios";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const { userData } = useSelector((state: any) => state.user);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && !userData) {
      getUser(dispatch);
    }
  }, [status, dispatch, userData]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [txRes, sumRes] = await Promise.all([
        axios.get("/api/transactions"),
        axios.get("/api/transactions/summary")
      ]);
      setTransactions(txRes.data.transactions || []);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (session?.user && userData?.monthlyIncome > 0) {
      fetchDashboardData();
    } else {
        setLoadingData(false);
    }
  }, [session, userData?.monthlyIncome]);

  const handleTransactionAdded = () => {
    fetchDashboardData(); // Refresh everything instantly
  };

  if (status === "loading" || (session && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="text-xl font-semibold opacity-70">Loading your finances...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between text-center md:text-left gap-6">
            <div>
                <h1 className="text-5xl font-extrabold mb-4 animate-fade-in-up">
                    Master Your Money{userData ? `, ${userData.username.split(" ")[0]}` : ""}
                </h1>
                <p className="text-xl opacity-90 max-w-2xl">
                    Track every penny, visualize your spending, and achieve your financial goals.
                </p>
            </div>
            {session && userData?.monthlyIncome > 0 && (
                <button 
                    onClick={() => setIsAddTxModalOpen(true)}
                    className="btn btn-neutral text-neutral-content btn-lg shadow-2xl hover:scale-105 border-0"
                >
                    <Plus size={24} /> Add Transaction
                </button>
            )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 -mt-10 relative z-10">
        {!session ? (
            <div className="card bg-base-100 shadow-2xl overflow-hidden hover:shadow-primary/20 transition-all duration-300">
                <div className="card-body text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Wallet size={48} className="text-primary" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 text-base-content">Start Your Journey</h2>
                    <p className="text-base-content/60 text-xl mx-auto mb-8 max-w-xl">
                        Join thousands taking absolute control of their personal wealth today.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/register" className="btn btn-primary btn-lg shadow-lg hover:-translate-y-1">Get Started Free</a>
                        <a href="/login" className="btn btn-outline btn-lg hover:-translate-y-1">Sign In</a>
                    </div>
                </div>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conditional Salary Banner/Card */}
            <div className="md:col-span-3">
              {(!userData?.monthlyIncome || userData.monthlyIncome === 0) ? (
                <div className="alert shadow-xl bg-gradient-to-r from-warning/20 to-error/20 border-l-4 border-error rounded-xl p-6">
                  <Wallet size={36} className="text-error" />
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-base-content">Let's Get Started!</h3>
                    <div className="text-base-content/80 text-base">Add your monthly salary to unlock the dashboard and spending insights.</div>
                  </div>
                  <button onClick={() => setIsEditModalOpen(true)} className="btn btn-error text-error-content shadow-lg hover:shadow-error/50">
                    Add Monthly Salary
                  </button>
                </div>
              ) : (
                <div className="stats stats-vertical sm:stats-horizontal shadow-xl w-full bg-base-100 hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
                  <div className="stat place-items-center py-6 sm:py-8 relative group">
                    <div className="stat-figure text-primary/20">
                        <Wallet size={48} />
                    </div>
                    <div className="stat-title text-base-content/60 font-semibold mb-1">Total Limit / Base Income</div>
                    <div className="stat-value text-base-content text-4xl mb-2 flex items-center gap-2">
                       ₹{(summary?.baseIncome || userData.monthlyIncome).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="stat-desc text-base-content/50 font-medium">Monthly baseline assigned</div>
                    <button onClick={() => setIsEditModalOpen(true)} className="btn btn-ghost btn-xs absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </button>
                  </div>
                  
                  <div className="stat place-items-center py-6 sm:py-8 relative border-t sm:border-t-0 sm:border-l border-base-200">
                    <div className="stat-figure text-error/20">
                        <TrendingDown size={48} />
                    </div>
                    <div className="stat-title text-base-content/60 font-semibold mb-1">Current Expenses</div>
                    <div className="stat-value text-error text-4xl mb-2">₹{(summary?.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="stat-desc font-medium text-error flex items-center gap-1">
                        {summary?.totalIncome ? ((summary.totalExpense / summary.totalIncome) * 100).toFixed(1) : 0}% of budget spent
                    </div>
                  </div>
                  
                  <div className="stat place-items-center py-6 sm:py-8 relative border-t sm:border-t-0 sm:border-l border-base-200">
                    <div className="stat-figure text-success/20">
                        <TrendingUp size={48} />
                    </div>
                    <div className="stat-title text-base-content/60 font-semibold mb-1">Remaining Balance</div>
                    <div className="stat-value text-success text-4xl mb-2">₹{(summary?.remainingBalance || userData.monthlyIncome).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="stat-desc text-success font-medium">Including extra income</div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Render if User setup is complete */}
            {userData?.monthlyIncome > 0 && !loadingData && (
              <>
                {/* Visual Chart Box */}
                <div className="md:col-span-1 rounded-2xl flex flex-col gap-6">
                    <MonthlySummaryCharts data={summary?.expensesByCategory || []} />

                     <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
                        <h3 className="font-bold text-lg mb-4 text-base-content/80 border-b border-base-200 pb-2">At a Glance</h3>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base-content/70">Extra Income</span>
                            <span className="font-bold text-success">+₹{(summary?.transactionIncome || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base-content/70">Category Count</span>
                            <span className="font-bold">{summary?.expensesByCategory?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* History Box */}
                <div className="md:col-span-2">
                    <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-base-content">Recent Activity</h3>
                            <button className="text-primary font-medium hover:underline text-sm" onClick={() => setIsAddTxModalOpen(true)}>+ Add New</button>
                        </div>
                        
                        <TransactionList transactions={transactions} />
                    </div>
                </div>
              </>
            )}
            
            {userData?.monthlyIncome > 0 && loadingData && (
                <div className="md:col-span-3 flex justify-center py-20">
                    <span className="loading loading-spinner text-primary loading-lg"></span>
                </div>
            )}
            
          </div>
        )}
      </main>

      {/* Modals */}
      {userData && (
        <>
            <EditProfileModal
                user={userData}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
            <AddTransactionModal
                isOpen={isAddTxModalOpen}
                onClose={() => setIsAddTxModalOpen(false)}
                onAdd={handleTransactionAdded}
            />
        </>
      )}
    </div>
  );
}
