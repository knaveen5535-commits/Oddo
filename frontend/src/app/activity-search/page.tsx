"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Star, 
  MapPin, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Camera
} from "lucide-react";

export default function ActivitySearchPage() {
  const activities = [
    { title: "Sunset Catamaran Cruise", location: "Male Atoll", rating: 4.9, reviews: 120, price: "$85", duration: "4 hours", image: "https://images.unsplash.com/photo-1544551763-47a0159f9234?q=80&w=600&auto=format&fit=crop" },
    { title: "Scuba Diving Adventure", location: "Baa Atoll", rating: 5.0, reviews: 85, price: "$150", duration: "6 hours", image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=600&auto=format&fit=crop" },
    { title: "Local Island Food Tour", location: "Maafushi", rating: 4.8, reviews: 210, price: "$45", duration: "3 hours", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop" },
    { title: "Sandbank Picnic", location: "North Male Atoll", rating: 4.7, reviews: 156, price: "$120", duration: "5 hours", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <div className="p-10 w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Explore Activities</h1>
        <p className="text-muted-foreground">Find the best things to do in your destination.</p>
      </header>

      {/* Search & Actions - Screen 8 Alignment */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search activities, tours, experiences..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-4 glass border-white/10 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all text-sm font-bold">
            <ArrowUpDown size={20} />
            Sort by
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activities.map((activity, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-3xl overflow-hidden border-white/5 hover:border-primary/20 transition-all cursor-pointer flex flex-col md:flex-row h-auto md:h-52"
          >
            <div className="w-full md:w-64 h-48 md:h-full overflow-hidden shrink-0">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-1">
                    <TrendingUp size={12} /> Featured Experience
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{activity.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {activity.location}</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {activity.rating} ({activity.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{activity.price}</div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full"><Clock size={14} /> {activity.duration}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full"><Camera size={14} /> Photo friendly</span>
                </div>
                <button className="p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
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
