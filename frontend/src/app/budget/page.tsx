"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Home,
  Utensils,
  ShoppingBag,
  Car,
  MoreHorizontal,
  Download,
  Calendar,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import api from "@/lib/api";

export default function GlobalBudgetPage() {
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const { budget, loading, error, refresh } = useBudget(selectedTripId);
  const [trips, setTrips] = useState<any[]>([]);
  const [fetchingTrips, setFetchingTrips] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips");
        if (response.data.success) {
          setTrips(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedTripId(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error("Fetch Trips Error:", error);
      } finally {
        setFetchingTrips(false);
      }
    };
    fetchTrips();
  }, []);

  const stats = [
    {
      label: "Estimated total",
      value: budget ? `₹${budget.totalCost.toLocaleString()}` : "₹0",
      change: budget?.status === "Expensive" ? "High" : budget?.status === "Low" ? "Value" : "Moderate",
      icon: <Wallet size={20} />,
      tone: budget?.status === "Expensive" ? "text-danger bg-danger/10" : budget?.status === "Low" ? "text-success bg-success/10" : "text-primary bg-primary/10",
    },
    {
      label: "Daily average",
      value: budget ? `₹${budget.averagePerDay.toLocaleString()}` : "₹0",
      change: "Per day",
      icon: <TrendingUp size={20} />,
      tone: "text-warning bg-warning/10",
    },
    {
      label: "Stability",
      value: "Verified",
      change: "Sync active",
      icon: <CheckCircle2 size={20} />,
      tone: "text-success bg-success/10",
    },
  ];

  const breakdownItems = [
    { label: "Accommodation", value: budget?.hotelCost || 0, icon: <Home size={18} />, bar: "bg-blue-500", dot: "bg-blue-500" },
    { label: "Dining & food", value: budget?.foodCost || 0, icon: <Utensils size={18} />, bar: "bg-emerald-500", dot: "bg-emerald-500" },
    { label: "Activities", value: budget?.activityCost || 0, icon: <ShoppingBag size={18} />, bar: "bg-primary", dot: "bg-primary" },
    { label: "Transport", value: budget?.transportCost || 0, icon: <Car size={18} />, bar: "bg-amber-500", dot: "bg-amber-500" },
    { label: "Miscellaneous", value: budget?.miscellaneousCost || 0, icon: <MoreHorizontal size={18} />, bar: "bg-slate-500", dot: "bg-slate-500" },
  ];

  if (fetchingTrips || (loading && !budget)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Calculating budget...</p>
      </div>
    );
  }

  const total = budget?.totalCost || 1;

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget</h1>
          <p className="page-subtitle">Dynamic budget intelligence for your trips.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="select bg-card flex-1 sm:flex-none"
          >
            {trips.length > 0 ? (
              trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))
            ) : (
              <option value="">No trips found</option>
            )}
          </select>
          <button onClick={refresh} className="btn btn-outline" aria-label="Refresh">
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-3 p-4 card border-danger/30 text-danger rounded-xl">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="card card-pad card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.tone}`}>
                {stat.icon}
              </div>
              <span className="badge badge-neutral">{stat.change}</span>
            </div>
            <div className="stat-label mb-1">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="section-title text-lg sm:text-xl">Expenditure breakdown</h2>
            <p className="text-sm text-muted-foreground">Distribution of costs across categories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {breakdownItems.map((item, idx) => {
              const pct = Math.round(((item.value || 0) / total) * 100);
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card card-pad card-hover"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{pct}% of budget</div>
                      </div>
                    </div>
                    <div className="font-semibold text-foreground">₹{item.value.toLocaleString()}</div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: idx * 0.08 }}
                      className={`h-full ${item.bar} rounded-full`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {budget?.status === "Expensive" && (
            <div className="card card-pad border-danger/30 bg-danger/5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-danger text-white flex items-center justify-center shrink-0 animate-pulse-soft">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Budget alert</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your current plan is above moderate limits. Consider optimizing activities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-5">
          <h2 className="section-title text-lg sm:text-xl">Summary</h2>
          <div className="card card-pad relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-44 h-44 rounded-full border-[14px] border-muted flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground mb-1">Total budget</p>
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  ₹{budget?.totalCost?.toLocaleString() || "0"}
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-muted">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={15} className="text-primary" />
                  Last updated
                </span>
                <span className="text-sm font-medium text-foreground">
                  {budget ? new Date(budget.updatedAt).toLocaleTimeString() : "Never"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-muted">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp size={15} className="text-success" />
                  Cost tier
                </span>
                <span
                  className={`text-sm font-medium ${
                    budget?.status === "Expensive" ? "text-danger" : "text-success"
                  }`}
                >
                  {budget?.status || "—"}
                </span>
              </div>
            </div>
            <button className="btn btn-outline w-full mt-5">
              <Download size={16} />
              Export report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
