"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  MapPin,
  Calendar,
  Plus,
  ChevronRight,
  Navigation,
  Info,
  Plane,
  Camera,
  Utensils,
  Settings,
  Layout,
  List,
  GripVertical,
  X,
  Save,
  Check,
  TrendingUp,
  Map as MapIcon,
  Search,
  ArrowRight,
  Layers,
  Wind,
  Loader2,
  TrendingDown,
} from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import api from "@/lib/api";

export default function ItineraryPage() {
  const params = useParams();
  const tripId = (params?.tripId as string) || "1";
  const [activeDay, setActiveDay] = useState(0);
  const [mode, setMode] = useState<"view" | "build">("view");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState<any[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { budget, recalculate } = useBudget(tripId);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get("/trips");
        const result = response.data;
        if (result.success) {
          const found = result.data.find((t: any) => t.id === tripId) || result.data[0];

          if (found && !found.days) {
            found.days = [
              [
                { time: "09:00 AM", title: "Arrival & Transfer", location: found.destination || "Origin", type: "Transport", icon: <Plane size={14} />, cost: "₹0" },
                { time: "01:00 PM", title: "Welcome Lunch", location: "Grand Plaza", type: "Food", icon: <Utensils size={14} />, cost: "₹2,500" },
                { time: "04:00 PM", title: "City Orientation Walk", location: "Old Town", type: "Activity", icon: <Camera size={14} />, cost: "₹1,200" },
              ],
              [
                { time: "10:00 AM", title: "Local Landmark Visit", location: "Central Square", type: "Activity", icon: <Navigation size={14} />, cost: "₹1,800" },
                { time: "07:30 PM", title: "Cultural Dinner Night", location: "Heritage Inn", type: "Food", icon: <Utensils size={14} />, cost: "₹4,500" },
              ],
            ];
          }

          setTrip(found);
          if (found) {
            setImgSrc(found.image || found.coverImage);
            setStops([
              { id: "s1", city: (found.destination || "Destination").split(",")[0], dates: "June 15 - 17", activities: 4 },
              { id: "s2", city: "Nearby Escape", dates: "June 18 - 20", activities: 3 },
            ]);
          }
        }
      } catch (error) {
        console.error("Fetch Trip Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    if (trip) {
      recalculate({
        location: trip.destination || trip.location,
        startDate: trip.startDate,
        endDate: trip.endDate,
        activities: trip.days.flat(),
        stops: stops,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, trip?.id]);

  if (loading || !trip) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-border">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src={
            imgSrc ||
            "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=2000&auto=format&fit=crop"
          }
          onError={() =>
            setImgSrc(
              `https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop`
            )
          }
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge bg-white/90 text-slate-900 backdrop-blur">
              <Wind size={12} />
              Active plan
            </span>
            <span className="badge bg-white/20 text-white backdrop-blur">{trip.status}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-white/90" />
              {trip.location || trip.destination}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={15} className="text-white/90" />
              7-day voyage
            </span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="absolute top-4 right-4 flex gap-1 p-1 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
          <button
            onClick={() => setMode("view")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              mode === "view" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
            }`}
          >
            <Layers size={16} />
            Timeline
          </button>
          <button
            onClick={() => setMode("build")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              mode === "build" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
            }`}
          >
            <Settings size={16} />
            Builder
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "view" ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              <section className="card card-pad">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Info size={19} />
                  </div>
                  <h2 className="section-title">About this trip</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {trip.description ||
                    "Your curated journey through the best landmarks, dining spots, and hidden secrets of the region."}
                </p>

                <div className="mt-6 pt-6 border-t border-border space-y-5">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Estimated cost
                    </div>
                    <div className="text-2xl font-bold text-foreground tracking-tight">
                      {budget ? `₹${budget.totalCost.toLocaleString()}` : "Calculating..."}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-muted p-4">
                      <div className="text-xs text-muted-foreground mb-0.5">Cities</div>
                      <div className="text-lg font-semibold text-foreground">{stops.length}</div>
                    </div>
                    <div className="rounded-xl bg-muted p-4">
                      <div className="text-xs text-muted-foreground mb-0.5">Activities</div>
                      <div className="text-lg font-semibold text-foreground">
                        {trip.days.reduce((acc: number, d: any[]) => acc + d.length, 0)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Daily average</span>
                    <span className="font-semibold text-foreground">
                      ₹{(budget?.averagePerDay || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>

              <section className="card card-pad tint relative overflow-hidden">
                <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
                  <Navigation size={120} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                  <h3 className="font-semibold text-foreground">Optimized route</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your route has been intelligently sequenced to minimize travel time.
                </p>
              </section>
            </div>

            {/* Timeline */}
            <div className="lg:col-span-8 space-y-5">
              <div className="card card-pad flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">The voyage</h2>
                  <div className="flex gap-1 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors cursor-pointer ${
                        viewMode === "list" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label="List view"
                    >
                      <List size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`p-2 rounded-md transition-colors cursor-pointer ${
                        viewMode === "calendar" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label="Calendar view"
                    >
                      <Layout size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                  {trip.days.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDay(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        activeDay === idx
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      Day {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-4"
                >
                  {trip.days[activeDay].map((activity: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-4 sm:gap-6 relative before:absolute before:left-[27px] before:top-0 before:bottom-0 before:w-px before:bg-border last:before:bg-transparent"
                    >
                      <div className="relative z-10 w-[54px] h-[54px] shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                        {activity.icon}
                      </div>
                      <div className="card card-pad flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover">
                        <div className="flex gap-4 items-start sm:items-center">
                          <div className="text-sm font-semibold text-primary whitespace-nowrap pt-0.5">
                            {activity.time}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground leading-snug">{activity.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} className="text-primary" />
                                {activity.location}
                              </span>
                              <span className="chip">{activity.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:pl-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                          <div className="font-semibold text-foreground whitespace-nowrap">{activity.cost}</div>
                          <button className="text-xs font-medium text-primary hover:underline cursor-pointer">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="build"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="space-y-8"
          >
            <div className="card card-pad flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Itinerary builder</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Reorder stops to sequence your voyage.
                </p>
              </div>
              <button
                onClick={() =>
                  setStops([...stops, { id: `s${Date.now()}`, city: "New Destination", dates: "TBD", activities: 0 }])
                }
                className="btn btn-primary"
              >
                <Plus size={16} />
                Add stop
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <Reorder.Group axis="y" values={stops} onReorder={setStops} className="space-y-4">
                  {stops.map((stop) => (
                    <Reorder.Item
                      key={stop.id}
                      value={stop}
                      className="card card-pad flex items-center justify-between gap-4 card-hover cursor-default"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="cursor-grab active:cursor-grabbing p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary transition-colors shrink-0">
                          <GripVertical size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-muted-foreground mb-0.5">Stop</div>
                          <h4 className="font-semibold text-foreground truncate">{stop.city}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} className="text-primary" /> {stop.dates}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Check size={12} className="text-primary" /> {stop.activities} activities
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setStops(stops.filter((s) => s.id !== stop.id))}
                          className="icon-btn hover:bg-danger/10 hover:text-danger"
                          aria-label="Remove stop"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                <button
                  onClick={() => setMode("view")}
                  className="w-full py-8 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all font-medium flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Save size={20} />
                  Commit itinerary
                </button>
              </div>

              <div className="lg:col-span-4 space-y-5">
                <section className="card card-pad">
                  <h3 className="section-title mb-5 flex items-center gap-3">
                    <MapIcon size={18} className="text-primary" />
                    Intelligence tools
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-accent transition-colors cursor-pointer">
                      <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <Search size={17} className="text-primary" />
                        Explore nearby
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-accent transition-colors cursor-pointer">
                      <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                        <Plane size={17} className="text-primary" />
                        Sync flight data
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </section>

                <section className="card card-pad tint relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
                    <Wind size={100} />
                  </div>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
                    <Check size={14} />
                    Co-pilot active
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your stops are synced with real-time weather and transport data. Route is clear for
                    departure.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
