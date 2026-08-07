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
  MoreHorizontal,
  PieChart,
  Activity,
  Calendar
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    { label: "Total Users", value: "12,450", change: "+15%", icon: <Users size={20} />, color: "bg-rose-500" },
    { label: "Active Trips", value: "3,890", change: "+12%", icon: <Map size={20} />, color: "bg-slate-500" },
    { label: "Revenue", value: "₹45,200", change: "+8%", icon: <DollarSign size={20} />, color: "bg-slate-500" },
    { label: "Reports", value: "24", change: "-5%", icon: <ShieldAlert size={20} />, color: "bg-red-500" },
  ];

  const recentActivity = [
    { user: "John Smith", action: "Created a new trip to Maldives", time: "2 mins ago", type: "Trip" },
    { user: "Sarah Connor", action: "Updated budget for Paris trip", time: "15 mins ago", type: "Budget" },
    { user: "Bruce Wayne", action: "Added a new note to Gotham trip", time: "1 hour ago", type: "Note" },
    { user: "Clark Kent", action: "Joined Traveloop family", time: "3 hours ago", type: "Join" },
  ];

  return (
    <div className="p-10 w-full space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground text-sm font-medium">Monitoring platform health and growth.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search data..."
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-xs font-medium w-64"
            />
          </div>
          <button className="bg-primary px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
            <Activity size={14} />
            Live View
          </button>
        </div>
      </header>

      {/* Top Stats - Screen 13 Alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-3xl border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className={`absolute -top-4 -right-4 w-20 h-20 ${stat.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color.replace('bg-', 'text-')}`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith('+') ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h4 className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</h4>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics View - Screen 13 Alignment */}
      <section className="glass-card p-10 rounded-[40px] border-white/5 h-[450px] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-bold mb-1">Growth Overview</h3>
            <p className="text-muted-foreground text-sm font-medium">User acquisition and engagement over time.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 glass rounded-xl text-[10px] font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all">Monthly</button>
            <button className="px-4 py-2 glass rounded-xl text-[10px] font-bold uppercase tracking-widest border-white/10 bg-primary/20 text-primary transition-all">Weekly</button>
          </div>
        </div>
        <div className="flex-1 flex items-end gap-3 pb-4 relative z-10">
          {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 1 }}
              className={`flex-1 rounded-t-xl relative group ${i === 7 ? 'bg-primary shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-white/5'}`}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {h * 124}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-4 border-t border-white/5 pt-4">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </section>

      {/* Bottom Activity - Screen 13 Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-[32px] border-white/5 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary" size={20} />
              Recent System Activity
            </h3>
            <button className="text-xs font-bold text-primary hover:underline">Full Audit Log</button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-foreground/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{activity.user}</div>
                    <div className="text-xs text-muted-foreground">{activity.action}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{activity.type}</div>
                  <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 justify-end">
                    <Calendar size={10} /> {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[32px] border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/60">
              <PieChart size={18} className="text-primary" />
              Usage Stats
            </h3>
            <div className="space-y-6">
              <UsageProgress label="Storage Used" value={64} color="bg-rose-500" />
              <UsageProgress label="API Requests" value={82} color="bg-slate-500" />
              <UsageProgress label="Active Sessions" value={45} color="bg-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-foreground/60">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
