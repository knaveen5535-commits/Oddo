"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Globe, 
  ShieldCheck, 
  ChevronRight,
  LogOut,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const sections = [
    {
      title: "Account",
      items: [
        { icon: <User size={20} />, label: "Profile Information", desc: "Update your name, email and bio", color: "text-rose-400" },
        { icon: <Lock size={20} />, label: "Security & Password", desc: "Manage your account security", color: "text-slate-400" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: <Bell size={20} />, label: "Notifications", desc: "Choose what updates you receive", color: "text-rose-400" },
        { icon: <Moon size={20} />, label: "Appearance", desc: "Dark mode and theme settings", color: "text-slate-400" },
        { icon: <Globe size={20} />, label: "Language & Region", desc: "Update your local settings", color: "text-slate-400" },
      ]
    },
    {
      title: "Privacy",
      items: [
        { icon: <ShieldCheck size={20} />, label: "Privacy Policy", desc: "How we handle your data", color: "text-green-400" },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </header>

      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <motion.button 
                  key={itemIdx}
                  whileHover={{ x: 5 }}
                  className="w-full glass-card p-5 rounded-2xl border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-all ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm">{item.label}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-10 space-y-4 border-t border-white/5">
          <button className="w-full glass p-5 rounded-2xl border-white/10 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            Sign Out of All Devices
          </button>
          <button className="w-full p-5 rounded-2xl text-red-500/50 hover:text-red-500 transition-all text-sm font-medium flex items-center justify-center gap-2">
            <Trash2 size={16} />
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
