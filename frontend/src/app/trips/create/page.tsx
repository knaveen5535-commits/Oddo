"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  Plus, 
  ChevronRight,
  Info,
  Type,
  Loader2
} from "lucide-react";

export default function CreateTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/trips");
    }, 1500);
  };

  const regions = [
    { name: "Europe", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=400&auto=format&fit=crop" },
    { name: "Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop" },
    { name: "America", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=400&auto=format&fit=crop" },
    { name: "Africa", image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Plan Your Next Trip</h1>
        <p className="text-muted-foreground">Fill in the details to start your journey.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Trip Form - Screen 4 */}
        <section className="lg:col-span-2 glass-card p-8 rounded-[32px] border-white/10 space-y-6 bg-white/[0.02]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">Trip Name</label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
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
                    type="text" 
                    placeholder="Where are you going?"
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
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium text-white/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">End Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      required
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium text-white/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest text-[10px]">Description</label>
                <textarea 
                  placeholder="What's the plan?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Trip...
                </>
              ) : (
                <>
                  Create Trip
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Region Selections - Screen 4 Alignment */}
        <section className="space-y-6">
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
                  <span className="text-white font-bold text-xs uppercase tracking-widest">{region.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-8 glass-card rounded-[32px] border-white/10 flex items-center gap-5 bg-primary/5">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-inner">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Need help?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Check out our trending destinations for inspiration.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
