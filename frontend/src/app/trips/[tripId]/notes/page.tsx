"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Pin,
  Clock,
  Tag,
  StickyNote,
} from "lucide-react";

export default function NotesPage() {
  const notes = [
    {
      id: 1,
      title: "Resort Confirmation",
      content: "Confirmation #AF329-X. Check-in is at 2 PM. Speedboat departs from Jetty 5 at 11 AM.",
      date: "2 days ago",
      pinned: true,
      tags: ["Travel", "Important"],
    },
    {
      id: 2,
      title: "Packing Reminders",
      content: "Don't forget the waterproof phone case and the universal power adapter for the transit in Dubai.",
      date: "5 days ago",
      pinned: false,
      tags: ["Packing"],
    },
    {
      id: 3,
      title: "Restaurant Recommendations",
      content: "Ithaa Undersea Restaurant - book 2 weeks in advance. Sea.Fire.Salt - good seafood grill.",
      date: "1 week ago",
      pinned: false,
      tags: ["Food"],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trip Notes</h1>
          <p className="page-subtitle">Keep all your important information in one place.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Create note
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input type="text" placeholder="Search your notes..." className="input pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note, idx) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="card card-pad card-hover flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileText size={17} />
              </div>
              <div className="flex items-center gap-1">
                {note.pinned && <Pin size={15} className="text-primary fill-primary" />}
                <button className="icon-btn w-8 h-8" aria-label="More options">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{note.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 mb-4 flex-1">
              {note.content}
            </p>

            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
              <div className="flex gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-muted rounded-md text-muted-foreground"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Clock size={11} />
                {note.date}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Add card */}
        <button className="card card-pad min-h-[240px] flex flex-col items-center justify-center gap-4 border-dashed hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center">
            <StickyNote size={22} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">New note</p>
            <p className="text-xs text-muted-foreground mt-0.5">Capture something important</p>
          </div>
        </button>
      </div>
    </div>
  );
}
