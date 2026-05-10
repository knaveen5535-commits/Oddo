"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Wallet, 
  Plus, 
  Search, 
  ChevronRight,
  TrendingUp,
  Clock,
  Filter,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Banner Section - Screen 3 Alignment */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop" 
            alt="Adventure Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-black text-white tracking-tighter uppercase italic"
            >
              Start Your Journey
            </motion.h2>
          </div>
        </div>

        <div className="p-8">
          {/* Search & Filter Bar */}
          <div className="flex gap-4 mb-12 -mt-16 relative z-20">
            <div className="flex-1 glass-card p-2 rounded-2xl flex items-center gap-3 shadow-2xl">
              <div className="pl-3">
                <Search className="text-muted-foreground" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Where to next? Search cities, activities..."
                className="flex-1 bg-transparent border-none outline-none text-white font-medium py-3"
              />
              <button className="bg-primary/20 p-3 rounded-xl text-primary hover:bg-primary/30 transition-all">
                <Filter size={20} />
              </button>
              <button className="bg-primary px-6 py-3 rounded-xl text-white font-bold hover:bg-primary/90 transition-all">
                Search
              </button>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Upcoming Trip Card */}
            <motion.div variants={item} className="lg:col-span-2 relative group overflow-hidden rounded-3xl glass-card border-white/10 h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=1200&auto=format&fit=crop" 
                alt="Maldives" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex justify-between items-end">
                <div>
                  <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-3 inline-block">
                    Upcoming Adventure
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-1">Maldives Escape</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1"><Calendar size={14} /> June 15, 2026</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> Maldives</span>
                  </div>
                </div>
                <Link href="/trips/1/itinerary">
                  <button className="p-4 glass rounded-full text-white hover:bg-primary transition-all shadow-xl">
                    <ChevronRight size={24} />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Stats/Budget Widget */}
            <motion.div variants={item} className="glass-card rounded-3xl p-6 border-white/10 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-teal-500/10 rounded-2xl">
                  <Wallet className="text-teal-400" />
                </div>
                <span className="text-teal-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={14} /> +12%
                </span>
              </div>
              <h4 className="text-muted-foreground font-medium mb-1 uppercase tracking-widest text-[10px]">Total Expenses</h4>
              <div className="text-4xl font-bold mb-4">$3,450.00</div>
              <div className="mt-auto space-y-4">
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full w-[69%]" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>69% of $5,000 budget</span>
                  <Link href="/trips/1/budget" className="text-primary hover:underline">Details</Link>
                </div>
              </div>
            </motion.div>

            {/* Quick Destinations */}
            <motion.div variants={item} className="glass-card rounded-3xl p-6 border-white/10 flex flex-col">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Places
              </h4>
              <div className="space-y-5">
                <RecentDestItem city="Paris, France" date="April 2026" />
                <RecentDestItem city="Tokyo, Japan" date="Feb 2026" />
                <RecentDestItem city="New York, USA" date="Dec 2025" />
              </div>
            </motion.div>

            {/* Trip Checklist */}
            <motion.div variants={item} className="lg:col-span-2 glass-card rounded-3xl p-6 border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold">Trip Checklist</h4>
                <button className="text-sm text-primary hover:underline">View Itinerary</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ChecklistItem label="Confirm flight to Male" checked={true} />
                <ChecklistItem label="Passport renewal check" checked={false} />
                <ChecklistItem label="Exchange local currency" checked={false} />
                <ChecklistItem label="Pack snorkeling gear" checked={false} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function RecentDestItem({ city, date }: { city: string, date: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all border border-white/5">
        <MapPin size={20} className="text-muted-foreground group-hover:text-primary" />
      </div>
      <div>
        <div className="font-bold text-sm group-hover:text-primary transition-colors">{city}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{date}</div>
      </div>
      <ChevronRight size={16} className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
    </div>
  );
}

function ChecklistItem({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl glass border border-white/5 ${checked ? "opacity-50" : ""}`}>
      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
        checked ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-white/10"
      }`}>
        {checked && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
      </div>
      <span className={`text-sm font-medium ${checked ? "line-through" : ""}`}>{label}</span>
    </div>
  );
}
