"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getUser } from "@/helper/client/user";
import { useSession } from "next-auth/react";
import EditProfileModal from "@/components/EditProfileModal";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionList from "@/components/TransactionList";
import MonthlySummaryCharts from "@/components/MonthlySummaryCharts";
import DailyTrendChart from "@/components/DailyTrendChart";
import SmartInsights from "@/components/SmartInsights";
import OfflineBanner from "@/components/OfflineBanner";
import BudgetProgress from "@/components/BudgetProgress";
import InsightCards from "@/components/InsightCards";
import RecurringCard from "@/components/RecurringCard";
import InstallPrompt from "@/components/InstallPrompt";
import EditTransactionModal from "@/components/EditTransactionModal";
import axios from "axios";
import { Wallet, TrendingUp, TrendingDown, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  getCachedTransactions,
  setCachedTransactions,
  getCachedSummary,
  setCachedSummary,
  getPendingTransactions,
  clearPendingTransactions,
} from "@/lib/offlineCache";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const { userData } = useSelector((state: any) => state.user);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [previousMonthSummary, setPreviousMonthSummary] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (status === "authenticated" && !userData) {
      getUser(dispatch);
    }
  }, [status, dispatch, userData]);

  const fetchDashboardData = useCallback(async () => {
    setLoadingData(true);
    const month = selectedMonth;
    const year = selectedYear;
    if (!navigator.onLine) {
      const cachedTx = getCachedTransactions(month, year);
      const cachedSum = getCachedSummary(month, year);
      setTransactions(cachedTx || []);
      setSummary(cachedSum || null);
      setLoadingData(false);
      return;
    }
    try {
      const [txRes, sumRes, catRes] = await Promise.all([
        axios.get(`/api/transactions?month=${month}&year=${year}`),
        axios.get(`/api/transactions/summary?month=${month}&year=${year}`),
        axios.get("/api/categories"),
      ]);
      const txList = txRes.data.transactions || [];
      const sumData = sumRes.data;
      setTransactions(txList);
      setSummary(sumData);
      setCachedTransactions(month, year, txList);
      setCachedSummary(month, year, sumData);
      setCategories(catRes.data.categories || []);
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      axios.get(`/api/transactions/summary?month=${prevMonth}&year=${prevYear}`).then((r) => setPreviousMonthSummary(r.data)).catch(() => setPreviousMonthSummary(null));
    } catch (err) {
      const cachedTx = getCachedTransactions(month, year);
      const cachedSum = getCachedSummary(month, year);
      setTransactions(cachedTx || []);
      setSummary(cachedSum || null);
    } finally {
      setLoadingData(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
    };
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (session?.user && userData?.monthlyIncome > 0) {
      fetchDashboardData();
    } else {
      setLoadingData(false);
    }
  }, [session, userData?.monthlyIncome, selectedMonth, selectedYear, fetchDashboardData]);

  const syncPendingTransactions = useCallback(async () => {
    const pending = getPendingTransactions();
    if (pending.length === 0) return;
    for (const tx of pending) {
      try {
        await axios.post("/api/transactions", {
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          date: tx.date,
          name: tx.description,
        });
      } catch {
        break;
      }
    }
    clearPendingTransactions();
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (isOnline && session?.user && userData?.monthlyIncome > 0 && getPendingTransactions().length > 0) {
      syncPendingTransactions();
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const pendingForMonth = getPendingTransactions().filter((p) => {
    const [y, m] = p.date.split("-").map(Number);
    return m === selectedMonth && y === selectedYear;
  });
  const pendingAsListItems = pendingForMonth.map((p) => ({
    _id: p.tempId,
    amount: p.amount,
    type: p.type,
    date: p.date,
    description: p.description,
    category: { name: p.categoryName },
    _pending: true,
  }));
  let displayTransactions = [...transactions, ...pendingAsListItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    displayTransactions = displayTransactions.filter(
      (t) =>
        (t.description || "").toLowerCase().includes(q) ||
        (t.category?.name || "").toLowerCase().includes(q)
    );
  }
  if (filterCategoryId) {
    displayTransactions = displayTransactions.filter((t) => t.category?._id === filterCategoryId);
  }

  const handleTransactionAdded = () => {
    fetchDashboardData();
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
      {!isOnline && <OfflineBanner />}

      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary to-secondary text-primary-content py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between text-center md:text-left gap-4 sm:gap-6">
            <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 animate-fade-in-up">
                    Master Your Money{userData ? `, ${userData.username?.split(" ")[0] || ""}` : ""}
                </h1>
                <p className="text-base sm:text-xl opacity-90 max-w-2xl mx-auto md:mx-0">
                    Track every penny, visualize your spending, and achieve your financial goals.
                </p>
            </div>
            {session && userData?.monthlyIncome > 0 && (
                <button 
                    onClick={() => setIsAddTxModalOpen(true)}
                    className="btn btn-neutral text-neutral-content btn-lg shadow-2xl hover:scale-105 border-0 w-full sm:w-auto"
                >
                    <Plus size={24} /> Add Transaction
                </button>
            )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 -mt-10 relative z-10">
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
                <div className="alert shadow-xl bg-linear-to-r from-warning/20 to-error/20 border-l-4 border-error rounded-xl p-6">
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

            {/* Month selector */}
            {userData?.monthlyIncome > 0 && (
              <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-base-100 rounded-xl shadow-sm border border-base-200 p-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={() => {
                      if (selectedMonth === 1) {
                        setSelectedMonth(12);
                        setSelectedYear((y) => y - 1);
                      } else setSelectedMonth((m) => m - 1);
                    }}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-bold text-base-content min-w-[140px] sm:min-w-[180px] text-center text-sm sm:text-base">
                    {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square"
                    onClick={() => {
                      if (selectedMonth === 12) {
                        setSelectedMonth(1);
                        setSelectedYear((y) => y + 1);
                      } else setSelectedMonth((m) => m + 1);
                    }}
                    aria-label="Next month"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Insight cards */}
            {userData?.monthlyIncome > 0 && !loadingData && summary && (
              <div className="md:col-span-3">
                <InsightCards
                  summary={summary}
                  previousMonthSummary={previousMonthSummary}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </div>
            )}

            {/* Main Content Render if User setup is complete */}
            {userData?.monthlyIncome > 0 && !loadingData && (
              <>
                {/* Visual Chart Box */}
                <div className="md:col-span-1 rounded-2xl flex flex-col gap-6">
                    <MonthlySummaryCharts data={summary?.expensesByCategory || []} />
                    <DailyTrendChart data={summary?.dailyData || []} />
                    <BudgetProgress expensesByCategory={summary?.expensesByCategory || []} />
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
                    <RecurringCard />
                </div>

                {/* History + Insights */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 min-h-[320px]">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                            <h3 className="font-bold text-xl text-base-content">Activity — {MONTH_NAMES[selectedMonth - 1]}</h3>
                            <button className="btn btn-primary btn-sm gap-1" onClick={() => setIsAddTxModalOpen(true)}>
                              <Plus size={16} /> Add New
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-[140px]">
                            <Search size={16} className="opacity-50" />
                            <input
                              type="text"
                              placeholder="Search..."
                              className="grow"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </label>
                          <select
                            className="select select-bordered select-sm w-40"
                            value={filterCategoryId}
                            onChange={(e) => setFilterCategoryId(e.target.value)}
                          >
                            <option value="">All categories</option>
                            {categories.filter((c) => c.name).map((c) => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <TransactionList
                          transactions={displayTransactions}
                          onEdit={(tx) => setEditTx(tx)}
                          onAddFirst={() => setIsAddTxModalOpen(true)}
                        />
                    </div>
                    <SmartInsights summary={summary} />
                </div>
              </>
            )}
            
            {userData?.monthlyIncome > 0 && !isOnline && !loadingData && !summary && (
              <div className="md:col-span-3 alert alert-info shadow-lg">
                <span>You&apos;re offline and there&apos;s no cached data for this month. Connect to the internet to load your dashboard.</span>
              </div>
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
            <EditTransactionModal
                transaction={editTx}
                isOpen={!!editTx}
                onClose={() => setEditTx(null)}
                onSaved={handleTransactionAdded}
            />
            <InstallPrompt />
        </>
      )}
    </div>
  );
}
