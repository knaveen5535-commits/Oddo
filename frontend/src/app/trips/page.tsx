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
  Loader2,
  Plane,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

const tabs = ["Upcoming", "Draft", "Past"] as const;

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
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
      let allTrips: any[] = [];
      
      // 1. Fetch backend Prisma trips
      try {
        const response = await api.get("/trips");
        if (response.data?.success && Array.isArray(response.data.data)) {
          allTrips = [...response.data.data];
        }
      } catch (err) {
        console.warn("Could not fetch backend trips", err);
      }

      // 2. Fetch newly generated trips from Supabase 'suggested_trips' table
      if (user?.id) {
        const { data: supabaseTrips, error } = await supabase
          .from("suggested_trips")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && supabaseTrips) {
          const formattedSupabase = supabaseTrips.map(t => ({
            id: t.id,
            title: t.title,
            destination: t.destination,
            location: t.destination,
            coverImage: t.cover_image,
            status: "Upcoming", // Default to Upcoming
            startDate: t.created_at || new Date().toISOString(),
            duration: t.duration_days || 3,
            isSuggested: true,
          }));
          
          allTrips = [...allTrips, ...formattedSupabase];
        }
      }

      setTrips(allTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter((trip: any) => {
    if (activeTab === "Upcoming") return trip.status === "Upcoming" || trip.status === "Active";
    return trip.status === activeTab;
  }).filter((trip: any) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      trip.title.toLowerCase().includes(q) ||
      (trip.destination || trip.location || "").toLowerCase().includes(q)
    );
  });

  const getFallbackImage = (title: string) => {
    const fallbacks = [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
      "https://images.unsplash.com/photo-1548013146-72479768bbaa",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3",
      "https://images.unsplash.com/photo-1528127269322-539801943592",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    ];
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `${fallbacks[hash % fallbacks.length]}?q=80&w=1200&auto=format&fit=crop`;
  };

  const countFor = (tab: (typeof tabs)[number]) =>
    tab === "Upcoming"
      ? trips.filter((t) => t.status === "Upcoming" || t.status === "Active").length
      : trips.filter((t) => t.status === tab).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Trips</h1>
          <p className="page-subtitle">Manage and organize your curated travel adventures.</p>
        </div>
        <Link href="/city-search">
          <button className="btn btn-primary">
            <Plus size={18} />
            Launch new trip
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            <span className={`ml-2 badge ${activeTab === tab ? "badge-primary" : "badge-neutral"}`}>
              {countFor(tab)}
            </span>
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab.toLowerCase()} trips...`}
          className="input pl-10"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading your trips...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: idx * 0.04 }}
                  className="card overflow-hidden card-hover flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={trip.coverImage || trip.image || getFallbackImage(trip.title)}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(trip.title);
                      }}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span
                      className={`absolute top-3 right-3 badge ${
                        trip.status === "Active" || trip.status === "Upcoming"
                          ? "badge-primary"
                          : trip.status === "Draft"
                          ? "badge-warning"
                          : "badge-neutral"
                      } backdrop-blur`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-1.5 line-clamp-1">{trip.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                      <MapPin size={14} className="text-primary" />
                      <span className="truncate">{trip.location || trip.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-5">
                      <span className="chip">
                        <Calendar size={13} className="text-primary" />
                        {new Date(trip.startDate).toLocaleDateString()}
                      </span>
                      <span className="chip">
                        <Clock size={13} className="text-primary" />
                        {trip.duration || 7}-day voyage
                      </span>
                    </div>
                    <div className="mt-auto flex gap-3 pt-4 border-t border-border">
                      <Link href={`/trips/${trip.id}/itinerary`} className="flex-1">
                        <button className="btn btn-primary w-full">
                          {trip.status === "Draft" ? <FileEdit size={16} /> : <CheckCircle2 size={16} />}
                          {trip.status === "Draft" ? "Resume build" : "Open trip"}
                        </button>
                      </Link>
                      <button className="icon-btn w-11 h-11 rounded-xl" aria-label="Trip details">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full card empty-state"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Plane size={26} className="text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {searchQuery ? "No matching trips" : `No ${activeTab.toLowerCase()} trips`}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  {searchQuery
                    ? "Nothing matches your search query."
                    : "Your hangar is empty. Start your journey by discovering world-class destinations."}
                </p>
                {!searchQuery && (
                  <Link href="/city-search">
                    <button className="btn btn-primary">Explore destinations</button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
