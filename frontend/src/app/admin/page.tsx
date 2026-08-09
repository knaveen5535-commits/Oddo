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
  PieChart,
  Activity,
  Calendar,
  Download,
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    { label: "Total users", value: "12,450", change: "+15%", up: true, icon: <Users size={19} />, tone: "bg-primary/10 text-primary" },
    { label: "Active trips", value: "3,890", change: "+12%", up: true, icon: <Map size={19} />, tone: "bg-blue-500/10 text-blue-500" },
    { label: "Revenue", value: "₹45,200", change: "+8%", up: true, icon: <DollarSign size={19} />, tone: "bg-emerald-500/10 text-emerald-500" },
    { label: "Reports", value: "24", change: "-5%", up: false, icon: <ShieldAlert size={19} />, tone: "bg-danger/10 text-danger" },
  ];

  const recentActivity = [
    { user: "John Smith", action: "Created a new trip to Maldives", time: "2 mins ago", type: "Trip", initial: "JS" },
    { user: "Sarah Connor", action: "Updated budget for Paris trip", time: "15 mins ago", type: "Budget", initial: "SC" },
    { user: "Bruce Wayne", action: "Added a new note to Gotham trip", time: "1 hour ago", type: "Note", initial: "BW" },
    { user: "Clark Kent", action: "Joined Traveloop family", time: "3 hours ago", type: "Join", initial: "CK" },
  ];

  const chartData = [
    { label: "Jan", value: 40 },
    { label: "Feb", value: 70 },
    { label: "Mar", value: 45 },
    { label: "Apr", value: 90 },
    { label: "May", value: 65 },
    { label: "Jun", value: 80 },
    { label: "Jul", value: 55 },
    { label: "Aug", value: 100 },
    { label: "Sep", value: 75 },
    { label: "Oct", value: 85 },
    { label: "Nov", value: 60 },
    { label: "Dec", value: 95 },
  ];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Console</h1>
          <p className="page-subtitle">Monitoring platform health and growth.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder="Search data..." className="input pl-10" />
          </div>
          <button className="btn btn-primary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="card card-pad card-hover"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.tone}`}>
                {stat.icon}
              </div>
              <span
                className={`badge ${stat.up ? "badge-success" : "badge-danger"}`}
              >
                {stat.change}
              </span>
            </div>
            <div className="stat-label mb-1">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <section className="card card-pad">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Growth overview</h3>
            <p className="text-sm text-muted-foreground">User acquisition and engagement over time.</p>
          </div>
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Monthly
            </button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-card text-foreground shadow-sm">
              Weekly
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2 sm:gap-3 h-52 pb-2">
          {chartData.map((d, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${d.value}%` }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              className={`flex-1 rounded-t-lg relative group ${
                i === 7 ? "bg-primary shadow-lg shadow-primary/30" : "bg-primary/15 group-hover:bg-primary/30 transition-colors"
              }`}
            >
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 rounded-md text-[10px] font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {d.value * 124}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-4 pt-4 border-t border-border">
          {chartData.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-border">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Recent system activity
            </h3>
            <button className="text-sm font-medium text-primary hover:underline cursor-pointer">
              Full audit log
            </button>
          </div>
          <div className="p-3 divide-y divide-border">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center justify-between gap-4 p-3 hover:bg-accent/60 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="avatar w-10 h-10 text-sm shrink-0">{activity.initial}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{activity.user}</div>
                    <div className="text-xs text-muted-foreground truncate">{activity.action}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-0.5">
                    {activity.type}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                    <Calendar size={10} />
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Usage */}
        <div className="space-y-5">
          <section className="card card-pad tint">
            <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
              <PieChart size={18} className="text-primary" />
              Usage stats
            </h3>
            <div className="space-y-6">
              <UsageProgress label="Storage used" value={64} tone="bg-primary" />
              <UsageProgress label="API requests" value={82} tone="bg-blue-500" />
              <UsageProgress label="Active sessions" value={45} tone="bg-emerald-500" />
            </div>
          </section>

          <section className="card card-pad bg-gradient-to-br from-primary to-secondary border-0 text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 opacity-20 pointer-events-none">
              <TrendingUp size={110} />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <ArrowUpRight size={16} />
              Platform is healthy
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              All systems operational. No incidents reported in the last 24 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function UsageProgress({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${tone} rounded-full`}
        />
      </div>
    </div>
  );
}
