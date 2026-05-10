"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Star, 
  Filter, 
  ArrowRight,
  TrendingUp,
  Compass
} from "lucide-react";

export default function CitySearchPage() {
  const cities = [
    { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop", rating: 4.8, reviews: 2450, price: "$$$" },
    { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop", rating: 4.9, reviews: 3120, price: "$$$$" },
    { name: "Rome, Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop", rating: 4.7, reviews: 1890, price: "$$" },
    { name: "New York, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop", rating: 4.6, reviews: 5400, price: "$$$$" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Your Next Destination</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Search from thousands of cities and activities across the globe.
        </p>
      </header>

      <div className="flex gap-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
          <input 
            type="text" 
            placeholder="Search city, country, or landmark..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cities.map((city, idx) => (
          <motion.div 
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative h-72 rounded-3xl overflow-hidden mb-4 shadow-xl">
              <img 
                src={city.image} 
                alt={city.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold mb-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {city.rating} ({city.reviews})
                  </div>
                  <h3 className="text-xl font-bold">{city.name}</h3>
                </div>
                <div className="text-lg font-bold">{city.price}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Trending Collections</h2>
            <p className="text-muted-foreground">Handpicked destinations for your style.</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-1 hover:underline">
            View all <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CollectionCard title="Tropical Paradise" count={42} icon={<Compass className="text-teal-400" />} />
          <CollectionCard title="City Nightlife" count={28} icon={<TrendingUp className="text-purple-400" />} />
          <CollectionCard title="Historic Europe" count={35} icon={<MapPin className="text-orange-400" />} />
        </div>
      </section>
    </div>
  );
}

function CollectionCard({ title, count, icon }: { title: string, count: number, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-3xl border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center gap-6 group">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm text-muted-foreground">{count} destinations</p>
      </div>
    </div>
  );
}
