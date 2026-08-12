"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Heart,
  Globe,
  Umbrella,
  Mountain,
  Coffee,
  X,
  Loader2,
  Compass,
  Sparkles,
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
            ...(result.data.restaurants || []),
            ...(result.data.hotels || []),
          ];

          const seen = new Set<string>();
          const mapped = all
            .map((p) => {
              const id = p.place_id || `${p.name}-${Math.random().toString(36).slice(2)}`;
              return {
                id,
                name: p.name,
                location: p.address,
                image: p.image,
                rating: p.rating,
                price: "₹" + (Math.floor(Math.random() * 2000) + 500),
                category: "Top Pick",
                tag: "Verified",
                desc: `Explore the beauty of ${p.name}.`,
                highlights: p.type ? p.type.slice(0, 3) : ["Must Visit"],
                mapUrl: p.mapUrl,
              };
            })
            .filter((mappedItem: any) => {
              if (seen.has(mappedItem.id)) return false;
              seen.add(mappedItem.id);
              return true;
            });
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
      const response = await api.get(
        `/trips/recommendations?location=${encodeURIComponent(searchQuery)}`
      );
      const result = response.data;

      if (result.success && result.data) {
        const allPlaces: any[] = [];
        if (Array.isArray(result.data.attractions))
          result.data.attractions.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Attraction", tag: "Popular" }));
        if (Array.isArray(result.data.restaurants))
          result.data.restaurants.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Dining", tag: "Top Rated" }));
        if (Array.isArray(result.data.hotels))
          result.data.hotels.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Stay", tag: "Luxury" }));

        const mappedResults = (() => {
          const seen = new Set<string>();
          return allPlaces
            .map((p) => {
              const id = p.place_id || `${p.name}-${Math.random().toString(36).slice(2)}`;
              return {
                id,
                name: p.name,
                location: p.address || p.formatted_address || "Location not found",
                image: p.image,
                rating: p.rating || 0,
                price: "₹" + (Math.floor(Math.random() * 2000) + 500),
                category: p.catLabel,
                tag: p.tag,
                mapUrl: p.mapUrl,
                desc: `Discover the magic of ${p.name}.`,
                highlights: p.type ? p.type.slice(0, 3) : ["Iconic", "Top Rated"],
              };
            })
            .filter((mappedItem: any) => {
              if (seen.has(mappedItem.id)) return false;
              seen.add(mappedItem.id);
              return true;
            });
        })();
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
      const response = await api.post("/trips", {
        title: `Trip to ${dest.name}`,
        destination: dest.name,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Exploring ${dest.name}.`,
      });

      if (response.status === 201 || response.status === 200) {
        setSelectedPlace(null);
        router.push("/trips");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsPlanning(false);
    }
  };

  const categories = [
    { name: "All", icon: <Globe size={16} /> },
    { name: "Attraction", icon: <Umbrella size={16} /> },
    { name: "Dining", icon: <Coffee size={16} /> },
    { name: "Stay", icon: <Mountain size={16} /> },
  ];

  const filteredDestinations =
    activeCategory === "All" ? searchResults : searchResults.filter((d) => d.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24 px-6 flex items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] opacity-50 -translate-y-1/2" />
          <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] opacity-50" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background/80 backdrop-blur border border-border rounded-full mb-6 shadow-sm">
            <Globe size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">Discover over 10,000+ cities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Explore the <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">world's beauty</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Search any city to instantly uncover the best attractions, world-class dining, and highly-rated stays.
          </p>

          <form onSubmit={handleSearch} className="relative flex items-center bg-background rounded-2xl p-2 shadow-xl shadow-primary/5 border border-border transition-all focus-within:shadow-2xl focus-within:shadow-primary/10 focus-within:border-primary/40 group">
            <div className="pl-4 pr-2">
              {isSearching ? (
                <Loader2 size={20} className="text-primary animate-spin" />
              ) : (
                <Search size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a city (e.g. Paris, Tokyo, Bali)..."
              className="flex-1 bg-transparent border-none text-foreground text-sm sm:text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 px-2 py-3"
            />
            <button type="submit" className="btn btn-primary h-12 px-6 sm:px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <span className="hidden sm:inline font-semibold">Search</span>
              <Search size={18} className="sm:hidden" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`btn flex-none ${
              activeCategory === cat.name ? "btn-primary" : "btn-outline"
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-lg sm:text-xl">
              {searchQuery && searchResults.length > 0 ? `Results for "${searchQuery}"` : "Popular destinations"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchResults.length} places available
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="btn btn-ghost btn-sm"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {isSearching && searchResults.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Searching destinations...</p>
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => setSelectedPlace(dest)}
                  className="cursor-pointer"
                >
                  <div className="card overflow-hidden card-hover flex flex-col p-6 group h-full border border-border/50 hover:border-primary/30 transition-all duration-300 relative bg-gradient-to-br from-card to-card hover:to-primary/5">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                          {dest.category === 'Attraction' ? <Umbrella size={22} /> : 
                           dest.category === 'Dining' ? <Coffee size={22} /> : 
                           dest.category === 'Stay' ? <Mountain size={22} /> : 
                           <Compass size={22} />}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="badge bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider w-fit">{dest.tag}</span>
                          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {dest.rating || "New"}
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
                        {dest.name}
                      </h3>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{dest.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between pt-5 border-t border-border/60 mt-auto">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Average Cost</div>
                        <span className="text-lg font-bold text-foreground">{dest.price}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="card empty-state">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Compass size={26} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No places found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery
                ? `We couldn't find anything for "${searchQuery}". Try a different city.`
                : "No results yet. Try searching for a destination."}
            </p>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlace(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-3xl overflow-hidden shadow-2xl border border-border max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted-foreground hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              
              <div className="p-8 sm:p-10 overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                    {selectedPlace.category === 'Attraction' ? <Umbrella size={28} /> : 
                     selectedPlace.category === 'Dining' ? <Coffee size={28} /> : 
                     selectedPlace.category === 'Stay' ? <Mountain size={28} /> : 
                     <Compass size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-primary uppercase tracking-wider">{selectedPlace.tag}</span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">{selectedPlace.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      {selectedPlace.rating || "New"}
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4 leading-tight">
                  {selectedPlace.name}
                </h2>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8">
                  <MapPin size={16} className="text-primary" />
                  <span className="leading-relaxed">{selectedPlace.location}</span>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 mb-8 border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" /> Why visit?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedPlace.desc}</p>
                </div>

                {selectedPlace.highlights?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.highlights.map((h: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-medium capitalize shadow-sm text-foreground">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Average Cost</div>
                    <div className="text-3xl font-bold text-foreground">{selectedPlace.price}</div>
                  </div>
                  <button
                    onClick={() => handlePlanTrip(selectedPlace)}
                    disabled={isPlanning}
                    className="btn btn-primary h-14 px-8 text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isPlanning ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                    Plan a trip here
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
