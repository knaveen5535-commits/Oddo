"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MapPin,
  LayoutGrid,
  ArrowUpDown,
  Globe,
  Compass,
  Loader2,
  Calendar as CalendarIcon,
  ArrowRight,
  Plane,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<"none" | "location">("none");
  const [sortBy, setSortBy] = useState<"none" | "name">("none");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips");
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

  const upcoming = trips.filter((t) => t.status === "Upcoming" || t.status === "Active");
  const fallbackImage =
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop";

  const filteredTrips = useMemo(() => {
    let result = trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === "name") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [searchQuery, sortBy, trips]);

  const groupedTrips: Record<string, any[]> = useMemo(() => {
    if (groupBy === "none") return { All: filteredTrips };
    return filteredTrips.reduce((acc, trip) => {
      const key = trip.destination || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(trip);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredTrips, groupBy]);

  const stats = [
    { label: "Total Trips", value: trips.length, icon: <Compass className="text-primary" size={20} />, tint: "bg-primary/10 text-primary" },
    { label: "Upcoming", value: upcoming.length, icon: <Plane className="text-primary" size={20} />, tint: "bg-primary/10 text-primary" },
    { label: "Countries", value: new Set(trips.map((t) => t.destination)).size, icon: <Globe className="text-primary" size={20} />, tint: "bg-primary/10 text-primary" },
    { label: "Sync Status", value: "Active", icon: <ShieldCheck className="text-primary" size={20} />, tint: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card card-hover">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <span className="badge badge-primary mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ready for your next journey?
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Plan trips, track budgets, and build packing lists — all in one place.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/city-search">
              <button className="btn btn-outline">
                <Globe size={18} />
                Explore
              </button>
            </Link>
            <Link href="/trips/create">
              <button className="btn btn-primary">
                <Plus size={18} />
                Plan a trip
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card card-pad card-hover flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.tint}`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label truncate">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Toolbar */}
      <section className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by name or destination..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setGroupBy((prev) => (prev === "none" ? "location" : "none"))}
            className={`btn ${groupBy !== "none" ? "btn-primary" : "btn-outline"}`}
          >
            <LayoutGrid size={16} />
            {groupBy !== "none" ? "Grouped by destination" : "Group by destination"}
          </button>
          <button
            onClick={() => setSortBy((prev) => (prev === "none" ? "name" : "none"))}
            className={`btn ${sortBy !== "none" ? "btn-primary" : "btn-outline"}`}
          >
            <ArrowUpDown size={16} />
            {sortBy !== "none" ? "Sorted A-Z" : "Sort A-Z"}
          </button>
        </div>
      </section>

      {/* Trips */}
      <section className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading your trips...</p>
          </div>
        ) : (
          Object.entries(groupedTrips).map(([groupName, groupTrips]) => (
            <div key={groupName} className="space-y-4">
              {groupBy !== "none" && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <h3 className="text-base font-semibold text-foreground">{groupName}</h3>
                  <span className="badge badge-neutral">{groupTrips.length}</span>
                </div>
              )}
              {groupTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {groupTrips.map((trip, idx) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link href={`/trips/${trip.id}/itinerary`} className="block h-full">
                        <div className="card overflow-hidden card-hover flex flex-col h-full">
                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={trip.coverImage || fallbackImage}
                              alt={trip.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <span className="absolute top-3 right-3 badge bg-white/90 text-slate-900 backdrop-blur">
                              {trip.status || "Planned"}
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-foreground leading-snug mb-1.5 line-clamp-1">
                              {trip.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                              <MapPin size={14} className="text-primary" />
                              <span className="truncate">{trip.destination}</span>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <CalendarIcon size={14} className="text-primary" />
                                {new Date(trip.startDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                                Open <ArrowRight size={14} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="card empty-state">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Compass size={26} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">No trips found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    {searchQuery
                      ? "Nothing matches your search. Try a different keyword."
                      : "Your travel log is empty. Plan your first trip to get started."}
                  </p>
                  {!searchQuery && (
                    <Link href="/trips/create">
                      <button className="btn btn-primary">
                        <Plus size={16} />
                        Plan your first trip
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Regional picks */}
      {trips.length === 0 && !loading && (
        <section>
          <div className="section-heading">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="section-title">Trending destinations</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {["Europe", "Asia", "America", "Oceania"].map((region) => (
              <Link key={region} href="/city-search">
                <div className="card card-hover p-5 h-32 flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <h4 className="font-semibold text-foreground">{region}</h4>
                    <p className="text-xs text-muted-foreground">Explore top picks</p>
                  </div>
                  <ArrowRight size={18} className="text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
