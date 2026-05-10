"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  ChevronRight, 
  MoreVertical,
  Navigation,
  Info,
  Coffee,
  Plane,
  Camera,
  Utensils,
  Moon
} from "lucide-react";

const TRIP_DATA: Record<string, any> = {
  "1": {
    title: "Maldives Summer Escape",
    location: "Maldives",
    banner: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=2000&auto=format&fit=crop",
    summary: "A week-long tropical getaway featuring diving, island hopping, and relaxation at a luxury resort in the heart of the Indian Ocean.",
    days: [
      [
        { time: "09:00 AM", title: "Arrival at Male Airport", location: "Male", type: "Transport", icon: <Plane size={14} /> },
        { time: "11:30 AM", title: "Speedboat to Resort", location: "Maafushi", type: "Transport", icon: <Navigation size={14} /> },
        { time: "01:00 PM", title: "Luxury Lunch by the Sea", location: "Ocean Grill", type: "Food", icon: <Utensils size={14} /> },
        { time: "04:00 PM", title: "Snorkeling at House Reef", location: "Resort Lagoon", type: "Activity", icon: <Camera size={14} /> },
      ],
      [
        { time: "08:30 AM", title: "Floating Breakfast", location: "Private Villa", type: "Food", icon: <Coffee size={14} /> },
        { time: "10:00 AM", title: "Scuba Diving Session", location: "Banana Reef", type: "Activity", icon: <Camera size={14} /> },
        { time: "02:00 PM", title: "Local Island Tour", location: "Gulhi Island", type: "Leisure", icon: <MapPin size={14} /> },
        { time: "07:30 PM", title: "Starlit Beach Dinner", location: "North Beach", type: "Food", icon: <Moon size={14} /> },
      ],
      [
        { time: "09:00 AM", title: "Yoga at Sunrise", location: "Yoga Pavilion", type: "Leisure", icon: <Camera size={14} /> },
        { time: "12:00 PM", title: "Dolphin Watching Cruise", location: "Indian Ocean", type: "Activity", icon: <Navigation size={14} /> },
        { time: "03:30 PM", title: "Spa & Wellness Session", location: "Island Spa", type: "Leisure", icon: <Coffee size={14} /> },
        { time: "06:00 PM", title: "Sunset Photo Session", location: "Overwater Jetty", type: "Activity", icon: <Camera size={14} /> },
      ]
    ]
  },
  "2": {
    title: "Tokyo Neon Nights",
    location: "Tokyo, Japan",
    banner: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop",
    summary: "Experience the vibrant energy of Tokyo, from futuristic Shibuya to the historic temples of Asakusa and world-class sushi.",
    days: [
      [
        { time: "10:00 AM", title: "Shibuya Crossing Visit", location: "Shibuya", type: "Leisure", icon: <Navigation size={14} /> },
        { time: "12:30 PM", title: "Ramen Lunch", location: "Ichiran Shibuya", type: "Food", icon: <Utensils size={14} /> },
        { time: "03:00 PM", title: "Harajuku Street Style", location: "Takeshita Street", type: "Activity", icon: <Camera size={14} /> },
        { time: "07:00 PM", title: "Robot Restaurant Show", location: "Shinjuku", type: "Activity", icon: <Camera size={14} /> },
      ],
      [
        { time: "05:00 AM", title: "Tsukiji Fish Market", location: "Tsukiji", type: "Activity", icon: <Plane size={14} /> },
        { time: "08:00 AM", title: "Fresh Sushi Breakfast", location: "Sushi Dai", type: "Food", icon: <Utensils size={14} /> },
        { time: "11:00 AM", title: "TeamLab Borderless", location: "Odaiba", type: "Activity", icon: <Camera size={14} /> },
        { time: "04:00 PM", title: "Akihabara Tech Tour", location: "Electric Town", type: "Leisure", icon: <Navigation size={14} /> },
      ],
      [
        { time: "09:00 AM", title: "Senso-ji Temple", location: "Asakusa", type: "Leisure", icon: <MapPin size={14} /> },
        { time: "12:00 PM", title: "Traditional Tea Ceremony", location: "Ueno Park", type: "Activity", icon: <Utensils size={14} /> },
        { time: "03:00 PM", title: "Tokyo Skytree Views", location: "Sumida", type: "Leisure", icon: <Camera size={14} /> },
        { time: "08:00 PM", title: "Golden Gai Bar Hopping", location: "Shinjuku", type: "Activity", icon: <Utensils size={14} /> },
      ]
    ]
  },
  "3": {
    title: "Santorini Sunset Bliss",
    location: "Greece",
    banner: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop",
    summary: "Breathtaking views of the caldera, whitewashed villages, and the world's most famous sunsets in the heart of the Cyclades.",
    days: [
      [
        { time: "11:00 AM", title: "Arrival in Fira", location: "Fira Port", type: "Transport", icon: <Plane size={14} /> },
        { time: "01:30 PM", title: "Greek Meze Lunch", location: "Oink Oink", type: "Food", icon: <Utensils size={14} /> },
        { time: "04:00 PM", title: "Explore Oia Village", location: "Oia", type: "Leisure", icon: <Camera size={14} /> },
        { time: "07:30 PM", title: "First Sunset View", location: "Byzantine Castle", type: "Activity", icon: <Moon size={14} /> },
      ],
      [
        { time: "09:00 AM", title: "Red Beach Hike", location: "Akrotiri", type: "Activity", icon: <Navigation size={14} /> },
        { time: "12:00 PM", title: "Wine Tasting Tour", location: "Santo Wines", type: "Leisure", icon: <Utensils size={14} /> },
        { time: "03:00 PM", title: "Caldera Boat Cruise", location: "Amoudi Bay", type: "Activity", icon: <Navigation size={14} /> },
        { time: "06:00 PM", title: "Volcano Hot Springs", location: "Palea Kameni", type: "Activity", icon: <Camera size={14} /> },
      ],
      [
        { time: "10:00 AM", title: "Ancient Thera Visit", location: "Kamari", type: "Leisure", icon: <MapPin size={14} /> },
        { time: "01:00 PM", title: "Seafood Feast", location: "Perivolos Beach", type: "Food", icon: <Utensils size={14} /> },
        { time: "04:00 PM", title: "Shopping in Fira", location: "Gold Street", type: "Leisure", icon: <Camera size={14} /> },
        { time: "08:00 PM", title: "Farewell Rooftop Dinner", location: "Firostefani", type: "Food", icon: <Utensils size={14} /> },
      ]
    ]
  }
};

