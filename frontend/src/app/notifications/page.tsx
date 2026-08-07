"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  MapPin, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Info,
  Check
} from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { 
      id: 1, 
      type: "alert", 
      title: "Price Drop Alert!", 
      desc: "Flights to Tokyo have dropped by 15%. Book now to save ₹200.", 
      time: "10 mins ago", 
      icon: <TrendingDown size={20} />, 
      color: "bg-slate-500/10 text-slate-400" 
    },
    { 
      id: 2, 
      type: "trip", 
      title: "Upcoming Trip", 
      desc: "Your trip to Maldives starts in 3 days. Have you checked your packing list?", 
      time: "2 hours ago", 
      icon: <Calendar size={20} />, 
      color: "bg-primary/10 text-primary" 
    },
    { 
      id: 3, 
      type: "payment", 
      title: "Payment Successful", 
      desc: "Payment for Sun Siyam Iru Fushi has been confirmed.", 
      time: "Yesterday", 
      icon: <CreditCard size={20} />, 
      color: "bg-rose-500/10 text-rose-400" 
    },
    { 
      id: 4, 
      type: "system", 
      title: "New Feature Available", 
      desc: "You can now sync your Google Maps recommendations directly to your itinerary.", 
      time: "2 days ago", 
      icon: <Info size={20} />, 
      color: "bg-slate-500/10 text-slate-400" 
    }
  ];

  return (
    <div className="px-4 sm:px-10 w-full space-y-8 sm:space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground text-lg">Stay updated on your plans and latest travel deals.</p>
        </div>
        <button className="px-6 py-3 glass border-white/10 rounded-2xl text-sm font-bold hover:bg-white/5 transition-all">
          Mark all as read
        </button>
      </header>

      <div className="space-y-4">
        {notifications.map((note, idx) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-5 sm:p-6 rounded-3xl border-white/5 flex items-start gap-4 sm:gap-6 hover:bg-white/5 transition-all group"
          >
            <div className={`p-4 rounded-2xl shrink-0 ${note.color}`}>
              {note.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{note.title}</h3>
                <span className="text-xs text-muted-foreground font-medium">{note.time}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{note.desc}</p>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Check size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helper for the TrendingDown icon since it's used in the array
import { TrendingDown } from "lucide-react";
