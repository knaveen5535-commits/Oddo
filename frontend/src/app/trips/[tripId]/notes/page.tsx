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
  Tag
} from "lucide-react";

export default function NotesPage() {
  const notes = [
    { 
      id: 1, 
      title: "Resort Confirmation", 
      content: "Confirmation #AF329-X. Check-in is at 2 PM. Speedboat departs from Jetty 5 at 11 AM.",
      date: "2 days ago",
      pinned: true,
      tags: ["Travel", "Important"]
    },
    { 
      id: 2, 
      title: "Packing Reminders", 
      content: "Don't forget the waterproof phone case and the universal power adapter for the transit in Dubai.",
      date: "5 days ago",
      pinned: false,
      tags: ["Packing"]
    },
    { 
      id: 3, 
      title: "Restaurant Recommendations", 
      content: "Ithaa Undersea Restaurant - book 2 weeks in advance. Sea.Fire.Salt - good seafood grill.",
      date: "1 week ago",
      pinned: false,
      tags: ["Food"]
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trip Notes</h1>
          <p className="text-muted-foreground">Keep all your important information in one place.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold">
          <Plus size={20} />
          Create Note
        </button>
      </header>

      <div className="flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search your notes..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, idx) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-3xl border-white/5 hover:border-white/20 transition-all flex flex-col h-[280px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="text-primary w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                {note.pinned && <Pin size={16} className="text-primary fill-primary" />}
                <button className="p-1 text-muted-foreground hover:text-foreground">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 line-clamp-1">{note.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 mb-4">
              {note.content}
            </p>
            
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                {note.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-white/5 rounded text-foreground/60">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock size={10} /> {note.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
