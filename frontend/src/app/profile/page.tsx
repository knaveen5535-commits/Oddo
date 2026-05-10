"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  History,
  Plane,
  Camera,
  Star,
  Globe,
  Award,
  Compass,
  ArrowRight,
  Heart,
  Share2,
  Edit3
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("expeditions");

  // Fallback for when no user is logged in
  const traveler = {
    name: user?.name || "Guest Explorer",
    handle: user?.email ? `@${user.email.split('@')[0]}` : "@guest_explorer",
    bio: "Adventure seeker and photography enthusiast. I love exploring remote locations and capturing the beauty of nature.",
    location: "Global Hub",
    joined: "Jan 2024",
    avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
    stats: [
      { label: "Voyages", value: "0", icon: <Plane size={18} /> },
      { label: "Countries", value: "0", icon: <Globe size={18} /> },
      { label: "Reviews", value: "0", icon: <Star size={18} /> },
      { label: "Badges", value: "0", icon: <Award size={18} /> },
    ]
  };

  const expeditions = [
    { id: "1", title: "Maldives Escape", date: "June 2026", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=800&auto=format&fit=crop", status: "Active" },
    { id: "2", title: "Paris Romance", date: "April 2026", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", status: "Planning" },
  ];

  const archive = [
    { id: "3", title: "Tokyo Adventure", date: "Feb 2026", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop", status: "Completed" },
    { id: "4", title: "Rome History", date: "Oct 2025", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop", status: "Completed" },
  ];

  return (
    <div className="w-full pb-32 bg-background text-foreground transition-colors duration-300">
      {/* Cinematic Banner */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img src={traveler.banner} alt="Profile Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-44 h-44 rounded-[48px] border-8 border-background p-1 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-background">
                <img src={traveler.avatar} alt={traveler.name} className="w-full h-full object-cover rounded-[40px]" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-4 bg-primary text-white rounded-2xl shadow-xl hover:rotate-12 transition-all border-4 border-background">
                <Camera size={20} />
              </button>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                 <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{traveler.name}</h1>
                 <div className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-black uppercase tracking-widest text-white">PRO</div>
              </div>
              <div className="flex items-center gap-6 text-white/60 font-black uppercase tracking-widest text-xs">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {traveler.location}</span>
                <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> Joined {traveler.joined}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
             <button className="px-8 py-4 glass rounded-2xl border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-3">
               <Edit3 size={18} /> Edit Profile
             </button>
             <button className="p-4 glass rounded-2xl border-white/10 text-white hover:bg-white/10 transition-all">
               <Share2 size={20} />
             </button>
          </div>
        </div>
      </div>

      <div className="p-12 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-8 relative z-10">
        {/* Left Column: Bio & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-card p-10 rounded-[48px] border-foreground/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <Compass size={150} />
            </div>
            <h3 className="text-lg font-black mb-6 uppercase italic tracking-widest text-primary">Explorer Intelligence</h3>
            <p className="text-foreground/60 leading-relaxed font-medium italic text-sm mb-10">
              "{traveler.bio}"
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               {traveler.stats.map((stat, idx) => (
                 <div key={idx} className="p-6 glass rounded-3xl border-foreground/5 group/stat hover:border-primary/20 transition-all">
                    <div className="text-primary mb-3 group-hover/stat:scale-110 transition-transform">{stat.icon}</div>
                    <div className="text-2xl font-black italic">{stat.value}</div>
                    <div className="text-xs font-black uppercase tracking-widest text-foreground/30">{stat.label}</div>
                 </div>
               ))}
            </div>
          </section>

          <section className="p-8 bg-primary text-white rounded-[40px] shadow-2xl shadow-primary/30 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                <Heart size={80} />
             </div>
             <h4 className="text-2xl font-black italic uppercase tracking-tight mb-2">Adventure Ready</h4>
             <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-6 italic">Loyalty Member Since 2024</p>
             <button className="w-full py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                Claim Weekly Rewards
             </button>
          </section>
        </div>

        {/* Right Column: Trips */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex justify-between items-center glass p-4 rounded-[32px] border-foreground/10">
            <div className="flex gap-2">
               <button 
                onClick={() => setActiveTab("expeditions")}
                className={`px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "expeditions" ? "bg-primary text-white shadow-xl shadow-primary/30" : "text-foreground/40 hover:text-foreground"
                }`}
               >
                 Expeditions
               </button>
               <button 
                onClick={() => setActiveTab("archive")}
                className={`px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "archive" ? "bg-primary text-white shadow-xl shadow-primary/30" : "text-foreground/40 hover:text-foreground"
                }`}
               >
                 Archive
               </button>
            </div>
            <div className="pr-6 text-xs font-black uppercase tracking-widest text-foreground/20 italic">
               {activeTab === "expeditions" ? expeditions.length : archive.length} items logged
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="wait">
               <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
               >
                 {(activeTab === "expeditions" ? expeditions : archive).map((trip) => (
                   <motion.div 
                    key={trip.id}
                    whileHover={{ x: 12 }}
                    className="group glass-card rounded-[40px] overflow-hidden border-foreground/5 hover:border-primary/20 transition-all cursor-pointer flex h-48 shadow-2xl relative"
                   >
                      <div className="w-1/3 overflow-hidden relative">
                        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-10 flex-1 flex flex-col justify-center relative">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-3xl font-black italic uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">{trip.title}</h4>
                           <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                             trip.status === "Active" ? "bg-primary/10 text-primary border-primary/20" : "bg-foreground/5 text-foreground/40 border-foreground/10"
                           }`}>
                             {trip.status}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs font-black text-foreground/30 uppercase tracking-[0.2em]">
                             <Calendar size={14} className="text-primary" />
                             {trip.date}
                          </div>
                          <button className="p-4 bg-primary/5 text-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white">
                             <ArrowRight size={20} />
                          </button>
                        </div>
                      </div>
                   </motion.div>
                 ))}
               </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
