"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Plus, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  FileEdit 
} from "lucide-react";
import Link from "next/link";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const trips = {
    Upcoming: [
      { id: "1", title: "Maldives Summer Escape", location: "Maldives", dates: "June 15 - 22, 2026", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=800&auto=format&fit=crop", status: "Active" },
      { id: "2", title: "Paris Romance", location: "Paris, France", dates: "April 10 - 15, 2026", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", status: "Planning" },
    ],
    Draft: [
      { id: "4", title: "Weekend in London", location: "London, UK", dates: "Pending", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop", status: "Draft" },
    ],
    Past: [
      { id: "3", title: "Tokyo Explorer", location: "Tokyo, Japan", dates: "Feb 12 - 20, 2026", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop", status: "Completed" },
    ]
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Trips</h1>
          <p className="text-muted-foreground">Manage and organize all your travel adventures.</p>
        </div>
        <Link href="/trips/create">
          <button className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold">
            <Plus size={20} />
            Start New Trip
          </button>
        </Link>
      </header>

      {/* Tabs - Screen 6 Alignment */}
      <div className="flex gap-8 border-b border-white/5 mb-10">
        {["Draft", "Upcoming", "Past"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder={`Search your ${activeTab.toLowerCase()} trips...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trips[activeTab as keyof typeof trips].map((trip, idx) => (
          <motion.div 
            key={trip.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-[32px] overflow-hidden border-white/5 hover:border-white/20 transition-all flex flex-col h-[400px]"
          >
            <div className="h-1/2 relative overflow-hidden">
              <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border backdrop-blur-md ${
                  trip.status === "Active" ? "bg-teal-500/20 text-teal-400 border-teal-500/30" : 
                  trip.status === "Draft" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : 
                  "bg-white/10 text-white/80 border-white/10"
                }`}>
                  {trip.status}
                </span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{trip.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                    <MapPin size={14} className="text-primary" />
                    {trip.location}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-8">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {trip.dates}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> 7 Days</span>
              </div>

              <div className="mt-auto flex gap-4">
                <Link href={`/trips/${trip.id}/itinerary`} className="flex-1">
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    {trip.status === "Draft" ? <FileEdit size={18} /> : <CheckCircle2 size={18} />}
                    {trip.status === "Draft" ? "Edit Draft" : "View Details"}
                  </button>
                </Link>
                <button className="p-3 glass rounded-xl border-white/10 hover:bg-primary hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
