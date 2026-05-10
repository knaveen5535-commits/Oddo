"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Plus, Filter, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TripsPage() {
  const trips = [
    { id: "1", title: "Maldives Summer Escape", location: "Maldives", dates: "June 15 - 22, 2026", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=800&auto=format&fit=crop" },
    { id: "2", title: "Paris Romance", location: "Paris, France", dates: "April 10 - 15, 2026", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
    { id: "3", title: "Tokyo Explorer", location: "Tokyo, Japan", dates: "Feb 12 - 20, 2026", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-muted-foreground">Manage and explore your planned adventures.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-semibold">
          <Plus size={20} />
          Create New Trip
        </button>
      </header>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search your trips..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button className="px-4 py-3 glass border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip, idx) => (
          <motion.div 
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-3xl overflow-hidden border-white/10 flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={trip.image} 
                alt={trip.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                Active
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin size={16} className="text-primary" />
                  {trip.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar size={16} className="text-primary" />
                  {trip.dates}
                </div>
              </div>
              <Link 
                href={`/trips/${trip.id}/itinerary`}
                className="mt-auto w-full py-3 glass border-white/10 rounded-xl flex items-center justify-center gap-2 group/btn hover:bg-primary hover:text-white hover:border-primary transition-all font-medium"
              >
                View Itinerary
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
