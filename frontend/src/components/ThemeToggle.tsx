"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-3 glass rounded-2xl border-white/10 text-foreground hover:bg-white/5 transition-all shadow-xl flex items-center justify-center group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === "dark" ? 0 : 90,
            opacity: theme === "dark" ? 1 : 0,
            scale: theme === "dark" ? 1 : 0
          }}
          className="absolute inset-0 flex items-center justify-center text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
        >
          <Sun size={20} fill="currentColor" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === "dark" ? -90 : 0,
            opacity: theme === "dark" ? 0 : 1,
            scale: theme === "dark" ? 0 : 1
          }}
          className="absolute inset-0 flex items-center justify-center text-primary"
        >
          <Moon size={20} fill="currentColor" />
        </motion.div>
      </div>
    </motion.button>
  );
}
