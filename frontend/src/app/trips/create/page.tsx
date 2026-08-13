"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Plus,
  ChevronRight,
  Type,
  Loader2,
  Star,
  Compass,
  Utensils,
  Hotel,
  Activity,
  Check,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function CreateTripPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [suggestedPlan, setSuggestedPlan] = useState<any>(null);
  const [planVariant, setPlanVariant] = useState(0);
  const [cityImage, setCityImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Authentication Required: Please login to sync your voyage data.");
      router.push("/login");
      return;
    }

    const destStr = formData.location.toLowerCase();
    const foreignKeywords = ["paris", "london", "new york", "dubai", "tokyo", "singapore", "bali", "maldives", "rome", "sydney", "europe", "usa", "america", "africa", "australia"];
    if (foreignKeywords.some(kw => destStr.includes(kw)) && !destStr.includes("india")) {
      alert("We currently specialize in Indian destinations. Please search for a place within India.");
      return;
    }

    const searchDestination = destStr.includes("india") ? formData.location : `${formData.location}, India`;

    setIsLoading(true);

    try {
      const response = await api.post("/trips", {
        ...formData,
        destination: searchDestination,
      });

      const result = response.data;

      if (result.success) {
        const fetchedRecs = result.recommendations || result.data?.recommendations;
        setRecommendations(fetchedRecs);
        setCityImage(result.cityImage || result.data?.coverImage);
        generateSuggestedPlan(formData.location, 0, fetchedRecs);

        setTimeout(() => {
          document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPlan = () => {
    router.push("/trips");
  };

  const handleBackToPlanning = () => {
    setRecommendations(null);
    setSuggestedPlan(null);
    setCityImage(null);
  };

  const handleChooseAnother = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextVariant = planVariant + 1;
      setPlanVariant(nextVariant);
      generateSuggestedPlan(formData.location, nextVariant, recommendations);
      setIsLoading(false);
      document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  const generateSuggestedPlan = (location: string, variant: number, recs?: any) => {
    if (recs && (recs.attractions?.length || recs.restaurants?.length || recs.activities?.length)) {
      const allAttractions = recs.attractions || [];
      const allRestaurants = recs.restaurants || [];
      const allActivities = recs.activities || [];
      
      const safeGet = (arr: any[], index: number, fallback: string, type: string) => {
        // Use variant to cycle through items if user clicks "Another plan"
        const offsetIndex = (index + (variant * 3)) % Math.max(arr.length, 1);
        if (arr.length > offsetIndex) return { title: arr[offsetIndex].name, type: arr[offsetIndex].type?.[0] || type };
        return { title: fallback, type };
      };

      setSuggestedPlan({
        title: formData.title || `Trip to ${location}`,
        location,
        days: [
          { 
            day: 1, 
            title: "Arrival & Exploration", 
            activities: [
              { time: "10:00 AM", ...safeGet(allAttractions, 0, `Explore Central ${location}`, "Sightseeing") }, 
              { time: "01:30 PM", ...safeGet(allRestaurants, 0, "Traditional Local Lunch", "Food") }, 
              { time: "04:00 PM", ...safeGet(allActivities, 0, "Cultural Visit", "Activity") }
            ] 
          },
          { 
            day: 2, 
            title: "Discovering Hidden Gems", 
            activities: [
              { time: "09:00 AM", ...safeGet(allActivities, 1, "Scenic Tour", "Activity") }, 
              { time: "01:00 PM", ...safeGet(allRestaurants, 1, "Famous Local Eatery", "Food") }, 
              { time: "03:30 PM", ...safeGet(allAttractions, 1, "Market Exploration", "Shopping") }
            ] 
          },
          { 
            day: 3, 
            title: "Relax & Reflect", 
            activities: [
              { time: "10:30 AM", ...safeGet(allAttractions, 2, "Morning Wellness", "Relax") }, 
              { time: "02:00 PM", ...safeGet(allActivities, 2, "Leisure Activity", "Activity") }, 
              { time: "07:30 PM", ...safeGet(allRestaurants, 2, "Farewell Dinner", "Food") }
            ] 
          },
        ],
      });
      return;
    }

    // Fallback to static variants if no API data is available
    const variants = [
      {
        title: "The Classic Discovery",
        days: [
          { day: 1, title: "Discovery Day", activities: [{ time: "09:00 AM", title: `Explore Central ${location}`, type: "Sightseeing" }, { time: "01:00 PM", title: "Traditional Local Lunch", type: "Food" }, { time: "04:00 PM", title: "Cultural Museum Visit", type: "Education" }] },
          { day: 2, title: "Adventure & Nature", activities: [{ time: "08:30 AM", title: "Scenic Nature Hike", type: "Activity" }, { time: "12:30 PM", title: "Picnic with a View", type: "Food" }, { time: "03:00 PM", title: "Local Market Exploration", type: "Shopping" }] },
          { day: 3, title: "Relaxation", activities: [{ time: "10:00 AM", title: "Morning Wellness/Spa", type: "Relax" }, { time: "02:00 PM", title: "Hidden Gem Discovery", type: "Activity" }, { time: "07:00 PM", title: "Grand Farewell Dinner", type: "Food" }] },
        ],
      },
      {
        title: "The Luxury Escape",
        days: [
          { day: 1, title: "High-End Arrival", activities: [{ time: "10:00 AM", title: `Private Tour of ${location}`, type: "Luxury" }, { time: "01:00 PM", title: "Michelin Star Lunch", type: "Food" }, { time: "04:00 PM", title: "Exclusive Gallery Access", type: "Culture" }] },
          { day: 2, title: "Yacht & Sea", activities: [{ time: "09:00 AM", title: "Private Boat Charter", type: "Activity" }, { time: "01:00 PM", title: "Seafood on the Deck", type: "Food" }, { time: "05:00 PM", title: "Sunset Cocktails", type: "Leisure" }] },
          { day: 3, title: "Premium Relax", activities: [{ time: "11:00 AM", title: "Elite Spa Treatment", type: "Wellness" }, { time: "03:00 PM", title: "VIP Shopping Session", type: "Shopping" }, { time: "08:00 PM", title: "Private Chef Dinner", type: "Food" }] },
        ],
      },
    ];

    const selected = variants[variant % variants.length];
    setSuggestedPlan({ ...selected, location });
  };

  const regions = [
    { name: "Europe", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=400&auto=format&fit=crop" },
    { name: "Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop" },
    { name: "America", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=400&auto=format&fit=crop" },
    { name: "Africa", image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <div className="space-y-10">
      <div className="page-header">
        <div>
          <h1 className="page-title">Plan Your Next Trip</h1>
          <p className="page-subtitle">Fill in the details to start your journey.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!(recommendations || suggestedPlan) && (
          <motion.div
            key="planning-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, display: "none" }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Trip Form */}
            <section className="lg:col-span-2 card overflow-hidden border border-border/40 shadow-xl shadow-primary/5 transition-all duration-500">
          {/* Premium Header for the Form */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 border-b border-border/50 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground relative z-10">Create Your Itinerary</h2>
            <p className="text-sm text-muted-foreground mt-1 relative z-10">Let our AI build the perfect travel experience based on your preferences.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7 bg-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="field sm:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-2 block">Trip name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Type size={18} />
                  </div>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    type="text"
                    placeholder="e.g. Summer in Maldives"
                    className="w-full bg-muted/40 border border-border text-foreground rounded-2xl pl-11 pr-4 py-3.5 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none placeholder:text-muted-foreground/60 shadow-sm"
                  />
                </div>
              </div>

              <div className="field sm:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-2 block">Destination</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    type="text"
                    placeholder="e.g. Goa, Jaipur, Kerala (India only)"
                    className="w-full bg-muted/40 border border-border text-foreground rounded-2xl pl-11 pr-4 py-3.5 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none placeholder:text-muted-foreground/60 shadow-sm"
                  />
                </div>
              </div>

              <div className="field">
                <label className="text-sm font-semibold text-foreground mb-2 block">Start date</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Calendar size={18} />
                  </div>
                  <input
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    type="date"
                    className="w-full bg-muted/40 border border-border text-foreground rounded-2xl pl-11 pr-4 py-3.5 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none shadow-sm appearance-none"
                  />
                </div>
              </div>

              <div className="field">
                <label className="text-sm font-semibold text-foreground mb-2 block">End date</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Calendar size={18} />
                  </div>
                  <input
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    type="date"
                    className="w-full bg-muted/40 border border-border text-foreground rounded-2xl pl-11 pr-4 py-3.5 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none shadow-sm appearance-none"
                  />
                </div>
              </div>

              <div className="field sm:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's the plan? e.g. Exploring historical sites, trying street food, relaxing at the beach..."
                  rows={4}
                  className="w-full bg-muted/40 border border-border text-foreground rounded-2xl px-4 py-3.5 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none placeholder:text-muted-foreground/60 shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary h-14 text-base rounded-2xl flex-1 shadow-primary/25 shadow-lg group hover:-translate-y-0.5 transition-transform"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing destination...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Generate AI Itinerary
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/trips")}
                className="btn btn-outline h-14 px-8 text-base rounded-2xl hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        {/* Region Selections */}
        {/* <section
          className={`space-y-5 transition-opacity ${
            recommendations ? "opacity-40 pointer-events-none select-none" : "opacity-100"
          }`}
        >
          <div>
            <h3 className="section-title">Regional selections</h3>
            <p className="text-sm text-muted-foreground">Popular places to start.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {regions.map((region) => (
              <motion.div
                key={region.name}
                whileHover={{ y: -3 }}
                onClick={() => setFormData({ ...formData, location: region.name })}
                className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group border border-border"
              >
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-primary/60 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                  {region.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations & Suggested Plan */}
      <AnimatePresence mode="wait">
        {(recommendations || suggestedPlan) && (
          <motion.div
            id="recommendations"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-8"
          >
            {/* Top Actions */}
            <div className="flex items-center justify-between w-full">
              <button 
                onClick={handleBackToPlanning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border/40 bg-card shadow-sm"
              >
                <ArrowLeft size={16} />
                Back to Planning
              </button>

              <button 
                onClick={() => router.push("/trips")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 transition-colors border border-danger/20 bg-card shadow-sm"
              >
                Cancel Trip
              </button>
            </div>

            {/* Destination Banner */}
            <section className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-border">
              {cityImage ? (
                <img src={cityImage} className="w-full h-full object-cover" alt="Destination" />
              ) : (
                <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
                  <Compass size={48} className="text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="badge bg-white/90 text-slate-900 backdrop-blur mb-3">
                    <Sparkles size={12} />
                    AI-curated plan
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                    {formData.location}
                  </h2>
                  <p className="text-white/80 mt-2 max-w-xl">
                    {suggestedPlan?.title || "Personalized itinerary"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleConfirmPlan}
                    className="btn btn-primary btn-lg"
                  >
                    <Check size={18} />
                    Confirm plan
                  </button>
                  <button
                    onClick={handleChooseAnother}
                    className="btn btn-lg bg-white/15 text-white border border-white/25 hover:bg-white/25"
                  >
                    <RefreshCw size={18} />
                    Another plan
                  </button>
                </div>
              </div>
            </section>

            {/* Suggested 3-Day Plan */}
            {suggestedPlan && (
              <section>
                <div className="section-heading mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Handpicked Itinerary</h3>
                    <p className="text-sm text-muted-foreground">Premium day-by-day experience for {formData.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {suggestedPlan.days.map((dayPlan: any, idx: number) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="group relative rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      {/* Premium Header */}
                      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/10 via-card to-background z-0" />
                      <div className="relative z-10 p-6 sm:p-8">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Day {dayPlan.day}</span>
                            <h4 className="text-xl sm:text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">{dayPlan.title}</h4>
                          </div>
                          <span className="text-5xl font-black text-primary/5 group-hover:text-primary/10 transition-colors duration-300 -mt-2 -mr-2">0{dayPlan.day}</span>
                        </div>
                        
                        {/* Activities Timeline */}
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
                          {dayPlan.activities.map((act: any, aIdx: number) => (
                            <div key={aIdx} className="relative pl-8 group/item hover:-translate-y-1 transition-transform duration-300">
                              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background bg-primary shadow-sm group-hover/item:scale-110 transition-transform" />
                              <div className="bg-muted/30 rounded-2xl p-4 border border-border/40 group-hover/item:border-primary/20 group-hover/item:bg-primary/5 transition-all">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background text-[10px] font-bold text-primary mb-2 shadow-sm uppercase tracking-wider">
                                  {act.time}
                                </div>
                                <div className="text-base font-semibold text-foreground mb-1 group-hover/item:text-primary transition-colors">{act.title}</div>
                                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                                  {act.type}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations */}
            {recommendations && (
              <div className="space-y-12 pt-8 border-t border-border">
                <RecommendationGroup
                  title="Top sightseeing & attractions"
                  data={recommendations.attractions}
                  icon={<Compass className="text-primary" size={18} />}
                />
                <RecommendationGroup
                  title="Must-visit local eateries"
                  data={recommendations.restaurants}
                  icon={<Utensils className="text-primary" size={18} />}
                />
                <RecommendationGroup
                  title="Luxury & comfort hotels"
                  data={recommendations.hotels}
                  icon={<Hotel className="text-primary" size={18} />}
                />
                <RecommendationGroup
                  title="Handpicked experiences"
                  data={recommendations.activities}
                  icon={<Activity className="text-primary" size={18} />}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecommendationGroup({ title, data, icon }: { title: string; data: any[]; icon: React.ReactNode }) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="section-heading">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</div>
        <h3 className="section-title">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((place: any, idx: number) => (
          <motion.div
            key={place.place_id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card overflow-hidden card-hover flex flex-col"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 right-3 badge bg-black/60 text-white backdrop-blur">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {place.rating}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {place.name}
              </h4>
              <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-4">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{place.address}</span>
              </div>
              <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-foreground capitalize">
                  {place.type?.[0]?.replace(/_/g, " ")}
                </span>
                <button className="text-sm font-medium text-primary inline-flex items-center gap-1">
                  View on map <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
