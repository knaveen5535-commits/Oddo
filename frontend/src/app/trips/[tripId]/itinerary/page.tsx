"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  ChevronRight, 
  MoreVertical,
  Navigation,
  Info
} from "lucide-react";

export default function ItineraryPage() {
  const tripDetails = {
    title: "Maldives Summer Escape",
    location: "Maldives",
    startDate: "June 15, 2026",
    endDate: "June 22, 2026",
    banner: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=2000&auto=format&fit=crop",
    summary: "A week-long tropical getaway featuring diving, island hopping, and relaxation at a luxury resort."
  };

  const activities = [
    { time: "09:00 AM", title: "Arrival at Velana International Airport", location: "Male", type: "Transport" },
    { time: "11:30 AM", title: "Speedboat Transfer to Resort", location: "Maafushi", type: "Transport" },
    { time: "01:00 PM", title: "Check-in & Lunch", location: "Sun Siyam Iru Fushi", type: "Leisure" },
    { time: "04:00 PM", title: "Sunset Beach Walk", location: "Resort Beach", type: "Activity" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div className="relative h-[350px] w-full">
        <img 
          src={tripDetails.banner} 
          alt={tripDetails.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full max-w-5xl mx-auto right-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tripDetails.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <span className="flex items-center gap-2 glass px-4 py-2 rounded-full border-white/10">
                <MapPin size={16} className="text-primary" />
                {tripDetails.location}
              </span>
              <span className="flex items-center gap-2 glass px-4 py-2 rounded-full border-white/10">
                <Calendar size={16} className="text-primary" />
                {tripDetails.startDate} - {tripDetails.endDate}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Summary & Details */}
        <div className="lg:col-span-1 space-y-8">
          <section className="glass-card p-6 rounded-3xl border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Trip Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {tripDetails.summary}
            </p>
          </section>

          <button className="w-full py-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
            <Plus size={20} />
            Add New Activity
          </button>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Daily Schedule</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass rounded-xl text-sm border-white/10 hover:bg-white/5 transition-all">Day 1</button>
              <button className="px-4 py-2 glass rounded-xl text-sm border-white/10 hover:bg-white/5 transition-all opacity-50">Day 2</button>
              <button className="px-4 py-2 glass rounded-xl text-sm border-white/10 hover:bg-white/5 transition-all opacity-50">Day 3</button>
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
            {activities.map((activity, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-12 group"
              >
                <div className="absolute left-0 top-1 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="glass-card p-5 rounded-2xl border-white/5 group-hover:border-white/20 transition-all flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="text-xs font-bold text-primary w-16">
                      {activity.time}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{activity.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {activity.location}</span>
                        <span className="flex items-center gap-1 font-medium px-2 py-0.5 bg-white/5 rounded text-white/80">{activity.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
