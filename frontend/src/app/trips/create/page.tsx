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

    setIsLoading(true);

    try {
      const response = await api.post("/trips", {
        ...formData,
        destination: formData.location,
      });

      const result = response.data;

      if (result.success) {
        setRecommendations(result.recommendations || result.data?.recommendations);
        setCityImage(result.cityImage || result.data?.coverImage);
        generateSuggestedPlan(formData.location, 0);

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

  const handleChooseAnother = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextVariant = planVariant + 1;
      setPlanVariant(nextVariant);
      generateSuggestedPlan(formData.location, nextVariant);
      setIsLoading(false);
      document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  const generateSuggestedPlan = (location: string, variant: number) => {
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
      {
        title: "The Local Soul",
        days: [
          { day: 1, title: "Street Food & Vibes", activities: [{ time: "09:00 AM", title: `Walk through ${location} Backstreets`, type: "Explore" }, { time: "12:00 PM", title: "Famous Street Food stall", type: "Food" }, { time: "03:00 PM", title: "Meet Local Artisans", type: "Activity" }] },
          { day: 2, title: "Hidden Gems", activities: [{ time: "08:00 AM", title: "Secret Viewpoint Hike", type: "Nature" }, { time: "01:00 PM", title: "Lunch with a Local Family", type: "Culture" }, { time: "04:00 PM", title: "Untouched Temple/Site", type: "Discovery" }] },
          { day: 3, title: "Art & Night", activities: [{ time: "10:00 AM", title: "Local Art Workshop", type: "Creative" }, { time: "02:00 PM", title: "Flea Market Hunting", type: "Shopping" }, { time: "09:00 PM", title: "Live Local Music Club", type: "Nightlife" }] },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip Form */}
        <section
          className={`lg:col-span-2 card card-pad transition-opacity ${
            recommendations ? "opacity-50 pointer-events-none select-none" : "opacity-100"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="field sm:col-span-2">
                <label className="label">Trip name</label>
                <div className="relative">
                  <Type className="input-icon" />
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    type="text"
                    placeholder="e.g. Summer in Maldives"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div className="field sm:col-span-2">
                <label className="label">Destination</label>
                <div className="relative">
                  <MapPin className="input-icon" />
                  <input
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    type="text"
                    placeholder="e.g. Paris, Tokyo, Goa"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Start date</label>
                <div className="relative">
                  <Calendar className="input-icon" />
                  <input
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    type="date"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">End date</label>
                <div className="relative">
                  <Calendar className="input-icon" />
                  <input
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    type="date"
                    className="input has-icon"
                  />
                </div>
              </div>

              <div className="field sm:col-span-2">
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's the plan?"
                  rows={4}
                  className="textarea"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing destination...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Create trip & get recommendations
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/trips")}
                className="btn btn-outline btn-lg"
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
      </div>

      {/* Recommendations & Suggested Plan */}
      <AnimatePresence mode="wait">
        {(recommendations || suggestedPlan) && (
          <motion.div
            id="recommendations"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
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
                <div className="section-heading">
                  <Calendar size={18} className="text-primary" />
                  <h3 className="section-title">Handpicked itinerary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {suggestedPlan.days.map((dayPlan: any, idx: number) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="card card-pad card-hover"
                    >
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-3xl font-bold text-primary/20">0{dayPlan.day}</span>
                        <h4 className="font-semibold text-foreground">{dayPlan.title}</h4>
                      </div>
                      <div className="space-y-4 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                        {dayPlan.activities.map((act: any, aIdx: number) => (
                          <div key={aIdx} className="relative pl-6">
                            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-primary bg-card" />
                            <div className="text-xs font-semibold text-primary">{act.time}</div>
                            <div className="text-sm font-medium text-foreground">{act.title}</div>
                            <div className="text-xs text-muted-foreground">{act.type}</div>
                          </div>
                        ))}
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
