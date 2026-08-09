"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  CreditCard,
  Info,
  Check,
  TrendingDown,
  CheckCheck,
} from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Price drop alert",
      desc: "Flights to Tokyo have dropped by 15%. Book now to save ₹200.",
      time: "10 mins ago",
      icon: <TrendingDown size={18} />,
      tone: "bg-danger/10 text-danger",
    },
    {
      id: 2,
      type: "trip",
      title: "Upcoming trip",
      desc: "Your trip to Maldives starts in 3 days. Have you checked your packing list?",
      time: "2 hours ago",
      icon: <Calendar size={18} />,
      tone: "bg-primary/10 text-primary",
    },
    {
      id: 3,
      type: "payment",
      title: "Payment successful",
      desc: "Payment for Sun Siyam Iru Fushi has been confirmed.",
      time: "Yesterday",
      icon: <CreditCard size={18} />,
      tone: "bg-success/10 text-success",
    },
    {
      id: 4,
      type: "system",
      title: "New feature available",
      desc: "You can now sync your Google Maps recommendations directly to your itinerary.",
      time: "2 days ago",
      icon: <Info size={18} />,
      tone: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Stay updated on your plans and latest travel deals.</p>
        </div>
        <button className="btn btn-outline">
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      <div className="max-w-3xl space-y-4">
        {notifications.map((note, idx) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="card card-pad flex items-start gap-4 card-hover"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${note.tone}`}>
              {note.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-3 mb-1">
                <h3 className="font-semibold text-foreground">{note.title}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{note.time}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{note.desc}</p>
            </div>
            <button
              className="icon-btn w-9 h-9 shrink-0 hover:bg-success/10 hover:text-success"
              aria-label="Mark as read"
            >
              <Check size={16} />
            </button>
          </motion.div>
        ))}

        <div className="card empty-state">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bell size={26} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">All caught up</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You're all up to date. New alerts about your trips and travel deals will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
