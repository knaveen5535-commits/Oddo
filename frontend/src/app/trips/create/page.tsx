"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  Plus, 
  ChevronRight,
  Info,
  Type,
  Loader2,
  Star,
  Compass,
  Utensils,
  Hotel,
  Activity,
  Check,
  RefreshCw,
  ArrowRight
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
    description: ""
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
      const response = await api.post('/trips', {
        ...formData,
        destination: formData.location
      });

      const result = response.data;
      
      if (result.success) {
        setRecommendations(result.recommendations || result.data?.recommendations);
        setCityImage(result.cityImage || result.data?.coverImage);
        generateSuggestedPlan(formData.location, 0);
        
        setTimeout(() => {
          document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
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
      document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  const generateSuggestedPlan = (location: string, variant: number) => {
    const variants = [
      {
        title: "The Classic Discovery",
        days: [
          { day: 1, title: "Discovery Day", activities: [{ time: "09:00 AM", title: `Explore Central ${location}`, type: "Sightseeing" }, { time: "01:00 PM", title: "Traditional Local Lunch", type: "Food" }, { time: "04:00 PM", title: "Cultural Museum Visit", type: "Education" }] },
          { day: 2, title: "Adventure & Nature", activities: [{ time: "08:30 AM", title: "Scenic Nature Hike", type: "Activity" }, { time: "12:30 PM", title: "Picnic with a View", type: "Food" }, { time: "03:00 PM", title: "Local Market Exploration", type: "Shopping" }] },
          { day: 3, title: "Relaxation", activities: [{ time: "10:00 AM", title: "Morning Wellness/Spa", type: "Relax" }, { time: "02:00 PM", title: "Hidden Gem Discovery", type: "Activity" }, { time: "07:00 PM", title: "Grand Farewell Dinner", type: "Food" }] }
        ]
      },
      {
        title: "The Luxury Escape",
        days: [
          { day: 1, title: "High-End Arrival", activities: [{ time: "10:00 AM", title: `Private Tour of ${location}`, type: "Luxury" }, { time: "01:00 PM", title: "Michelin Star Lunch", type: "Food" }, { time: "04:00 PM", title: "Exclusive Gallery Access", type: "Culture" }] },
          { day: 2, title: "Yacht & Sea", activities: [{ time: "09:00 AM", title: "Private Boat Charter", type: "Activity" }, { time: "01:00 PM", title: "Seafood on the Deck", type: "Food" }, { time: "05:00 PM", title: "Sunset Cocktails", type: "Leisure" }] },
          { day: 3, title: "Premium Relax", activities: [{ time: "11:00 AM", title: "Elite Spa Treatment", type: "Wellness" }, { time: "03:00 PM", title: "VIP Shopping Session", type: "Shopping" }, { time: "08:00 PM", title: "Private Chef Dinner", type: "Food" }] }
        ]
      },
      {
        title: "The Local Soul",
        days: [
          { day: 1, title: "Street Food & Vibes", activities: [{ time: "09:00 AM", title: `Walk through ${location} Backstreets`, type: "Explore" }, { time: "12:00 PM", title: "Famous Street Food stall", type: "Food" }, { time: "03:00 PM", title: "Meet Local Artisans", type: "Activity" }] },
          { day: 2, title: "Hidden Gems", activities: [{ time: "08:00 AM", title: "Secret Viewpoint Hike", type: "Nature" }, { time: "01:00 PM", title: "Lunch with a Local Family", type: "Culture" }, { time: "04:00 PM", title: "Untouched Temple/Site", type: "Discovery" }] },
          { day: 3, title: "Art & Night", activities: [{ time: "10:00 AM", title: "Local Art Workshop", type: "Creative" }, { time: "02:00 PM", title: "Flea Market Hunting", type: "Shopping" }, { time: "09:00 PM", title: "Live Local Music Club", type: "Nightlife" }] }
        ]
      }
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
    <div className="px-4 sm:px-10 w-full pb-32">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Plan Your Next Trip</h1>
        <p className="text-muted-foreground">Fill in the details to start your journey.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Trip Form */}
        <section className={`lg:col-span-2 glass-card p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border-white/10 space-y-6 bg-white/[0.02] transition-all ${recommendations ? 'opacity-50 pointer-events-none scale-95' : 'opacity-100'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">Trip Name</label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    type="text" 
                    placeholder="e.g. Summer in Maldives"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    type="text" 
                    placeholder="e.g. Paris, Tokyo, Goa"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">Start Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium text-foreground/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">End Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium text-foreground/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What's the plan?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_rgba(244,63,94,0.3)] flex items-center justify-center gap-3 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Destination...
                </>
              ) : (
                <>
                  Create Trip & Get Recommendations
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Region Selections */}
        <section className={`space-y-6 transition-all ${recommendations ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-xl font-bold px-1 tracking-tight">Regional Selections</h3>
          <div className="grid grid-cols-2 gap-4">
            {regions.map((region) => (
              <motion.div 
                key={region.name}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative h-32 rounded-2xl overflow-hidden cursor-pointer group border border-white/5 shadow-xl"
              >
                <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                  <span className="text-foreground font-bold text-xs uppercase tracking-widest">{region.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Recommendations & Suggested Plan */}
      <AnimatePresence mode="wait">
        {(recommendations || suggestedPlan) && (
          <motion.div 
            id="recommendations"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-24 space-y-24"
          >
            {/* Immersive Destination Banner */}
            <section className="relative h-[320px] sm:h-[500px] w-full rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl group">
               {cityImage ? (
                 <img src={cityImage} className="w-full h-full object-cover" alt="Destination" />
               ) : (
                 <div className="w-full h-full bg-white/5 animate-pulse flex items-center justify-center">
                    <Compass size={64} className="text-foreground/10" />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/20 to-transparent" />
               <div className="absolute bottom-6 left-4 right-4 sm:bottom-12 sm:left-12 sm:right-12 flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="px-4 py-1 bg-primary/20 backdrop-blur-md rounded-full text-xs font-black text-primary border border-primary/30 uppercase tracking-widest">
                          New Journey
                       </span>
                    </div>
                    <h2 className="text-4xl sm:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                       {formData.location}
                    </h2>
                    <p className="text-foreground/60 text-base sm:text-xl font-medium max-w-xl italic">
                       "{suggestedPlan?.title || 'Personalized Itinerary'}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button 
                      onClick={handleConfirmPlan}
                      className="px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
                    >
                      <Check size={24} />
                      OK, Create Trip
                    </button>
                    <button 
                      onClick={handleChooseAnother}
                      className="px-6 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-md text-foreground font-black rounded-2xl border border-white/20 flex items-center justify-center gap-3 transition-all hover:bg-white/20 active:scale-95 group"
                    >
                      <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                      Another Plan
                    </button>
                  </div>
               </div>
            </section>

            {/* Suggested 3-Day Plan */}
            {suggestedPlan && (
              <section className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">Handpicked Itinerary</h3>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {suggestedPlan.days.map((dayPlan: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="glass-card p-8 rounded-[32px] border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden group"
                    >
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-4xl font-black text-primary/20">0{dayPlan.day}</span>
                        <h4 className="text-xl font-bold">{dayPlan.title}</h4>
                      </div>
                      <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                        {dayPlan.activities.map((act: any, aIdx: number) => (
                          <div key={aIdx} className="relative pl-6">
                            <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-background z-10" />
                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{act.time}</div>
                            <div className="text-sm font-bold text-foreground/90">{act.title}</div>
                            <div className="text-[9px] text-muted-foreground uppercase font-bold mt-1 tracking-tighter">{act.type}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Google Places Recommendations */}
            {recommendations && (
              <div className="space-y-24 pt-12 border-t border-white/5">
                <RecommendationGroup title="Top Sightseeing & Attractions" data={recommendations.attractions} icon={<Compass className="text-primary" />} />
                <RecommendationGroup title="Must-Visit Local Eateries" data={recommendations.restaurants} icon={<Utensils className="text-rose-400" />} />
                <RecommendationGroup title="Luxury & Comfort Hotels" data={recommendations.hotels} icon={<Hotel className="text-slate-400" />} />
                <RecommendationGroup title="Handpicked Experiences" data={recommendations.activities} icon={<Activity className="text-slate-400" />} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecommendationGroup({ title, data, icon }: { title: string, data: any[], icon: React.ReactNode }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
          {icon}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((place: any, idx: number) => (
          <motion.div 
            key={place.place_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-[32px] overflow-hidden border-white/5 hover:border-primary/30 transition-all h-[420px] flex flex-col shadow-xl"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5 text-xs font-bold border border-white/10">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                {place.rating}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{place.name}</h4>
              <div className="flex items-start gap-2 text-muted-foreground mb-4">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm line-clamp-2">{place.address}</span>
              </div>
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{place.type[0]?.replace(/_/g, ' ')}</span>
                <button className="text-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View on Map <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
