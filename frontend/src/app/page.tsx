"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight,
  MapPin,
  LayoutGrid,
  ListFilter,
  ArrowUpDown,
  TrendingUp,
  Globe,
  Compass,
  Loader2,
  Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<"none" | "location">("none");
  const [sortBy, setSortBy] = useState<"none" | "name">("none");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const bannerImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=2000&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips');
        if (response.data.success) {
          setTrips(response.data.data);
        }
      } catch (error) {
        console.error("Fetch Trips Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, [user]);

  const regionalSelections = [
    { name: "Europe", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=400&auto=format&fit=crop" },
    { name: "Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop" },
    { name: "America", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=400&auto=format&fit=crop" },
    { name: "Africa", image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=400&auto=format&fit=crop" },
    { name: "Oceania", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=400&auto=format&fit=crop" },
  ];

  const filteredTrips = useMemo(() => {
    let result = trips.filter(trip => 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQuery, sortBy, trips]);

  const groupedTrips: Record<string, any[]> = useMemo(() => {
    if (groupBy === "none") return { "All Trips": filteredTrips };

    return filteredTrips.reduce((acc, trip) => {
      const key = trip.destination;
      if (!acc[key]) acc[key] = [];
      acc[key].push(trip);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredTrips, groupBy]);

  return (
    <div className="px-4 sm:px-10 w-full space-y-8 sm:space-y-12 bg-background min-h-screen text-foreground">
      {/* Hero Banner Section */}
      <section className="relative h-[320px] sm:h-[400px] w-full rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl group border border-white/5">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            src={bannerImages[currentImageIndex]} 
            alt="Hero Banner" 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="px-5 sm:px-6 py-2 bg-primary/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-bold text-primary border border-primary/30 uppercase tracking-[0.2em] inline-block">
              Welcome back, {user?.name || "Explorer"}
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none">
              Your World, <br />
              <span className="text-primary">Beautifully Planned</span>
            </h2>
            <p className="text-foreground/70 text-sm sm:text-lg font-medium max-w-xl mx-auto">
              Discover, plan, and manage your world travels with ease and elegance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Action Bar */}
      <section className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 flex gap-2 w-full group">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your trips by name or location..."
              className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-lg font-medium placeholder:text-foreground/20"
            />
          </div>
          <button className="bg-primary px-5 sm:px-8 py-4 rounded-[20px] text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-95 flex items-center gap-2">
            <Search size={20} className="hidden sm:block" />
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden"><Search size={18} /></span>
          </button>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <ActionButton 
            icon={<LayoutGrid size={18} />} 
            label={groupBy === "none" ? "Group by" : `Grouped: ${groupBy}`} 
            active={groupBy !== "none"}
            onClick={() => setGroupBy(prev => prev === "none" ? "location" : "none")} 
          />
          <ActionButton 
            icon={<ArrowUpDown size={18} />} 
            label={sortBy === "none" ? "Sort by..." : "Sorted: Name"} 
            active={sortBy !== "none"}
            onClick={() => setSortBy(prev => prev === "none" ? "name" : "none")} 
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatItem label="Total Trips" value={trips.length.toString()} icon={<Compass className="text-primary" />} />
        <StatItem label="Countries" value={new Set(trips.map(t => t.destination)).size.toString()} icon={<Globe className="text-primary" />} />
        <StatItem label="Active Items" value="12" icon={<TrendingUp className="text-primary" />} />
        <StatItem label="Profile Sync" value="Active" icon={<ShieldCheck className="text-primary" />} />
      </section>

      {/* Previous Trips Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-6">
          <h3 className="text-2xl font-bold whitespace-nowrap tracking-tight uppercase italic">Previous Trips</h3>
          <div className="h-[1px] flex-1 bg-white/5" />
          <Link href="/trips">
            <button className="text-sm font-bold text-primary uppercase tracking-widest hover:underline italic">See History</button>
          </Link>
        </div>

        <div className="space-y-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={48} className="text-primary animate-spin" />
              <p className="text-sm font-black text-foreground/20 uppercase tracking-[0.4em] italic">Retrieving Voyage History...</p>
            </div>
          ) : (
            Object.entries(groupedTrips).map(([groupName, trips]) => (
              <div key={groupName} className="space-y-6">
                {groupBy !== "none" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    <h4 className="text-xl font-bold text-foreground/90 italic uppercase">{groupName}</h4>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
                  {trips.length > 0 ? (
                    trips.map((trip, idx) => (
                      <Link key={trip.id} href={`/trips/${trip.id}/itinerary`}>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group cursor-pointer glass-card rounded-[40px] overflow-hidden border-white/5 flex flex-col h-[480px] hover:border-primary/30 transition-all shadow-2xl bg-card"
                        >
                          <div className="h-2/3 overflow-hidden">
                            <img 
                              src={trip.coverImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop"} 
                              alt={trip.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            />
                          </div>
                          <div className="p-10 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-black/40">
                            <div>
                              <h4 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors italic uppercase tracking-tight">{trip.title}</h4>
                              <div className="flex items-center gap-2 text-foreground/60">
                                <MapPin size={16} className="text-primary" />
                                <span className="text-base font-medium">{trip.destination}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/10 pt-6">
                              <div className="flex items-center gap-2">
                                <CalendarIcon size={14} className="text-primary" />
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40">
                                  {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                                <ChevronRight size={24} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center glass-card rounded-[40px] border-dashed border-white/10 flex flex-col items-center gap-6">
                      <div className="p-6 bg-white/5 rounded-full">
                        <Compass size={48} className="text-foreground/10" />
                      </div>
                      <p className="text-foreground/20 font-black italic uppercase tracking-widest text-sm">No recorded voyages found in your log.</p>
                      <Link href="/trips/create">
                        <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest italic hover:scale-105 transition-transform">
                          Initialize New Flight Plan
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FAB Button */}
      <Link href="/trips/create">
        <motion.button 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 bg-primary text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-[24px] font-black text-sm sm:text-lg shadow-[0_20px_50px_rgba(244,63,94,0.4)] flex items-center gap-3 z-50 border border-primary/20 backdrop-blur-md"
        >
          <Plus size={24} className="sm:hidden" />
          <Plus size={28} className="hidden sm:block" />
          <span className="sm:hidden">Plan</span>
          <span className="hidden sm:inline">Plan a trip</span>
        </motion.button>
      </Link>
    </div>
  );
}

function ActionButton({ icon, label, onClick, active = false }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4.5 glass border-white/5 rounded-[20px] transition-all text-sm font-bold whitespace-nowrap active:scale-95 uppercase tracking-widest italic ${
        active ? "bg-primary/20 text-primary border-primary/30" : "text-foreground/80 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-[24px] border-white/5 flex items-center gap-5 hover:bg-white/[0.02] transition-all bg-card">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl border border-primary/20 shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight text-foreground">{value}</div>
        <div className="text-sm font-bold text-foreground/30 uppercase tracking-widest italic">{label}</div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
