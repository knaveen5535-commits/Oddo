"use client";

import React from "react";
import { Plane, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { menuGroups } from "./menuItems";
import { useAuth } from "@/context/AuthContext";

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    onClose();
    router.push("/login");
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col bg-sidebar border-r border-border"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <Plane className="text-white w-5 h-5" />
                </div>
                <span className="text-base font-bold tracking-tight text-foreground">Traveloop</span>
              </div>
              <button onClick={onClose} aria-label="Close menu" className="icon-btn">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
              {menuGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const active = item.match(pathname);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-sidebar-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <span className={active ? "text-primary" : "text-muted-foreground"}>{item.icon}</span>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-3 border-t border-border shrink-0">
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors"
              >
                <div className="avatar w-9 h-9 text-sm">
                  {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || "Not signed in"}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
              >
                <LogOut size={19} />
                Sign out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
