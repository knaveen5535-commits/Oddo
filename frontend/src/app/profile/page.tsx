"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Calendar, 
  Settings, 
  Edit3, 
  Map, 
  History,
  Plane
} from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    bio: "Passionate traveler and photographer. Exploring the hidden gems of the world one city at a time. Always looking for the next adventure!",
    location: "London, UK",
    joined: "January 2024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
  };

  const upcomingTrips = [
    { title: "Maldives Escape", date: "June 2026", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=200&auto=format&fit=crop" },
    { title: "Paris Romance", date: "April 2026", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=200&auto=format&fit=crop" },
  ];

  const pastTrips = [
    { title: "Tokyo Adventure", date: "Feb 2026", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=200&auto=format&fit=crop" },
    { title: "NYC Explorer", date: "Dec 2025", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=200&auto=format&fit=crop" },
    { title: "Rome History", date: "Oct 2025", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&auto=format&fit=crop" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-12">
        <div className="flex gap-8 items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all scale-90 group-hover:scale-100">
              <Edit3 size={18} />
            </button>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Joined {user.joined}</span>
            </div>
            <p className="max-w-md text-muted-foreground leading-relaxed">
              {user.bio}
            </p>
          </div>
        </div>
        <button className="p-3 glass rounded-2xl border-white/10 hover:bg-white/10 transition-all">
          <Settings size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upcoming Trips */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Plane className="text-primary" />
              Upcoming Trips
            </h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {upcomingTrips.map((trip, idx) => (
              <TripListItem key={idx} trip={trip} active />
            ))}
          </div>
        </section>

        {/* Past Trips */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <History className="text-muted-foreground" />
              Past Adventures
            </h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {pastTrips.map((trip, idx) => (
              <TripListItem key={idx} trip={trip} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TripListItem({ trip, active = false }: { trip: any, active?: boolean }) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="glass-card p-4 rounded-2xl border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center gap-4 group"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold">{trip.title}</h4>
        <p className="text-xs text-muted-foreground">{trip.date}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        active ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-muted-foreground border border-white/10"
      }`}>
        {active ? "Upcoming" : "Completed"}
      </div>
    </motion.div>
  );
}
