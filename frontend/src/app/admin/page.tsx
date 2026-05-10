"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Map, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  ArrowUpRight,
  Search,
  MoreHorizontal
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    { label: "Total Users", value: "12,450", change: "+15%", icon: <Users size={24} />, color: "bg-blue-500" },
    { label: "Active Trips", value: "3,890", change: "+12%", icon: <Map size={24} />, color: "bg-teal-500" },
    { label: "Revenue", value: "$45,200", change: "+8%", icon: <DollarSign size={24} />, color: "bg-purple-500" },
    { label: "Reports", value: "24", change: "-5%", icon: <ShieldAlert size={24} />, color: "bg-red-500" },
  ];

  const recentUsers = [
    { name: "John Smith", email: "john@example.com", status: "Active", date: "2 mins ago" },
    { name: "Sarah Connor", email: "sarah@resistance.org", status: "Inactive", date: "15 mins ago" },
    { name: "Bruce Wayne", email: "bruce@waynecorp.com", status: "Active", date: "1 hour ago" },
    { name: "Clark Kent", email: "clark@dailyplanet.com", status: "Pending", date: "3 hours ago" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the Traveloop platform and users.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Quick search..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>
          <button className="bg-primary px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg shadow-primary/20">
            Export Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-3xl border-white/5 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 -translate-y-8 translate-x-8 rounded-full`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color.replace('bg-', 'text-')}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith('+') ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h4>
            <div className="text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">Recent User Activity</h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-white/5 uppercase tracking-widest">
                  <th className="p-6">User</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Date</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                        user.status === 'Active' ? 'bg-teal-500/10 text-teal-400' : 
                        user.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-white/10 text-muted-foreground'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-6 text-xs text-muted-foreground">{user.date}</td>
                    <td className="p-6">
                      <button className="text-muted-foreground hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Alerts */}
        <div className="glass-card p-6 rounded-3xl border-white/5">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-400" />
            Platform Alerts
          </h3>
          <div className="space-y-4">
            <AlertItem title="API Limit Warning" desc="Gemini API reaching 85% limit." type="warning" />
            <AlertItem title="Failed Backup" desc="Daily database backup failed at 02:00." type="error" />
            <AlertItem title="New Feature Rollout" desc="Analytics v2 is now live for all users." type="info" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ title, desc, type }: { title: string, desc: string, type: 'warning' | 'error' | 'info' }) {
  const styles = {
    warning: "border-orange-500/20 bg-orange-500/5 text-orange-400",
    error: "border-red-500/20 bg-red-500/5 text-red-400",
    info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
  };

  return (
    <div className={`p-4 rounded-2xl border ${styles[type]}`}>
      <h4 className="font-bold text-xs mb-1 uppercase tracking-widest">{title}</h4>
      <p className="text-xs opacity-80">{desc}</p>
    </div>
  );
}
