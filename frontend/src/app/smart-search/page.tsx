"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Star, 
  Utensils, 
  Hotel, 
  Compass, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  X,
  Camera,
  Heart
} from "lucide-react";
import { travelService } from "@/services/api";

export default function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("attractions");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await travelService.getDestinationIntelligence(query);
      if (data.success) {
        setResults(data.data);
      } else {
        setError("No results found for this location.");
      }
    } catch (err) {
      setError("Failed to fetch destination data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "attractions", label: "Attractions", icon: <Compass size={18} /> },
    { id: "restaurants", label: "Restaurants", icon: <Utensils size={18} /> },
    { id: "hotels", label: "Hotels", icon: <Hotel size={18} /> },
    { id: "activities", label: "Activities", icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="min-h-screen p-10 space-y-12 pb-32 max-w-7xl mx-auto">
      {/* Hero / Header */}
      <header className="text-center space-y-6 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full border border-primary/20"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">Smart Destination AI</span>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-foreground leading-none">
          Explore <span className="text-primary drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">Deeply</span>
        </h1>
        <p className="text-foreground/40 text-xl font-medium max-w-2xl mx-auto italic">
          Search for any city to instantly fetch curated attractions, world-class restaurants, and premium stays from Google.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mt-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-rose-500/50 rounded-[32px] blur opacity-20 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[32px] p-2 pr-4 shadow-2xl backdrop-blur-xl">
            <div className="p-4">
              {loading ? <Loader2 size={24} className="text-primary animate-spin" /> : <Search className="text-foreground/40 w-6 h-6" />}
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter destination (e.g. Paris, Goa, Tokyo)..."
              className="w-full bg-transparent border-none text-foreground text-xl placeholder:text-foreground/20 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-4 rounded-[24px] transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
            >
              Explore AI
            </button>
          </div>
        </form>
      </header>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 p-6 glass border-red-500/20 text-red-400 rounded-3xl"
          >
            <AlertCircle size={20} />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}

        {results ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Tabs */}
            <div className="flex justify-center gap-2 p-1.5 glass rounded-[28px] border-white/10 w-fit mx-auto shadow-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-xl shadow-primary/30" 
                      : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {results[activeTab]?.map((item: any, idx: number) => (
                  <motion.div
                    key={item.place_id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative h-[450px] glass-card rounded-[48px] overflow-hidden border-white/5 hover:border-primary/20 transition-all cursor-pointer shadow-2xl"
                  >
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    <button className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white hover:bg-red-500 hover:border-red-500 transition-all">
                      <Heart size={18} />
                    </button>

                    <div className="absolute bottom-10 left-10 right-10 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-lg text-[10px] font-black text-primary border border-primary/30 uppercase">
                          <Star size={12} className="fill-primary" />
                          {item.rating}
                        </div>
                        <span className="text-foreground/40 text-[10px] uppercase font-black tracking-widest">({activeTab})</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                        <div className="flex items-center gap-2 text-foreground/60 text-sm font-medium line-clamp-1 italic">
                          <MapPin size={14} className="text-primary" />
                          {item.address}
                        </div>
                      </div>
                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                         <div className="text-xl font-black text-foreground italic underline">Details</div>
                         <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30">
                            <ArrowRight size={20} />
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : !loading && (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center space-y-6 text-center"
          >
             <div className="p-8 bg-white/5 rounded-full border border-white/10 text-foreground/10">
                <Compass size={64} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-widest text-foreground/40">Ready for Launch</h3>
                <p className="text-foreground/20 font-medium italic">Enter a destination to start the AI discovery engine.</p>
             </div>
          </motion.div>
        )}

        {loading && (
           <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 flex flex-col items-center justify-center space-y-8"
           >
              <div className="relative">
                 <Loader2 size={80} className="text-primary animate-spin" />
                 <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
              </div>
              <div className="text-center space-y-2">
                 <h3 className="text-2xl font-black uppercase tracking-widest text-foreground">Fetching Intelligence</h3>
                 <p className="text-foreground/40 font-medium italic">Querying Google Places for the best spots in {query}...</p>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
