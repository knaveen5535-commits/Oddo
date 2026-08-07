"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight,
  TrendingUp,
  Compass,
  Heart,
  Globe,
  Umbrella,
  Mountain,
  Palmtree,
  Coffee,
  Navigation,
  ArrowUpRight,
  X,
  Calendar,
  Users,
  Camera,
  Wifi,
  Clock,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function CitySearchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchPopular = async () => {
      setIsSearching(true);
      try {
        const response = await api.get(`/trips/recommendations?location=world`);
        const result = response.data;
        
        if (result.success && result.data) {
           const all = [
             ...(result.data.attractions || []),
             ...(result.data.activities || []),
             ...(result.data.restaurants || []),
             ...(result.data.hotels || [])
           ];
           
           const mapped = all.map(p => ({
              id: p.place_id || Math.random().toString(),
              name: p.name,
              location: p.address,
              image: p.image,
              rating: p.rating,
              price: "₹" + (Math.floor(Math.random() * 2000) + 500),
              category: "Top Pick",
              tag: "Verified",
              desc: `Explore the beauty of ${p.name}.`,
              highlights: p.type ? p.type.slice(0, 3) : ["Must Visit"]
           }));
           setSearchResults(mapped);
        }
      } catch (error) {
        console.error("Auto Fetch Error:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchPopular();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]); 
    try {
      const response = await api.get(`/trips/recommendations?location=${encodeURIComponent(searchQuery)}`);
      const result = response.data;
      
      if (result.success && result.data) {
        const allPlaces: any[] = [];
        if (Array.isArray(result.data.attractions)) result.data.attractions.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Attraction", tag: "Popular" }));
        if (Array.isArray(result.data.activities)) result.data.activities.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Activity", tag: "Experience" }));
        if (Array.isArray(result.data.restaurants)) result.data.restaurants.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Dining", tag: "Top Rated" }));
        if (Array.isArray(result.data.hotels)) result.data.hotels.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Stay", tag: "Luxury" }));

        const mappedResults = allPlaces.map(p => ({
          id: p.place_id || Math.random().toString(),
          name: p.name,
          location: p.address || p.formatted_address || "Location not found",
          image: p.image,
          rating: p.rating || 0,
          price: "₹" + (Math.floor(Math.random() * 2000) + 500),
          category: p.catLabel,
          tag: p.tag,
          mapUrl: p.mapUrl,
          desc: `Discover the magic of ${p.name}.`,
          highlights: p.type ? p.type.slice(0, 3) : ["Iconic", "Top Rated"]
        }));
        setSearchResults(mappedResults);
      }
    } catch (error) {
      console.error("[Frontend] Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlanTrip = async (dest: any) => {
    setIsPlanning(true);
    try {
      const response = await api.post('/trips', {
        title: `Trip to ${dest.name}`,
        destination: dest.name,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Exploring ${dest.name}.`
      });

      if (response.status === 201 || response.status === 200) {
        setSelectedPlace(null);
        router.push('/trips');
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsPlanning(false);
    }
  };

  const categories = [
    { name: "All", icon: <Globe size={18} /> },
    { name: "Attraction", icon: <Umbrella size={18} /> },
    { name: "Dining", icon: <Coffee size={18} /> },
    { name: "Activity", icon: <Navigation size={18} /> },
    { name: "Stay", icon: <Mountain size={18} /> }
  ];

  const filteredDestinations = activeCategory === "All" 
    ? searchResults 
    : searchResults.filter(d => d.category === activeCategory);

  return (
    <div className="p-10 w-full space-y-12 pb-32 bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[450px] w-full rounded-[48px] overflow-hidden group shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          alt="Explorer Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl"
          >
            <h1 className="text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Explore the <span className="text-primary drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">Infinite</span> Beauty of the World
            </h1>
            <p className="text-foreground/70 text-xl font-medium">
              Join thousands of explorers discovering hidden gems every day.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-10 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-rose-500/50 rounded-[24px] blur opacity-30 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-foreground/10 backdrop-blur-3xl border border-foreground/20 rounded-[24px] p-2 pr-4 shadow-2xl">
                <div className="p-4">
                  {isSearching ? <Loader2 size={24} className="text-primary animate-spin" /> : <Search className="text-foreground/60 w-6 h-6" />}
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a city to find attractions..."
                  className="w-full bg-transparent border-none text-foreground text-lg placeholder:text-foreground/40 focus:outline-none focus:ring-0"
                />
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-3 rounded-2xl transition-all shadow-lg shadow-primary/30 active:scale-95"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat.name 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                : "glass border-foreground/10 text-muted-foreground hover:bg-foreground/5 hover:border-foreground/20"
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </section>

      {/* Grid */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase italic text-foreground">
              {searchQuery && searchResults.length > 0 ? `Discovering ${searchQuery}` : "Global Intelligence Grid"}
            </h2>
            <p className="text-muted-foreground text-lg italic">Explore {searchResults.length}+ world-class destinations mapped in real-time.</p>
          </div>
          <div className="flex gap-2">
             {searchQuery && (
               <button 
                onClick={() => { setSearchQuery(""); }}
                className="px-6 py-4 glass rounded-2xl border-foreground/10 text-foreground/60 hover:text-foreground transition-all text-xs font-black uppercase tracking-widest"
               >
                 Clear Search
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((dest, idx) => (
              <motion.div 
                key={dest.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.02 }}
                className="group relative"
                onClick={() => setSelectedPlace(dest)}
              >
                <div className="relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl border border-foreground/5 bg-foreground/5 cursor-pointer transition-all active:scale-95">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbacks = [
                        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da", // Agra
                        "https://images.unsplash.com/photo-1548013146-72479768bbaa", // Taj
                        "https://images.unsplash.com/photo-1506461883276-594a12b11cf3", // Bhutan
                        "https://images.unsplash.com/photo-1528127269322-539801943592", // Vietnam
                        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", // Thailand
                        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", // Mountain
                        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", // Maldives
                        "https://images.unsplash.com/photo-1537996194471-e657df975ab4", // Bali
                        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62", // London
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"  // Dining
                      ];
                      const hash = dest.name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                      target.src = `${fallbacks[hash % fallbacks.length]}?q=80&w=1200&auto=format&fit=crop`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                    {dest.tag || "Verified"}
                  </div>
                  <button className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-red-500 hover:border-red-500 transition-all group/fav">
                    <Heart size={18} className="group-hover/fav:fill-white" />
                  </button>
                  <div className="absolute bottom-8 left-8 right-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-lg text-xs font-black text-primary border border-primary/30">
                        <Star size={12} className="fill-primary" />
                        {dest.rating}
                      </div>
                      <span className="text-foreground/40 text-[10px] uppercase font-black tracking-widest">({dest.category})</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{dest.name}</h3>
                      <div className="flex items-center gap-2 text-foreground/60 text-sm line-clamp-1 italic">
                        <MapPin size={14} className="text-primary" />
                        {dest.location}
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <button onClick={(e) => { e.stopPropagation(); window.open(dest.mapUrl, '_blank'); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground transition-all border border-white/5 flex items-center gap-2">
                         <MapPin size={12} className="text-primary" /> Map
                      </button>
                      <button className="p-3 bg-primary text-white rounded-xl hover:rotate-12 transition-all shadow-lg shadow-primary/30">
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {isSearching && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
             <Loader2 size={64} className="text-primary animate-spin" />
             <p className="text-foreground/40 font-black uppercase tracking-widest animate-pulse">Mapping Destination Intelligence...</p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPlace(null)} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-5xl bg-card rounded-[48px] overflow-hidden shadow-2xl border border-foreground/10 flex flex-col md:flex-row h-full max-h-[800px]">
              <button onClick={() => setSelectedPlace(null)} className="absolute top-8 right-8 z-20 p-4 bg-foreground/5 backdrop-blur-md rounded-full border border-foreground/10 text-foreground hover:bg-foreground/10 transition-all shadow-2xl"><X size={24} /></button>
              <div className="w-full md:w-1/2 h-[300px] md:h-full relative overflow-hidden shrink-0">
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent hidden md:block" />
              </div>
              <div className="p-10 md:p-16 flex-1 overflow-y-auto scrollbar-hide space-y-10 text-foreground">
                <header className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">{selectedPlace.tag || "Verified"}</span>
                    <span className="text-foreground/40 text-xs font-black uppercase tracking-widest">{selectedPlace.category}</span>
                  </div>
                  <h2 className="text-5xl font-black text-foreground tracking-tight">{selectedPlace.name}</h2>
                  <div className="flex items-center gap-4 text-foreground/60 text-lg font-medium italic">
                    <span className="flex items-center gap-2"><MapPin size={20} className="text-primary" /> {selectedPlace.location}</span>
                    <span className="flex items-center gap-2 font-bold"><Star size={20} className="text-yellow-400 fill-yellow-400" /> {selectedPlace.rating}</span>
                  </div>
                </header>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-foreground border-l-4 border-primary pl-4 uppercase tracking-widest">Overview</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{selectedPlace.desc}</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Highlights</h3>
                    <ul className="space-y-3">
                      {selectedPlace.highlights?.map((h: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-foreground/80 font-medium capitalize"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(244,63,94,0.5)]" />{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="pt-10 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Intelligence Pick</div>
                    <div className="text-4xl font-black text-foreground italic">{selectedPlace.price}</div>
                  </div>
                  <button onClick={() => handlePlanTrip(selectedPlace)} disabled={isPlanning} className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95">
                    {isPlanning ? <Loader2 className="animate-spin" /> : "Plan a Trip Here"}
                    {!isPlanning && <ArrowRight size={20} />}
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
