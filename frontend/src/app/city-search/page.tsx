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
  Navigation,
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
            ...(result.data.activities || []),
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
        if (Array.isArray(result.data.activities))
          result.data.activities.forEach((p: any) => allPlaces.push({ ...p, catLabel: "Activity", tag: "Experience" }));
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
    { name: "Activity", icon: <Navigation size={16} /> },
    { name: "Stay", icon: <Mountain size={16} /> },
  ];

  const filteredDestinations =
    activeCategory === "All" ? searchResults : searchResults.filter((d) => d.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover"
          alt="Explore destinations"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <span className="badge bg-white/15 text-white backdrop-blur mb-4">
              <Sparkles size={13} />
              Discover the world
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
              Explore the world's beauty
            </h1>
            <p className="text-white/75 mb-6 hidden sm:block">
              Search any city to find attractions, dining, activities, and stays.
            </p>

            <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-2xl">
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
                placeholder="Enter a city to find attractions..."
                className="flex-1 bg-transparent border-none text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:ring-0 px-2 py-2.5"
              />
              <button type="submit" className="btn btn-primary btn-sm sm:btn-lg rounded-xl">
                <span className="hidden sm:inline">Search</span>
                <Search size={16} className="sm:hidden" />
              </button>
            </form>
          </motion.div>
        </div>
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
                  <div className="card overflow-hidden card-hover flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallbacks = [
                            "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
                            "https://images.unsplash.com/photo-1548013146-72479768bbaa",
                            "https://images.unsplash.com/photo-1506461883276-594a12b11cf3",
                            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
                            "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                          ];
                          const hash = dest.name
                            .split("")
                            .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                          target.src = `${fallbacks[hash % fallbacks.length]}?q=80&w=1200&auto=format&fit=crop`;
                        }}
                      />
                      <span className="absolute top-3 left-3 badge bg-white/90 text-slate-900 backdrop-blur">
                        {dest.tag}
                      </span>
                      <button
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-600 hover:text-danger transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Save"
                      >
                        <Heart size={16} />
                      </button>
                      <div className="absolute bottom-3 left-3 badge bg-black/50 text-white backdrop-blur">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {dest.rating || "N/A"}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground leading-snug mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 line-clamp-1">
                        <MapPin size={14} className="text-primary shrink-0" />
                        <span className="truncate">{dest.location}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm font-semibold text-foreground">{dest.price}</span>
                        <span className="text-xs badge badge-primary">{dest.category}</span>
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
              className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="w-full md:w-2/5 h-52 md:h-auto relative overflow-hidden shrink-0">
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-primary">{selectedPlace.tag}</span>
                  <span className="text-xs text-muted-foreground">{selectedPlace.category}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
                  {selectedPlace.name}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-primary" />
                    {selectedPlace.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                    {selectedPlace.rating || "N/A"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{selectedPlace.desc}</p>

                {selectedPlace.highlights?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.highlights.map((h: string, i: number) => (
                        <span key={i} className="chip capitalize">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">Price estimate</div>
                    <div className="text-2xl font-bold text-foreground">{selectedPlace.price}</div>
                  </div>
                  <button
                    onClick={() => handlePlanTrip(selectedPlace)}
                    disabled={isPlanning}
                    className="btn btn-primary btn-lg"
                  >
                    {isPlanning ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
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
