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
                    className="card overflow-hidden card-hover flex flex-col cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={item.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <button
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-600 hover:text-danger transition-colors"
                        aria-label="Save"
                      >
                        <Heart size={16} />
                      </button>
                      <span className="absolute bottom-3 left-3 badge bg-white/90 text-slate-900 backdrop-blur">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground leading-snug mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground line-clamp-1 mb-4">
                        <MapPin size={14} className="text-primary shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">{activeTab}</span>
                        <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                          Details <ArrowRight size={14} />
                        </span>
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
