"use client";

import React from "react";
import { LayoutDashboard, Calendar, Globe, User, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: <LayoutDashboard size={22} /> },
    { label: "Explore", href: "/city-search", icon: <Globe size={22} /> },
    { label: "Create", href: "/trips/create", icon: <PlusCircle size={24} />, isPrimary: true },
    { label: "Trips", href: "/trips", icon: <Calendar size={22} /> },
    { label: "Profile", href: "/profile", icon: <User size={22} /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around px-2 h-[68px]">
        {navItems.map((item) => {
          // Careful exact matching for Home, prefix matching for others
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href) && !item.isPrimary;
            
          const isExactPrimary = item.isPrimary && pathname === item.href;
          
          if (item.isPrimary) {
            return (
              <Link key={item.href} href={item.href} className="relative -top-5 flex flex-col items-center group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/20 border-4 border-background transition-transform duration-300 group-hover:scale-105 ${isExactPrimary ? 'bg-primary scale-105' : 'bg-primary/90'}`}>
                  {item.icon}
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 p-2 min-w-[64px]">
              <div className={`transition-all duration-300 ${isActive ? "text-primary -translate-y-0.5" : "text-muted-foreground hover:text-foreground"}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-semibold transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
