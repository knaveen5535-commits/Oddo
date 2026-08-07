"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Plus, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  FileEdit,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      const result = response.data;
      if (result.success) {
        setTrips(result.data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter((trip: any) => {
    if (activeTab === "Upcoming") return trip.status === "Upcoming" || trip.status === "Active";
    return trip.status === activeTab;
  });

  const getFallbackImage = (title: string) => {
    const fallbacks = [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da", // Agra
      "https://images.unsplash.com/photo-1548013146-72479768bbaa", // Taj
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3", // Bhutan
      "https://images.unsplash.com/photo-1528127269322-539801943592", // Vietnam
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", // Thailand
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", // Mountain
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", // Maldives
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4", // Bali
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62", // London
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"  // Dining
    ];
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `${fallbacks[hash % fallbacks.length]}?q=80&w=1200&auto=format&fit=crop`;
  };

  return (
    <div className="p-10 w-full space-y-10 bg-background text-foreground min-h-screen transition-colors duration-300">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2 uppercase italic">Your Voyages</h1>
          <p className="text-muted-foreground font-medium italic">Manage and organize your curated travel adventures.</p>
        </div>
        <Link href="/city-search">
          <button className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[24px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-widest text-xs">
            <Plus size={20} />
            Launch New Trip
          </button>
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-foreground/5 mb-10 overflow-x-auto scrollbar-hide">
        {["Upcoming", "Draft", "Past"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-5 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-10">
        <div className="flex-1 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[24px] blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder={`Search your ${activeTab.toLowerCase()} trips...`}
            className="w-full bg-foreground/5 border border-foreground/10 rounded-[24px] py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black text-xs uppercase tracking-widest placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] animate-pulse">Syncing Hangar Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip, idx) => (
                <motion.div 
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group glass-card rounded-[48px] overflow-hidden border-foreground/5 hover:border-primary/20 transition-all flex flex-col h-[450px] shadow-2xl"
                >
                  <div className="h-1/2 relative overflow-hidden bg-foreground/5">
                    <img 
                      src={trip.image || getFallbackImage(trip.title)} 
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(trip.title);
                      }}
                      alt={trip.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-8 right-8">
                      <span className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-xl ${
                        trip.status === "Active" || trip.status === "Upcoming" ? "bg-primary/20 text-primary border-primary/30" : 
                        trip.status === "Draft" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : 
                        "bg-white/10 text-foreground/80 border-white/10"
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-black mb-2 italic uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{trip.title}</h3>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs font-black uppercase tracking-widest mb-6">
                        <MapPin size={16} className="text-primary" />
                        {trip.location}
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-2 px-3 py-1 glass rounded-lg"><Calendar size={14} className="text-primary" /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2 px-3 py-1 glass rounded-lg"><Clock size={14} className="text-primary" /> 7 Days Voyage</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex gap-4">
                      <Link href={`/trips/${trip.id}/itinerary`} className="flex-1">
                        <button className="w-full py-5 glass border-foreground/5 hover:bg-primary hover:text-white hover:border-primary transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 rounded-2xl group/btn">
                          {trip.status === "Draft" ? <FileEdit size={18} className="group-hover/btn:rotate-12 transition-transform" /> : <CheckCircle2 size={18} className="group-hover/btn:scale-125 transition-transform" />}
                          {trip.status === "Draft" ? "Resume Build" : "Open Flight Plan"}
                        </button>
                      </Link>
                      <button className="p-5 glass border-foreground/5 hover:bg-primary hover:text-white hover:border-primary rounded-2xl transition-all shadow-xl">
                        <ChevronRight size={22} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 flex flex-col items-center justify-center glass-card rounded-[56px] border-dashed border-foreground/10"
              >
                <div className="p-10 bg-primary/10 rounded-full mb-6">
                   <Calendar size={64} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-3 uppercase italic">No Voyages Logged</h3>
                <p className="text-muted-foreground text-center max-w-sm italic font-medium">Your hangar is empty. Start your journey by discovering world-class destinations.</p>
                <Link href="/city-search" className="mt-10">
                   <button className="px-12 py-6 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                      Scout New Territories
                   </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
