"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  ChevronRight, 
  Navigation,
  Info,
  Coffee,
  Plane,
  Camera,
  Utensils,
  Moon,
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
  TrendingDown,
  Layers,
  Wind,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import api from "@/lib/api";

export default function ItineraryPage() {
  const params = useParams();
  const tripId = params?.tripId as string || "1";
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
        const response = await api.get('/trips');
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
              ]
            ];
          }
          
          setTrip(found);
          if (found) {
            setImgSrc(found.image || found.coverImage);
            setStops([
              { id: "s1", city: (found.destination || "Destination").split(',')[0], dates: "June 15 - 17", activities: 4 },
              { id: "s2", city: "Nearby Escape", dates: "June 18 - 20", activities: 3 }
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
        stops: stops
      });
    }
  }, [stops, trip?.id]);

  if (loading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-background text-foreground transition-colors duration-300">
      {/* Cinematic Banner */}
      <div className="relative h-[550px] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={imgSrc || "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=2000&auto=format&fit=crop"} 
          onError={() => setImgSrc(`https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop&query=${encodeURIComponent(trip.location)}`)}
          alt={trip.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute bottom-0 left-0 p-12 w-full max-w-7xl mx-auto right-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-10"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-xl rounded-full border border-primary/30 flex items-center gap-2">
                    <Wind size={12} className="text-primary animate-pulse" />
                    <span className="text-base font-black text-primary uppercase tracking-[0.2em]">Active Flight Plan</span>
                 </div>
                 <div className="px-4 py-1.5 glass rounded-full border border-foreground/10 text-base font-black text-foreground/60 uppercase tracking-[0.2em]">
                    {trip.status}
                 </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] italic uppercase leading-[0.9]">
                {trip.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <span className="flex items-center gap-3 glass px-8 py-4 rounded-[24px] border-foreground/10 shadow-2xl text-white font-black text-sm uppercase tracking-widest">
                  <MapPin size={18} className="text-primary" />
                  {trip.location}
                </span>
                <span className="flex items-center gap-3 glass px-8 py-4 rounded-[24px] border-foreground/10 shadow-2xl text-white font-black text-sm uppercase tracking-widest">
                  <Calendar size={18} className="text-primary" />
                  7 Days Voyage
                </span>
              </div>
            </div>

            <div className="flex gap-2 p-2 glass rounded-[32px] border-foreground/10 shadow-2xl backdrop-blur-3xl">
               <button 
                onClick={() => setMode("view")}
                className={`px-10 py-5 rounded-[24px] text-sm font-black transition-all flex items-center gap-3 ${
                  mode === "view" ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105" : "text-foreground/40 hover:text-foreground"
                }`}
               >
                 <Layers size={18} /> Timeline
               </button>
               <button 
                onClick={() => setMode("build")}
                className={`px-10 py-5 rounded-[24px] text-sm font-black transition-all flex items-center gap-3 ${
                  mode === "build" ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105" : "text-foreground/40 hover:text-foreground"
                }`}
               >
                 <Settings size={18} /> Builder
               </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-12 w-full max-w-7xl mx-auto -mt-10 relative z-10">
        <AnimatePresence mode="wait">
          {mode === "view" ? (
            <motion.div 
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4 space-y-8">
                <section className="glass-card p-10 rounded-[48px] border-foreground/5 shadow-2xl">
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-4 italic uppercase tracking-tight text-foreground">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-inner">
                      <Info size={24} />
                    </div>
                    Intelligence
                  </h2>
                  <p className="text-foreground/60 leading-relaxed text-sm font-medium italic">
                    {trip.description || "Your curated journey through the best landmarks, dining spots, and hidden secrets of the region."}
                  </p>
                  
                  <div className="mt-12 pt-12 border-t border-foreground/10 space-y-8">
                     <div className="flex items-center justify-between group cursor-help">
                        <div>
                           <div className="text-sm font-black uppercase text-primary tracking-[0.2em] mb-1">Total Expedition Cost</div>
                           <div className="text-3xl font-black text-foreground italic group-hover:text-primary transition-colors">
                               {budget ? `₹${budget.totalCost.toLocaleString()}` : "Calculating..."}
                            </div>
                        </div>
                        <TrendingDown size={24} className="text-green-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 glass rounded-3xl border-foreground/5">
                           <div className="text-sm font-black text-foreground/20 uppercase tracking-widest mb-1">Cities</div>
                           <div className="text-xl font-black text-foreground">{stops.length}</div>
                        </div>
                        <div className="p-6 glass rounded-3xl border-foreground/5">
                           <div className="text-sm font-black text-foreground/20 uppercase tracking-widest mb-1">Items</div>
                           <div className="text-xl font-black text-foreground">12</div>
                        </div>
                     </div>
                  </div>
                </section>

                <div className="glass-card p-8 rounded-[48px] border-primary/10 group overflow-hidden relative">
                   <div className="absolute -right-10 -top-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                      <Navigation size={150} />
                   </div>
                   <h3 className="text-lg font-black mb-4 flex items-center gap-3 uppercase italic tracking-widest text-foreground">
                      <TrendingUp size={20} className="text-primary" />
                      Optimized Path
                   </h3>
                   <p className="text-sm text-foreground/40 font-medium leading-relaxed">
                      Your route has been intelligently sequenced to minimize travel time by 18%.
                   </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 glass p-8 rounded-[40px] border border-foreground/10">
                  <div className="flex items-center gap-6">
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-foreground">The Voyage</h2>
                    <div className="flex gap-2 p-1 glass rounded-2xl border border-foreground/10">
                       <button onClick={() => setViewMode("list")} className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground"}`}><List size={18} /></button>
                       <button onClick={() => setViewMode("calendar")} className={`p-3 rounded-xl transition-all ${viewMode === "calendar" ? "bg-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground"}`}><Calendar size={18} /></button>
                    </div>
                  </div>
                  <div className="flex gap-2 p-1.5 glass rounded-[24px] border-foreground/10 overflow-x-auto scrollbar-hide max-w-full">
                    {trip.days.map((_: any, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveDay(idx)}
                        className={`px-8 py-3.5 rounded-[18px] text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeDay === idx 
                            ? "bg-primary text-white shadow-xl shadow-primary/30" 
                            : "text-foreground/40 hover:text-foreground"
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
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-8 relative before:absolute before:left-[35px] before:top-10 before:bottom-10 before:w-[2px] before:bg-gradient-to-b before:from-primary/60 before:via-primary/10 before:to-transparent"
                  >
                    {trip.days[activeDay].map((activity: any, idx: number) => (
                      <div key={idx} className="relative pl-20 group">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[24px] glass border border-foreground/10 flex items-center justify-center z-10 group-hover:border-primary group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl bg-card">
                          <div className="text-primary drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                            {activity.icon}
                          </div>
                        </div>
                        <div className="glass-card p-10 rounded-[48px] border-foreground/5 group-hover:border-primary/20 transition-all duration-500 flex flex-col sm:flex-row justify-between items-center gap-6 hover:bg-card shadow-2xl">
                          <div className="flex gap-10 items-center w-full sm:w-auto">
                            <div className="text-sm font-black text-primary uppercase tracking-[0.3em] w-24 text-center shrink-0 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                              {activity.time}
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-black text-2xl text-foreground group-hover:text-primary transition-colors tracking-tight italic uppercase">{activity.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-foreground/40 font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {activity.location}</span>
                                <span className="px-3 py-1 glass rounded-lg text-foreground/60 border border-foreground/10">{activity.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right w-full sm:w-auto pt-6 sm:pt-0 border-t sm:border-t-0 border-foreground/5">
                             <div className="text-2xl font-black text-foreground italic">{activity.cost}</div>
                             <button className="text-xs font-black text-primary hover:underline mt-1 uppercase tracking-widest">Details & Split</button>
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 glass p-10 rounded-[48px] border border-foreground/10 shadow-2xl">
                 <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-4 text-foreground">Itinerary Engine</h2>
                    <p className="text-foreground/30 font-medium italic text-lg">Reorder stops and sequence your voyage with real-time intelligence.</p>
                 </div>
                 <button 
                  onClick={() => setStops([...stops, { id: `s${Date.now()}`, city: "New Destination", dates: "TBD", activities: 0 }])}
                  className="px-12 py-6 bg-primary text-white font-black rounded-[32px] shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center gap-4 hover:scale-105 hover:rotate-2 active:scale-95 transition-all text-sm uppercase tracking-widest group"
                 >
                   <Plus size={24} className="group-hover:rotate-90 transition-transform" /> Add Landing Stop
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 space-y-8">
                    <Reorder.Group axis="y" values={stops} onReorder={setStops} className="space-y-6">
                       {stops.map((stop) => (
                         <Reorder.Item 
                          key={stop.id} 
                          value={stop}
                          className="glass-card p-10 rounded-[48px] border-foreground/5 flex items-center justify-between group hover:border-primary/20 transition-all cursor-default shadow-2xl relative overflow-hidden"
                         >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-10">
                               <div className="cursor-grab active:cursor-grabbing p-4 glass rounded-2xl text-foreground/20 hover:text-primary transition-all border border-foreground/5">
                                  <GripVertical size={24} />
                               </div>
                               <div>
                                  <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">Target Destination</div>
                                  <h4 className="text-3xl font-black text-foreground italic uppercase tracking-tight">{stop.city}</h4>
                                  <div className="flex items-center gap-6 mt-3 text-sm font-black text-foreground/30 uppercase tracking-[0.2em]">
                                     <span className="flex items-center gap-2 px-3 py-1 glass rounded-lg"><Calendar size={14} className="text-primary" /> {stop.dates}</span>
                                     <span className="flex items-center gap-2 px-3 py-1 glass rounded-lg"><Check size={14} className="text-primary" /> {stop.activities} Checkpoints</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                               <button 
                                onClick={() => setStops(stops.filter(s => s.id !== stop.id))}
                                className="p-5 glass rounded-[24px] border-foreground/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all group/del"
                               >
                                  <X size={20} className="text-foreground/20 group-hover/del:text-red-500 transition-colors" />
                               </button>
                               <button className="p-5 glass rounded-[24px] border-foreground/5 hover:bg-primary/10 hover:border-primary/20 transition-all">
                                  <ArrowRight size={20} className="text-foreground/20 group-hover:text-primary transition-colors" />
                               </button>
                            </div>
                         </Reorder.Item>
                       ))}
                    </Reorder.Group>

                    <button 
                      onClick={() => setMode("view")}
                      className="w-full py-10 border-2 border-dashed border-foreground/5 rounded-[56px] text-foreground/10 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all font-black text-2xl italic uppercase tracking-tighter flex items-center justify-center gap-6 group"
                    >
                       <Save size={32} className="group-hover:scale-125 group-hover:-rotate-12 transition-transform" />
                       Commit Flight Plan
                    </button>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <section className="glass-card p-10 rounded-[56px] border-foreground/5 shadow-2xl">
                       <h3 className="font-black text-lg mb-8 flex items-center gap-4 italic uppercase tracking-widest text-foreground">
                          <MapIcon className="text-primary" size={24} />
                          Intelligence Tools
                       </h3>
                       <div className="space-y-4">
                          <button className="w-full p-6 glass border-foreground/5 rounded-[28px] text-left hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:rotate-12 transition-transform">
                                   <Search size={20} />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest text-foreground">Explore Nearby</span>
                             </div>
                             <ChevronRight size={18} className="text-foreground/10 group-hover:translate-x-2 transition-transform" />
                          </button>
                          <button className="w-full p-6 glass border-foreground/5 rounded-[28px] text-left hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:-rotate-12 transition-transform">
                                   <Plane size={20} />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest text-foreground">Sync Flight Data</span>
                             </div>
                             <ChevronRight size={18} className="text-foreground/10 group-hover:translate-x-2 transition-transform" />
                          </button>
                       </div>
                    </section>

                    <div className="glass-card p-10 rounded-[56px] border-primary/20 bg-gradient-to-br from-primary/10 to-transparent shadow-2xl relative overflow-hidden">
                        <div className="absolute -left-4 -top-4 opacity-5">
                           <Wind size={80} />
                        </div>
                        <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.3em] mb-4">
                           <Check size={14} className="animate-bounce" /> Co-Pilot Active
                        </div>
                        <p className="text-sm font-bold text-foreground/80 leading-relaxed italic">
                           "I've synchronized your stops with real-time weather and transport data. Your route is clear for departure."
                        </p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