export default function ItineraryPage() {
  const params = useParams();
  const tripId = params?.tripId as string || "1";
  const [activeDay, setActiveDay] = useState(0);

  const trip = TRIP_DATA[tripId] || TRIP_DATA["1"];

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div className="relative h-[400px] w-full">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={trip.banner} 
          alt={trip.title} 
          className="w-full h-full object-cover shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full max-w-6xl mx-auto right-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-bold text-primary border border-primary/30 uppercase tracking-widest">
                Full Itinerary
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{trip.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-bold text-white/90">
              <span className="flex items-center gap-2 glass-card px-5 py-2.5 rounded-full border-white/10 shadow-xl">
                <MapPin size={16} className="text-primary" />
                {trip.location}
              </span>
              <span className="flex items-center gap-2 glass-card px-5 py-2.5 rounded-full border-white/10 shadow-xl">
                <Calendar size={16} className="text-primary" />
                3 Days Planned
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Summary & Details */}
        <div className="lg:col-span-1 space-y-8">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 rounded-[32px] border-white/5 bg-white/[0.02]"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Info size={20} />
              </div>
              Trip Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {trip.summary}
            </p>
          </motion.section>

          <button className="w-full py-5 bg-primary text-white rounded-[24px] shadow-[0_15px_30px_rgba(168,85,247,0.3)] font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95">
            <Plus size={20} />
            Add New Activity
          </button>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
            <h2 className="text-3xl font-black tracking-tight">Daily Schedule</h2>
            <div className="flex gap-2 p-1.5 glass rounded-2xl border-white/5">
              {[0, 1, 2].map((day) => (
                <button 
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                    activeDay === day 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Day {day + 1}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:to-transparent"
            >
              {trip.days[activeDay].map((activity: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-14 group"
                >
                  <div className="absolute left-0 top-1.5 w-11 h-11 rounded-2xl glass border border-white/10 flex items-center justify-center z-10 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 shadow-xl">
                    <div className="text-primary group-hover:scale-125 transition-transform">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="glass-card p-6 rounded-[28px] border-white/5 group-hover:border-primary/20 transition-all duration-500 flex justify-between items-center shadow-lg hover:shadow-primary/5">
                    <div className="flex gap-6 items-center">
                      <div className="text-[10px] font-black text-primary/80 uppercase tracking-widest w-20 bg-primary/5 px-2 py-1 rounded-lg text-center">
                        {activity.time}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{activity.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary/60" /> {activity.location}</span>
                          <span className="px-2 py-0.5 bg-white/5 rounded-md text-white/40 uppercase text-[9px] font-black tracking-widest">{activity.type}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
