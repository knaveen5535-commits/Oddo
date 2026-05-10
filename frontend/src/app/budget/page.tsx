"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Target,
  Plus
} from "lucide-react";

export default function GlobalBudgetPage() {
  const stats = [
    { label: "Total Budget", value: "₹12,500", change: "+12%", trend: "up", icon: <Wallet size={24} />, color: "bg-rose-500/10 text-rose-400" },
    { label: "Total Spent", value: "₹8,240", change: "+5%", trend: "up", icon: <TrendingDown size={24} />, color: "bg-red-500/10 text-red-400" },
    { label: "Savings", value: "₹4,260", change: "+8%", trend: "up", icon: <Target size={24} />, color: "bg-slate-500/10 text-slate-400" },
  ];

  const categories = [
    { name: "Flights", spent: 4200, total: 5000, color: "bg-slate-500" },
    { name: "Accommodation", spent: 2800, total: 4000, color: "bg-rose-500" },
    { name: "Food & Dining", spent: 840, total: 2000, color: "bg-rose-500" },
    { name: "Activities", spent: 400, total: 1500, color: "bg-slate-500" },
  ];

  const recentTransactions = [
    { title: "Emirates Flight", category: "Transport", amount: 1200, date: "2 hours ago", type: "expense" },
    { title: "Marriott Hotel", category: "Accommodation", amount: 450, date: "Yesterday", type: "expense" },
    { title: "Trip Deposit", category: "Income", amount: 2000, date: "3 days ago", type: "income" },
    { title: "Street Food Tour", category: "Food", amount: 85, date: "May 08", type: "expense" },
  ];

  return (
    <div className="p-10 w-full space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground text-lg">Track your spending across all your world adventures.</p>
        </div>
        <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-[0_15px_30px_rgba(244,63,94,0.3)] flex items-center gap-3 hover:scale-105 transition-all">
          <Plus size={20} />
          Add Transaction
        </button>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-[32px] border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>
                {stat.icon}
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full bg-white/5 border border-white/10 ${stat.trend === 'up' ? 'text-slate-400' : 'text-red-400'}`}>
                {stat.change}
              </div>
            </div>
            <div className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-1">{stat.label}</div>
            <div className="text-4xl font-black">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* Spending Analysis */}
          <section className="glass-card p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold tracking-tight">Spending Analysis</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 glass border-white/10 rounded-xl text-xs font-bold hover:bg-white/5 transition-all">Monthly</button>
                <button className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-bold">Yearly</button>
              </div>
            </div>

            <div className="space-y-8">
              {categories.map((cat, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="font-bold">{cat.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="text-white font-bold">₹{cat.spent}</span> / ₹{cat.total}
                    </div>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.spent / cat.total) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${cat.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Log */}
          <section className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="text-primary" />
              Activity Log
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {recentTransactions.map((tx, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="glass-card p-6 rounded-3xl border-white/5 flex items-center justify-between hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      tx.type === 'income' ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tx.type === 'income' ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{tx.title}</h4>
                      <p className="text-sm text-muted-foreground">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <div className={`text-xl font-black ${tx.type === 'income' ? 'text-slate-400' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-12">
          {/* Quick Stats */}
          <section className="glass-card p-8 rounded-[40px] border-white/5 bg-white/[0.01]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 flex items-center gap-2">
              <PieChart size={16} />
              Distribution
            </h3>
            
            <div className="flex justify-center mb-10">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Simulated Donut Chart */}
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-500/20" />
                <div className="absolute inset-0 rounded-full border-[12px] border-rose-500 border-l-transparent border-b-transparent rotate-45" />
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-500 border-t-transparent border-r-transparent -rotate-45" />
                <div className="text-center">
                  <div className="text-3xl font-black">₹8.2k</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Spent</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-slate-500" /> Flights
                </span>
                <span className="font-bold">52%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Hotels
                </span>
                <span className="font-bold">34%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-slate-500" /> Food
                </span>
                <span className="font-bold">14%</span>
              </div>
            </div>
          </section>

          {/* Savings Goal */}
          <section className="glass-card p-8 rounded-[40px] border-white/5 bg-primary/5 group">
            <h3 className="font-bold mb-4">Summer Vacation Goal</h3>
            <div className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">₹2,400 / ₹5,000</div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
              <div className="w-[48%] h-full bg-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You're halfway there! Keep saving to reach your goal for the next trip to Maldives.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
