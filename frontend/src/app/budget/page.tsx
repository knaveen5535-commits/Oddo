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

export default function BudgetPage() {
  const [selectedTripId, setSelectedTripId] = useState("1");
  const { budget, loading, error, refresh } = useBudget(selectedTripId);
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/trips')
      .then(res => res.json())
      .then(result => {
        if (result.success) setTrips(result.data);
      });
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

  if (loading && !budget) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Calculating Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full space-y-12 bg-background text-foreground transition-colors duration-300 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tight uppercase italic mb-2">Finance <span className="text-primary drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">Control</span></h1>
          <p className="text-muted-foreground font-medium italic">Dynamic budget intelligence for your global expeditions.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-6 py-4 glass rounded-2xl border-foreground/10 bg-transparent text-foreground font-black uppercase tracking-widest text-xs focus:outline-none focus:ring-2 ring-primary/20"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id} className="bg-background text-foreground">{t.title}</option>
            ))}
          </select>
          <button onClick={refresh} className="p-4 glass rounded-2xl border-foreground/10 hover:bg-foreground/5 transition-all text-foreground">
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-[40px] border-foreground/5 shadow-2xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity`} />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.color}/10 text-foreground border border-foreground/5`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-black uppercase tracking-widest px-3 py-1 rounded-full ${stat.color}/10 ${stat.color.replace('bg-', 'text-')}`}>
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-black uppercase tracking-widest">{stat.label}</p>
              <h2 className="text-4xl font-black italic">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Expenditure Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase italic text-foreground">Expenditure Breakdown</h2>
              <p className="text-muted-foreground text-sm italic">Scientific distribution of costs across categories.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {breakdownItems.map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-6 glass-card rounded-[32px] border-foreground/5 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${item.color}/10 flex items-center justify-center ${item.color.replace('bg-', 'text-')} border border-foreground/5`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm text-muted-foreground">{item.label}</h3>
                    <p className="text-xl font-black italic">₹{item.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / (budget?.totalCost || 1)) * 100}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {budget?.status === 'Expensive' && (
            <div className="p-8 bg-primary/5 border border-primary/20 rounded-[32px] flex items-center gap-6">
              <div className="p-4 bg-primary text-white rounded-2xl animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic text-primary">Budget Alert: High Intensity</h3>
                <p className="text-sm text-muted-foreground italic">Your current plan for {trips.find(t => t.id === selectedTripId)?.location} is exceeding standard moderate limits. Consider optimizing activities.</p>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Summary */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black tracking-tight uppercase italic text-foreground">Intelligence Summary</h2>
          <div className="glass-card p-10 rounded-[48px] border-foreground/5 shadow-2xl space-y-10 relative overflow-hidden">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px]" />
             
             <div className="relative aspect-square rounded-full border-[20px] border-foreground/5 flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Payload</p>
                  <h3 className="text-4xl font-black italic">₹{budget?.totalCost.toLocaleString()}</h3>
                </div>
                <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-l-transparent rotate-45 shadow-[0_0_30px_rgba(244,63,94,0.3)]" />
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 glass rounded-2xl border-foreground/5">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Last Updated</span>
                  </div>
                  <span className="text-xs font-medium italic opacity-60">{budget ? new Date(budget.updatedAt).toLocaleTimeString() : 'Never'}</span>
                </div>
                <div className="flex justify-between items-center p-4 glass rounded-2xl border-foreground/5">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-widest">Cost Tier</span>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${budget?.status === 'Expensive' ? 'text-primary' : 'text-emerald-500'}`}>{budget?.status}</span>
                </div>
             </div>

             <button className="w-full py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 shadow-xl">
                Export Financial Report
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
