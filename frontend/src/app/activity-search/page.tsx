"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  X,
  Users,
  ArrowRight,
  Loader2,
  Utensils,
  Compass,
  Tent,
  Ship,
  Bike,
  Activity as ActivityIcon,
} from "lucide-react";
import api from "@/lib/api";

export default function ActivitySearchPage() {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchPopularActivities = async () => {
      setIsSearching(true);
      try {
        const response = await api.get(`/trips/search-places`, {
          params: { query: "popular tourist activities worldwide" },
        });

        const result = response.data;

        if (result.success) {
          const mapped = result.data.map((item: any) => ({
            id: item.id,
            title: item.name,
            location: item.location,
            rating: item.rating,
            reviews: Math.floor(Math.random() * 500) + 50,
            price: "₹" + (Math.floor(Math.random() * 5000) + 500),
            duration: (Math.floor(Math.random() * 6) + 2) + " hours",
            image: item.image,
            desc: item.desc,
            includes: item.highlights || ["Expert Guide", "Equipment", "Insurance"],
          }));
          setActivities(mapped);
        }
      } catch (error) {
        console.error("Auto Fetch Activities Error:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchPopularActivities();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await api.get(`/trips/search-places`, {
        params: { query: `${searchQuery} things to do` },
      });
      const result = response.data;
      if (result.success) {
        const mapped = result.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          location: item.location,
          rating: item.rating,
          reviews: Math.floor(Math.random() * 500) + 50,
          price: "₹" + (Math.floor(Math.random() * 5000) + 500),
          duration: (Math.floor(Math.random() * 6) + 2) + " hours",
          image: item.image,
          desc: item.desc,
          includes: item.highlights || ["Expert Guide", "Equipment", "Insurance"],
        }));
        setActivities(mapped);
      }
    } catch (error) {
      console.error("Activity Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const categories = [
    { name: "Water Sports", icon: <Ship size={15} /> },
    { name: "City Tours", icon: <Compass size={15} /> },
    { name: "Hiking", icon: <Tent size={15} /> },
    { name: "Dining", icon: <Utensils size={15} /> },
    { name: "Cycling", icon: <Bike size={15} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <span className="badge badge-primary mb-3">
            <ActivityIcon size={13} />
            Live experiences
          </span>
          <h1 className="page-title">Discover Activities</h1>
          <p className="page-subtitle">
            Authentic experiences fetched in real-time from across the globe.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative flex items-center card p-1.5 shadow-md">
          <div className="pl-3 pr-2">
            {isSearching ? (
              <Loader2 size={20} className="text-primary animate-spin" />
            ) : (
              <Search size={20} className="text-muted-foreground" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities (e.g. Scuba diving in Bali)..."
            className="flex-1 bg-transparent border-none text-foreground text-sm sm:text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 px-2 py-2.5"
          />
          <button type="submit" className="btn btn-primary btn-sm sm:btn-lg rounded-xl">
            Search activities
          </button>
        </form>
        <button className="btn btn-outline lg:w-auto">
          <ArrowUpDown size={16} className="text-primary" />
          Sort by
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat.name} className="btn btn-outline flex-none">
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setSelectedActivity(activity)}
              className="card overflow-hidden card-hover flex flex-col md:flex-row cursor-pointer"
            >
              <div className="p-6 flex-1 flex flex-col relative">
                <span className="absolute top-6 right-6 badge bg-primary/10 text-primary backdrop-blur">
                  <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
                  {activity.rating ? activity.rating : "N/A"}
                </span>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1.5">
                      <TrendingUp size={13} />
                      Live availability
                    </div>
                    <h3 className="text-lg font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-primary" />
                        {activity.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={13} className="text-primary" />
                        {activity.reviews} reviews
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-foreground whitespace-nowrap">{activity.price}</div>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border mt-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="chip">
                      <Clock size={13} className="text-primary" />
                      {activity.duration}
                    </span>
                    <span className="chip">Instant confirmation</span>
                  </div>
                  <button className="icon-btn w-10 h-10" aria-label="View details">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isSearching && activities.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <h3 className="text-sm font-medium text-muted-foreground">Searching the globe...</h3>
          </div>
        )}
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto scrollbar-hide">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  Confirmed experience
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3 leading-snug">
                  {selectedActivity.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-primary" />
                    {selectedActivity.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                    {selectedActivity.rating ? `${selectedActivity.rating} / 5` : "N/A"}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedActivity.desc}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Includes</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.includes.map((inc: string, i: number) => (
                      <span key={i} className="chip capitalize">{inc.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{selectedActivity.price}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Per person • Instant confirmation
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg">
                    Reserve now <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
