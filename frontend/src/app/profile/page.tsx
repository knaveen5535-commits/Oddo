"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Calendar,
  Plane,
  Globe,
  Star,
  Award,
  ArrowRight,
  Share2,
  Edit3,
  Camera,
  Mail,
  User as UserIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("expeditions");

  const traveler = {
    name: user?.name || "Guest Explorer",
    handle: user?.email ? `@${user.email.split("@")[0]}` : "@guest_explorer",
    bio: "Adventure seeker and photography enthusiast. I love exploring remote locations and capturing the beauty of nature.",
    location: "Global",
    joined: "Jan 2024",
    avatar:
      user?.avatar ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
    stats: [
      { label: "Voyages", value: "0", icon: <Plane size={16} /> },
      { label: "Countries", value: "0", icon: <Globe size={16} /> },
      { label: "Reviews", value: "0", icon: <Star size={16} /> },
      { label: "Badges", value: "0", icon: <Award size={16} /> },
    ],
  };

  const expeditions = [
    { id: "1", title: "Maldives Escape", date: "June 2026", image: "https://images.unsplash.com/photo-1506929113614-b9486ca55229?q=80&w=800&auto=format&fit=crop", status: "Active" },
    { id: "2", title: "Paris Romance", date: "April 2026", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", status: "Planning" },
  ];

  const archive = [
    { id: "3", title: "Tokyo Adventure", date: "Feb 2026", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop", status: "Completed" },
    { id: "4", title: "Rome History", date: "Oct 2025", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop", status: "Completed" },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative h-52 sm:h-64 w-full rounded-2xl overflow-hidden border border-border">
        <img src={traveler.banner} alt="Profile banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
          <button className="btn bg-white/15 text-white border border-white/25 hover:bg-white/25">
            <Edit3 size={16} />
            Edit profile
          </button>
          <button className="btn bg-white/15 text-white border border-white/25 hover:bg-white/25" aria-label="Share">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Identity card */}
      <div className="relative -mt-16 sm:-mt-20 px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-background overflow-hidden shadow-lg bg-card">
              <img src={traveler.avatar} alt={traveler.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md border-4 border-background hover:scale-105 transition-transform">
              <Camera size={15} />
            </button>
          </div>
          <div className="pb-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {traveler.name}
              </h1>
              <span className="badge badge-primary">Pro traveler</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={14} className="text-primary" />
                {traveler.handle}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                {traveler.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" />
                Joined {traveler.joined}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-4 space-y-5">
          <section className="card card-pad">
            <h3 className="section-title mb-4">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">"{traveler.bio}"</p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            {traveler.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card card-pad card-hover"
              >
                <div className="text-primary mb-2">{stat.icon}</div>
                <div className="text-xl font-bold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </section>

          <section className="card card-pad bg-gradient-to-br from-primary to-secondary border-0 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 opacity-20 pointer-events-none">
              <UserIcon size={96} />
            </div>
            <h4 className="text-lg font-semibold mb-1">Adventure ready</h4>
            <p className="text-white/80 text-xs mb-5">Loyalty member since 2024</p>
            <button className="w-full py-2.5 bg-white text-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Claim weekly rewards
            </button>
          </section>
        </div>

        {/* Right */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setActiveTab("expeditions")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "expeditions"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expeditions
              </button>
              <button
                onClick={() => setActiveTab("archive")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "archive"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Archive
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {(activeTab === "expeditions" ? expeditions : archive).length} trips
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4"
              >
                {(activeTab === "expeditions" ? expeditions : archive).map((trip) => (
                  <motion.div
                    key={trip.id}
                    whileHover={{ x: 4 }}
                    className="card overflow-hidden card-hover flex h-32 sm:h-36 cursor-pointer"
                  >
                    <div className="w-36 sm:w-44 relative overflow-hidden shrink-0">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-semibold text-foreground">{trip.title}</h4>
                        <span
                          className={`badge ${
                            trip.status === "Active"
                              ? "badge-success"
                              : trip.status === "Planning"
                              ? "badge-warning"
                              : "badge-neutral"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar size={14} className="text-primary" />
                        {trip.date}
                      </div>
                    </div>
                    <div className="flex items-center pr-5 shrink-0">
                      <div className="icon-btn hover:bg-primary hover:text-white hover:border-primary">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
