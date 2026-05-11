"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  PieChart,
  BarChart3,
  CreditCard,
  Loader2,
  ChevronLeft
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
          api.get(`/budget/${tripId}`)
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050811] gap-4">
        <Loader2 size={48} className="text-primary animate-spin" />
        <p className="text-sm font-black text-white/20 uppercase tracking-[0.4em] italic">Accessing Ledger...</p>
      </div>
    );
  }

  const categories = [
    { name: "Accommodation", spent: budget?.hotelCost || 0, total: (budget?.hotelCost || 0) * 1.2, color: "bg-rose-500" },
    { name: "Transport", spent: budget?.transportCost || 0, total: (budget?.transportCost || 0) * 1.5, color: "bg-blue-500" },
    { name: "Food", spent: budget?.foodCost || 0, total: (budget?.foodCost || 0) * 1.3, color: "bg-orange-500" },
    { name: "Activities", spent: budget?.activityCost || 0, total: (budget?.activityCost || 0) * 1.1, color: "bg-green-500" },
    { name: "Misc", spent: budget?.miscellaneousCost || 0, total: (budget?.miscellaneousCost || 0) * 2, color: "bg-slate-500" },
  ];

  return (
    <div className="p-12 w-full max-w-7xl mx-auto space-y-12 bg-[#050811] min-h-screen text-foreground">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <Link href={`/trips/${tripId}/itinerary`} className="flex items-center gap-2 text-sm font-black text-white/40 hover:text-primary transition-colors uppercase tracking-widest italic group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Itinerary
          </Link>
          <div>
            <h1 className="text-5xl font-black mb-2 text-white italic uppercase tracking-tighter leading-none">Financial Manifest</h1>
            <p className="text-white/40 font-bold italic">Logistical cost breakdown for <span className="text-primary">{trip?.title || "your voyage"}</span>.</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-widest text-xs italic">
          <Plus size={20} />
          Append Expense
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Total Budget Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 rounded-[40px] border-white/5 relative overflow-hidden group bg-card shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={120} />
          </div>
          <h4 className="text-white/30 text-xs font-black uppercase tracking-[0.3em] mb-4">Total Estimated Cost</h4>
          <div className="text-5xl font-black text-white italic tracking-tighter mb-8">
            ₹{budget?.totalCost?.toLocaleString() || "0.00"}
          </div>
          <div className="flex items-center gap-3 text-primary text-sm font-black uppercase tracking-widest italic">
            <TrendingUp size={18} /> Daily Avg: ₹{budget?.averagePerDay?.toLocaleString() || "0.00"}
          </div>
        </motion.div>

        {/* Expenses Summary */}
        <div className="md:col-span-2 glass-card p-10 rounded-[40px] border-white/5 bg-card shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black text-2xl text-white italic uppercase tracking-tight">Category Breakdown</h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-black text-white/60 uppercase tracking-widest italic">{cat.name}</span>
                  <span className="text-white font-black">₹{cat.spent.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((cat.spent / (cat.total || 1)) * 100, 100)}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                    className={`h-full ${cat.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Recent Transactions placeholder */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white italic uppercase tracking-tight">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
              <CreditCard size={24} />
            </div>
            Operational Log
          </h3>
          <div className="space-y-6">
            {[
              { title: "Base Accommodation", category: "Stay", amount: budget?.hotelCost || 0, date: "System Entry", type: "expense" },
              { title: "Transit Allocation", category: "Transport", amount: budget?.transportCost || 0, date: "System Entry", type: "expense" },
              { title: "Culinary Provision", category: "Food", amount: budget?.foodCost || 0, date: "System Entry", type: "expense" },
            ].map((expense, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all bg-card/50 shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/5 text-primary border border-primary/10`}>
                    <ArrowUpRight size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-white italic uppercase tracking-tight">{expense.title}</h4>
                    <p className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">{expense.category} • {expense.date}</p>
                  </div>
                </div>
                <div className={`text-xl font-black text-white italic`}>
                  ₹{expense.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Analytics Mini Widget */}
        <div className="space-y-8">
          <section className="glass-card p-8 rounded-[40px] border-white/5 bg-card shadow-2xl">
            <h3 className="font-black mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/30 italic">
              <PieChart size={18} className="text-primary" />
              Efficiency Stats
            </h3>
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs font-black text-white/20 uppercase tracking-widest mb-1">Logistics Rating</div>
                  <div className="text-3xl font-black text-white italic tracking-tighter">OPTIMAL</div>
                </div>
                <div className="h-12 w-28 flex items-end gap-1.5 pb-1">
                  <div className="bg-primary/20 w-4 h-[40%] rounded-md" />
                  <div className="bg-primary/20 w-4 h-[60%] rounded-md" />
                  <div className="bg-primary/20 w-4 h-[50%] rounded-md" />
                  <div className="bg-primary/20 w-4 h-[80%] rounded-md" />
                  <div className="bg-primary w-4 h-[90%] rounded-md shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-white/20 font-black uppercase tracking-widest italic">Sync Status</span>
                  <span className="font-black text-green-500 text-xs uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> CLOUD ACTIVE
                  </span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-white/20 font-black uppercase tracking-widest italic">Budget Limit</span>
                  <span className="font-black text-white italic">₹{((budget?.totalCost || 0) * 1.5).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          <button className="w-full py-6 glass border-white/5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all italic text-white/40">
            <BarChart3 size={20} />
            Operational Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
