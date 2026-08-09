"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Plus,
  ArrowUpRight,
  PieChart,
  BarChart3,
  CreditCard,
  Loader2,
  ChevronLeft,
  Home,
  Utensils,
  ShoppingBag,
  Car,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function BudgetPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const [budget, setBudget] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, budgetRes] = await Promise.all([
          api.get(`/trips`),
          api.get(`/budget/${tripId}`),
        ]);

        if (tripRes.data.success) {
          const foundTrip = tripRes.data.data.find((t: any) => t.id === tripId);
          setTrip(foundTrip);
        }

        if (budgetRes.data.success) {
          setBudget(budgetRes.data.data);
        }
      } catch (error) {
        console.error("Fetch Budget Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Accessing ledger...</p>
      </div>
    );
  }

  const categories = [
    { name: "Accommodation", spent: budget?.hotelCost || 0, total: (budget?.hotelCost || 0) * 1.2, color: "bg-rose-500", icon: <Home size={18} /> },
    { name: "Transport", spent: budget?.transportCost || 0, total: (budget?.transportCost || 0) * 1.5, color: "bg-blue-500", icon: <Car size={18} /> },
    { name: "Food", spent: budget?.foodCost || 0, total: (budget?.foodCost || 0) * 1.3, color: "bg-amber-500", icon: <Utensils size={18} /> },
    { name: "Activities", spent: budget?.activityCost || 0, total: (budget?.activityCost || 0) * 1.1, color: "bg-emerald-500", icon: <ShoppingBag size={18} /> },
    { name: "Misc", spent: budget?.miscellaneousCost || 0, total: (budget?.miscellaneousCost || 0) * 2, color: "bg-slate-500", icon: <MoreHorizontal size={18} /> },
  ];

  const expenseRows = [
    { title: "Accommodation", category: "Stay", amount: budget?.hotelCost || 0, icon: <Home size={18} /> },
    { title: "Transport", category: "Travel", amount: budget?.transportCost || 0, icon: <Car size={18} /> },
    { title: "Food & dining", category: "Food", amount: budget?.foodCost || 0, icon: <Utensils size={18} /> },
    { title: "Activities", category: "Experience", amount: budget?.activityCost || 0, icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <Link
            href={`/trips/${tripId}/itinerary`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-3"
          >
            <ChevronLeft size={16} />
            Back to itinerary
          </Link>
          <h1 className="page-title">Trip Budget</h1>
          <p className="page-subtitle">
            Cost breakdown for <span className="text-foreground font-medium">{trip?.title || "your trip"}</span>.
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Add expense
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card card-pad card-hover relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Wallet size={20} />
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Total estimated cost
          </div>
          <div className="stat-value mb-3">₹{budget?.totalCost?.toLocaleString() || "0"}</div>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
            <TrendingUp size={15} />
            Daily avg: ₹{budget?.averagePerDay?.toLocaleString() || "0"}
          </div>
        </motion.div>

        <div className="md:col-span-2 card card-pad">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">Category breakdown</h3>
            <div className="flex gap-1.5">
              {categories.map((c, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${c.color}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {categories.map((cat, idx) => {
              const pct = Math.min((cat.spent / (cat.total || 1)) * 100, 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="flex items-center gap-2 text-muted-foreground font-medium">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                      {cat.name}
                    </span>
                    <span className="font-semibold text-foreground">₹{cat.spent.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: idx * 0.08 }}
                      className={`h-full ${cat.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses */}
        <div className="lg:col-span-2">
          <div className="section-heading">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard size={19} />
            </div>
            <h3 className="section-title">Expense log</h3>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-muted/60">
                  <tr>
                    <th>Category</th>
                    <th>Details</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.map((expense, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {expense.icon}
                          </span>
                          <span className="font-medium text-foreground">{expense.title}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{expense.category}</td>
                      <td className="text-right">
                        <span className="font-semibold text-foreground">₹{expense.amount.toLocaleString()}</span>
                        <ArrowUpRight size={14} className="inline ml-1 text-success" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="space-y-5">
          <section className="card card-pad">
            <h3 className="section-title mb-6 flex items-center gap-3">
              <PieChart size={18} className="text-primary" />
              Efficiency
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Logistics rating</div>
                  <div className="text-lg font-semibold text-foreground">Optimal</div>
                </div>
                <div className="flex items-end gap-1.5 h-12">
                  <div className="bg-primary/20 w-4 h-[40%] rounded-md" />
                  <div className="bg-primary/20 w-4 h-[60%] rounded-md" />
                  <div className="bg-primary/20 w-4 h-[50%] rounded-md" />
                  <div className="bg-primary/20 w-4 h-[80%] rounded-md" />
                  <div className="bg-primary w-4 h-[90%] rounded-md" />
                </div>
              </div>
              <div className="pt-5 border-t border-border space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sync status</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Cloud active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget limit</span>
                  <span className="font-semibold text-foreground">
                    ₹{((budget?.totalCost || 0) * 1.5).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <button className="btn btn-outline w-full">
            <BarChart3 size={16} />
            View analytics
          </button>
        </div>
      </div>
    </div>
  );
}
