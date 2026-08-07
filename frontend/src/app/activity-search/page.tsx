"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowUpDown, 
  Star, 
  MapPin, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Camera,
  X,
  Calendar,
  Users,
  Navigation,
  ArrowRight,
  Loader2,
  Utensils,
  Compass,
  Tent,
  Ship,
  Bike
} from "lucide-react";

export default function ActivitySearchPage() {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Automatically fetch popular activities on load
    const fetchPopularActivities = async () => {
      setIsSearching(true);
      try {
        console.log("Fetching popular activities...");
        const response = await fetch(`http://localhost:5001/api/trips/search-places?query=popular%20tourist%20activities%20worldwide`);
        
        if (!response.ok) {
           throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Activity fetch result:", result);

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
            includes: item.highlights || ["Expert Guide", "Equipment", "Insurance"]
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
      const response = await fetch(`http://localhost:5001/api/trips/search-places?query=${encodeURIComponent(searchQuery + " things to do")}`);
      const result = await response.json();
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
          includes: item.highlights || ["Expert Guide", "Equipment", "Insurance"]
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
    { name: "Water Sports", icon: <Ship size={16} /> },
    { name: "City Tours", icon: <Compass size={16} /> },
    { name: "Hiking", icon: <Tent size={16} /> },
    { name: "Dining", icon: <Utensils size={16} /> },
    { name: "Cycling", icon: <Bike size={16} /> },
  ];

  return (
    <div className="px-4 sm:px-10 w-full pb-32">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
           <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/30">Live Experiences</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic">Discover Activities</h1>
        <p className="text-foreground/40 text-sm sm:text-lg font-medium">Authentic experiences fetched in real-time from across the globe.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <form onSubmit={handleSearch} className="lg:col-span-3 relative group">
          <div className="absolute -inset-1 bg-primary/20 rounded-3xl blur opacity-20 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-3xl p-1.5 sm:p-2 sm:pr-6 shadow-2xl">
            <div className="p-3 sm:p-4 shrink-0">
              {isSearching ? <Loader2 size={24} className="text-primary animate-spin" /> : <Search className="text-foreground/40 w-5 h-5 sm:w-6 sm:h-6" />}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities (e.g. Scuba diving in Bali, Rooftop bars in Tokyo)..."
              className="w-full bg-transparent border-none text-foreground text-base sm:text-xl placeholder:text-foreground/20 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-black px-4 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-primary/30 active:scale-95"
            >
              <span className="sm:hidden"><Search size={18} /></span>
              <span className="hidden sm:inline">Fetch Activities</span>
            </button>
          </div>
        </form>
        <div className="flex gap-3">
          <button className="flex-1 px-6 py-4 glass border-white/10 rounded-3xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest">
            <ArrowUpDown size={20} className="text-primary" />
            Sort By
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
         {categories.map((cat) => (
           <button 
            key={cat.name}
            className="flex items-center gap-2 px-6 py-3 glass border-white/10 rounded-2xl text-xs font-bold text-foreground/60 hover:text-foreground hover:border-primary/40 transition-all whitespace-nowrap"
           >
             {cat.icon}
             {cat.name}
           </button>
         ))}
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, idx) => (
            <motion.div 
              key={activity.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedActivity(activity)}
              className="group glass-card rounded-[40px] overflow-hidden border-white/5 hover:border-primary/20 transition-all cursor-pointer flex flex-col md:flex-row h-auto md:h-64 shadow-2xl hover:shadow-primary/5"
            >
              <div className="w-full md:w-80 h-56 md:h-full overflow-hidden shrink-0 relative">
                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                   {activity.rating} ⭐
                </div>
              </div>
              <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                      <TrendingUp size={12} /> Live Availability
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{activity.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {activity.location}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-primary" /> {activity.reviews} Reviews</span>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">{activity.price}</div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                    <span className="flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5"><Clock size={14} className="text-primary" /> {activity.duration}</span>
                    <span className="flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5"><Camera size={14} className="text-primary" /> High-Res Views</span>
                  </div>
                  <button className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isSearching && activities.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
             <Loader2 size={64} className="text-primary animate-spin" />
             <h3 className="text-xl font-black uppercase tracking-widest text-foreground/20">Scouring the Globe...</h3>
          </div>
        )}
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl bg-card rounded-t-[40px] sm:rounded-[56px] overflow-hidden shadow-2xl border border-foreground/10 flex flex-col md:flex-row h-[92vh] sm:h-full sm:max-h-[700px]"
            >
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 p-3 sm:p-4 bg-foreground/5 backdrop-blur-md rounded-full border border-foreground/10 text-foreground hover:bg-foreground/10 transition-all shadow-2xl"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-[200px] sm:h-[300px] md:h-full relative overflow-hidden shrink-0">
                <img src={selectedActivity.image} alt={selectedActivity.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent hidden md:block" />
              </div>

              <div className="p-6 sm:p-12 md:p-16 flex-1 overflow-y-auto scrollbar-hide space-y-10">
                <div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Confirmed Experience</div>
                  <h2 className="text-2xl sm:text-4xl font-black text-foreground mb-4 tracking-tight leading-none">{selectedActivity.title}</h2>
                  <div className="flex flex-wrap items-center gap-6 text-foreground/40 text-sm font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> {selectedActivity.location}</span>
                    <span className="flex items-center gap-2"><Star size={18} className="text-yellow-400 fill-yellow-400" /> {selectedActivity.rating} / 5</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-widest border-l-4 border-primary pl-4">Description</h3>
                  <p className="text-foreground/60 text-base sm:text-lg leading-relaxed font-medium">{selectedActivity.desc}</p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-widest border-l-4 border-primary pl-4">Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedActivity.includes.map((inc: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 glass rounded-2xl border-foreground/10 text-sm text-foreground/80 font-bold capitalize">
                         <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                         {inc.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-foreground/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="text-3xl font-black text-foreground">{selectedActivity.price}</div>
                    <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mt-1">Per Person • Instant Confirmation</div>
                  </div>
                  <button className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3">
                    Reserve Now <ArrowRight size={20} />
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
