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
import api from "@/services/api";

export default function ProfilePage() {
  const { user, supabaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState("expeditions");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edit form when user loads
  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        bio: supabaseUser?.user_metadata?.bio || "Adventure seeker and photography enthusiast. I love exploring remote locations and capturing the beauty of nature.",
        location: supabaseUser?.user_metadata?.location || "Global"
      });
    }
  }, [user, supabaseUser]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await api.put('/auth/profile', {
        fullName: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        email: user?.email
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }
      });
      
      // Update local state by forcing a refresh or we can just optimistically update
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const traveler = {
    name: user?.name || "Guest Explorer",
    handle: user?.email ? `@${user.email.split("@")[0]}` : "@guest_explorer",
    bio: supabaseUser?.user_metadata?.bio || "Adventure seeker and photography enthusiast. I love exploring remote locations and capturing the beauty of nature.",
    location: supabaseUser?.user_metadata?.location || "Global",
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
      {/* Header Profile Info without Banner */}
      <div className="relative pt-6 px-5 sm:px-8 border-b border-border pb-6 flex flex-col sm:flex-row sm:items-end gap-6 justify-between">
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
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="btn bg-primary text-white hover:bg-primary/90"
          >
            <Edit3 size={16} />
            Edit profile
          </button>
          <button className="btn bg-muted text-foreground hover:bg-muted/80" aria-label="Share">
            <Share2 size={16} />
          </button>
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Edit Profile</h2>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea 
                      className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3 justify-end">
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
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
