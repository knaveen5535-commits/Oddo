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
  Heart,
  Sparkles,
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
    { id: "attractions", label: "Attractions", icon: <Compass size={16} /> },
    { id: "restaurants", label: "Restaurants", icon: <Utensils size={16} /> },
    { id: "hotels", label: "Hotels", icon: <Hotel size={16} /> },
    { id: "activities", label: "Activities", icon: <TrendingUp size={16} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center space-y-5 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20"
        >
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">Smart destination AI</span>
        </motion.div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Explore <span className="text-primary">deeply</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Search for any city to instantly fetch curated attractions, world-class restaurants, and
          premium stays.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center card p-1.5 shadow-md">
          <div className="pl-3 pr-2">
            {loading ? (
              <Loader2 size={20} className="text-primary animate-spin" />
            ) : (
              <Search size={20} className="text-muted-foreground" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter destination (e.g. Paris, Goa, Tokyo)..."
            className="flex-1 bg-transparent border-none text-foreground text-sm sm:text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 px-2 py-2.5"
          />
          <button type="submit" disabled={loading} className="btn btn-primary btn-sm sm:btn-lg rounded-xl">
            Explore AI
          </button>
        </form>
      </section>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 p-4 card border-danger/30 text-danger rounded-xl"
          >
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {results ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit max-w-full overflow-x-auto scrollbar-hide mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {results[activeTab]?.map((item: any, idx: number) => (
                  <motion.div
                    key={item.place_id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: idx * 0.04 }}
                    className="card overflow-hidden card-hover flex flex-col p-6 group h-full border border-border/50 hover:border-primary/30 transition-all duration-300 relative bg-gradient-to-br from-card to-card hover:to-primary/5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                          {activeTab === 'attractions' ? <Compass size={22} /> : 
                           activeTab === 'restaurants' ? <Utensils size={22} /> : 
                           activeTab === 'hotels' ? <Hotel size={22} /> : 
                           <TrendingUp size={22} />}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="badge bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider w-fit">{activeTab}</span>
                          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {item.rating || "New"}
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-danger transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-danger/10"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Save"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{item.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-end pt-5 border-t border-border/60 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : !loading ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card empty-state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Compass size={30} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Ready to explore</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enter a destination to start the AI discovery engine.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center space-y-6"
          >
            <Loader2 size={48} className="text-primary animate-spin" />
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">Fetching intelligence</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Querying Google Places for the best spots in {query}...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
