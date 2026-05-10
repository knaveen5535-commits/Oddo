"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Calendar, 
  Settings, 
  Edit3, 
  History,
  Plane,
  Camera,
  Star
} from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    bio: "Adventure seeker and photography enthusiast. I love exploring remote locations and capturing the beauty of nature. Currently planning my next big trip to the Maldives!",
    location: "London, UK",
    joined: "Jan 2024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop"
  };

  const upcomingTrips = [
    { title: "Maldives Escape", date: "June 2026", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=400&auto=format&fit=crop" },
    { title: "Paris Romance", date: "April 2026", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop" },
  ];

  const previousTrips = [
    { title: "Tokyo Adventure", date: "Feb 2026", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&auto=format&fit=crop" },
    { title: "Rome History", date: "Oct 2025", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <div className="p-10 w-full">
      <header className="flex justify-between items-start mb-16">
        <div className="flex gap-12 items-center">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-primary/20 p-2">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full shadow-xl hover:scale-110 transition-all">
              <Camera size={20} />
            </button>
          </div>
          <div className="space-y-4 max-w-lg">
            <div>
              <h1 className="text-4xl font-bold mb-1">{user.name}</h1>
              <div className="flex gap-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {user.location}</span>
                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> Professional Explorer</span>
              </div>
            </div>
            <div className="p-6 glass-card rounded-3xl border-white/10 bg-white/[0.02]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">User Bio</h3>
              <p className="text-white/80 leading-relaxed italic">
                "{user.bio}"
              </p>
            </div>
          </div>
        </div>
        <button className="p-4 glass rounded-2xl border-white/10 hover:bg-white/10 transition-all">
          <Settings size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upcoming Trips - Screen 7 Alignment */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Plane className="text-primary" />
              Upcoming Trips
            </h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {upcomingTrips.map((trip, idx) => (
              <ProfileTripCard key={idx} trip={trip} active />
            ))}
          </div>
        </section>

        {/* Previous Trips - Screen 7 Alignment */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <History className="text-muted-foreground" />
              Previous Trips
            </h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {previousTrips.map((trip, idx) => (
              <ProfileTripCard key={idx} trip={trip} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileTripCard({ trip, active = false }: { trip: any, active?: boolean }) {
  return (
    <motion.div 
      whileHover={{ x: 8 }}
      className="group glass-card rounded-3xl overflow-hidden border-white/5 hover:border-primary/20 transition-all cursor-pointer flex h-36"
    >
      <div className="w-1/3 overflow-hidden">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center">
        <h4 className="text-xl font-bold mb-1">{trip.title}</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">{trip.date}</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            active ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
          }`}>
            {active ? "Upcoming" : "Completed"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
