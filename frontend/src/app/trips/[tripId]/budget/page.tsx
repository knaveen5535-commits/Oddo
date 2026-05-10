"use client";

import React from "react";
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
  DollarSign
} from "lucide-react";

export default function BudgetPage() {
  const expenses = [
    { title: "Flight to Male", category: "Transport", amount: 1200, date: "May 12", type: "expense" },
    { title: "Sun Siyam Resort", category: "Accommodation", amount: 2500, date: "May 15", type: "expense" },
    { title: "Diving Course", category: "Activity", amount: 450, date: "May 18", type: "expense" },
    { title: "Travel Insurance Refund", category: "Misc", amount: 120, date: "May 20", type: "income" },
  ];

  const categories = [
    { name: "Accommodation", spent: 2500, total: 3000, color: "bg-blue-500" },
    { name: "Transport", spent: 1200, total: 1500, color: "bg-purple-500" },
    { name: "Food", spent: 300, total: 800, color: "bg-teal-500" },
    { name: "Activities", spent: 450, total: 1000, color: "bg-orange-500" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trip Budget</h1>
          <p className="text-muted-foreground">Manage your expenses for the Maldives trip.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold">
          <Plus size={20} />
          Add Expense
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Total Budget Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-3xl border-white/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} />
          </div>
          <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">Total Spent</h4>
          <div className="text-4xl font-bold mb-6">$4,450.00</div>
          <div className="flex items-center gap-2 text-teal-400 text-sm font-medium">
            <TrendingUp size={16} /> 69% of $6,500
          </div>
        </motion.div>

        {/* Expenses Summary */}
        <div className="md:col-span-2 glass-card p-8 rounded-3xl border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">Category Breakdown</h3>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <div className="w-3 h-3 rounded-full bg-teal-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted-foreground">${cat.spent} / ${cat.total}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.spent / cat.total) * 100}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${cat.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <CreditCard className="text-primary" />
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {expenses.map((expense, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-5 rounded-2xl border-white/5 flex items-center justify-between group hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    expense.type === 'income' ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {expense.type === 'income' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold">{expense.title}</h4>
                    <p className="text-xs text-muted-foreground">{expense.category} • {expense.date}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${expense.type === 'income' ? 'text-teal-400' : 'text-white'}`}>
                  {expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Analytics Mini Widget - Screen 12 Alignment */}
        <div className="space-y-8">
          <section className="glass-card p-6 rounded-3xl border-white/10">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
              <PieChart size={16} className="text-primary" />
              Quick Stats
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Daily Average</div>
                  <div className="text-2xl font-bold">$124.50</div>
                </div>
                <div className="h-10 w-24 flex items-end gap-1 pb-1">
                  <div className="bg-primary/20 w-3 h-[40%] rounded-sm" />
                  <div className="bg-primary/20 w-3 h-[60%] rounded-sm" />
                  <div className="bg-primary/20 w-3 h-[50%] rounded-sm" />
                  <div className="bg-primary/20 w-3 h-[80%] rounded-sm" />
                  <div className="bg-primary w-3 h-[90%] rounded-sm" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Highest Expense</span>
                  <span className="font-bold text-red-400">Accommodation</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Remaining</span>
                  <span className="font-bold text-teal-400">$2,050.00</span>
                </div>
              </div>
            </div>
          </section>

          <button className="w-full py-4 glass border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-sm">
            <BarChart3 size={20} />
            View Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
