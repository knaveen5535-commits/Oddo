"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="icon-btn"
      aria-label="Toggle theme"
    >
      <span className="theme-icon theme-icon-light flex items-center justify-center">
        <Sun size={18} />
      </span>
      <span className="theme-icon theme-icon-dark flex items-center justify-center">
        <Moon size={18} />
      </span>
    </motion.button>
  );
}
