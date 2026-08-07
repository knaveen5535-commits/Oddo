"use client";

import React, { useState } from "react";
import { Plane, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "../ThemeToggle";
import { menuItems } from "./menuItems";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-sidebar/80 backdrop-blur-xl border-b border-border">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -ml-1 rounded-xl text-foreground hover:bg-accent/50 transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <Plane className="text-foreground w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-gradient tracking-tight">Traveloop</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col bg-sidebar border-r border-border p-6"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <Plane className="text-foreground w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-bold text-gradient tracking-tight">Traveloop</h1>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-xl text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        pathname === item.href
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-4 pt-6 border-t border-border">
                <div className="flex justify-center pb-2">
                  <ThemeToggle />
                </div>
                <Link href="/profile" onClick={() => setOpen(false)}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === "/profile"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
