"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  ShoppingBag,
  Car,
  Utensils,
  Home,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle2
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
        const response = await api.get('/trips');
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
      label: "Estimated Total", 
      value: budget ? `₹${budget.totalCost.toLocaleString()}` : "₹0", 
      change: budget?.status === 'Expensive' ? "High" : budget?.status === 'Low' ? "Value" : "Moderate", 
      icon: <Wallet size={24} />, 
      color: budget?.status === 'Expensive' ? "bg-primary" : budget?.status === 'Low' ? "bg-emerald-500" : "bg-blue-500" 
    },
    { label: "Daily Average", value: budget ? `₹${budget.averagePerDay.toLocaleString()}` : "₹0", change: "-8%", icon: <TrendingUp size={24} />, color: "bg-amber-500" },
    { label: "Stability", value: "Verified", change: "+5%", icon: <CheckCircle2 size={24} />, color: "bg-emerald-500" },
  ];

  const breakdownItems = [
    { label: "Accommodation", value: budget?.hotelCost || 0, icon: <Home />, color: "bg-blue-500" },
    { label: "Dining & Food", value: budget?.foodCost || 0, icon: <Utensils />, color: "bg-emerald-500" },
    { label: "Activities", value: budget?.activityCost || 0, icon: <ShoppingBag />, color: "bg-primary" },
    { label: "Transport", value: budget?.transportCost || 0, icon: <Car />, color: "bg-amber-500" },
    { label: "Miscellaneous", value: budget?.miscellaneousCost || 0, icon: <MoreHorizontal />, color: "bg-slate-500" },
  ];

  if (fetchingTrips || (loading && !budget)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 bg-background">
        <Loader2 size={48} className="text-primary animate-spin" />
        <p className="text-foreground/20 font-black uppercase tracking-[0.4em] italic animate-pulse text-sm">Calculating Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="p-12 w-full space-y-12 bg-background text-foreground min-h-screen pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-2 text-foreground">Finance <span className="text-primary drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">Control</span></h1>
          <p className="text-foreground/40 font-bold italic">Dynamic budget intelligence for your global expeditions.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-8 py-5 glass rounded-2xl border-white/10 bg-transparent text-foreground font-black uppercase tracking-widest text-xs focus:outline-none focus:ring-2 ring-primary/20 appearance-none cursor-pointer pr-12"
          >
            {trips.length > 0 ? (
              trips.map(t => (
                <option key={t.id} value={t.id} className="bg-background text-foreground">{t.title}</option>
              ))
            ) : (
              <option value="" className="bg-background text-foreground">No Voyages Found</option>
            )}
          </select>
          <button onClick={refresh} className="p-5 glass rounded-2xl border-white/10 hover:bg-white/5 transition-all text-foreground group shadow-xl">
            <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-10 rounded-[48px] border-white/5 shadow-2xl relative overflow-hidden group bg-card"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity`} />
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl ${stat.color}/10 text-foreground border border-white/10 shadow-inner`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${stat.color}/10 ${stat.color.replace('bg-', 'text-')} border border-white/5`}>
                {stat.change}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-foreground/30 text-xs font-black uppercase tracking-[0.3em] italic">{stat.label}</p>
              <h2 className="text-5xl font-black italic text-foreground tracking-tighter">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Expenditure Breakdown */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-foreground leading-none">Expenditure Breakdown</h2>
              <p className="text-foreground/40 text-sm font-bold italic mt-2">Scientific distribution of costs across categories.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {breakdownItems.map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-8 glass-card rounded-[40px] border-white/5 hover:border-primary/20 transition-all bg-card/50"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${item.color}/10 flex items-center justify-center ${item.color.replace('bg-', 'text-')} border border-white/10 shadow-inner`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-[0.3em] text-xs text-foreground/30 italic">{item.label}</h3>
                    <p className="text-2xl font-black italic text-foreground tracking-tight">₹{item.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / (budget?.totalCost || 1)) * 100}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                    className={`h-full ${item.color} shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {budget?.status === 'Expensive' && (
            <div className="p-10 bg-primary/5 border border-primary/20 rounded-[48px] flex items-center gap-8 shadow-2xl">
              <div className="p-5 bg-primary text-white rounded-2xl animate-pulse shadow-lg shadow-primary/30">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic text-primary tracking-tight">Budget Alert: High Intensity</h3>
                <p className="text-sm text-foreground/40 font-bold italic mt-1">Your current plan is exceeding standard moderate limits. Consider optimizing activities to maintain financial equilibrium.</p>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Summary */}
        <div className="space-y-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-foreground leading-none">Intelligence Summary</h2>
          <div className="glass-card p-12 rounded-[56px] border-white/5 shadow-2xl space-y-12 relative overflow-hidden bg-card">
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 blur-[120px]" />
             
             <div className="relative aspect-square rounded-full border-[24px] border-white/5 flex flex-col items-center justify-center shadow-inner">
                <div className="text-center">
                  <p className="text-xs font-black text-foreground/20 uppercase tracking-[0.3em] mb-2 italic">Total Payload</p>
                  <h3 className="text-5xl font-black italic text-foreground tracking-tighter">₹{budget?.totalCost?.toLocaleString() || "0"}</h3>
                </div>
                <div className="absolute inset-0 rounded-full border-[14px] border-primary border-t-transparent border-l-transparent rotate-45 shadow-[0_0_40px_rgba(244,63,94,0.3)]" />
             </div>

             <div className="space-y-5">
                <div className="flex justify-between items-center p-6 glass rounded-3xl border-white/5 bg-white/5">
                  <div className="flex items-center gap-4">
                    <Calendar size={20} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/60 italic">Last Updated</span>
                  </div>
                  <span className="text-xs font-black italic text-foreground">{budget ? new Date(budget.updatedAt).toLocaleTimeString() : 'Never'}</span>
                </div>
                <div className="flex justify-between items-center p-6 glass rounded-3xl border-white/5 bg-white/5">
                  <div className="flex items-center gap-4">
                    <TrendingUp size={20} className="text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/60 italic">Cost Tier</span>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${budget?.status === 'Expensive' ? 'text-primary' : 'text-emerald-500'}`}>{budget?.status}</span>
                </div>
             </div>

             <button className="w-full py-6 bg-primary text-white rounded-3xl transition-all font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 italic">
                Export Financial Report
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
