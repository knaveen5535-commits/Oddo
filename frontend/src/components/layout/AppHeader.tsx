"use client";

import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const pageMeta: { pattern: RegExp; title: string; subtitle: string }[] = [
  { pattern: /^\/$/, title: "Dashboard", subtitle: "Overview of your travel plans" },
  { pattern: /^\/trips\/create$/, title: "Plan a Trip", subtitle: "Create your next adventure" },
  { pattern: /^\/trips\/[^/]+\/(itinerary|budget|notes|packing)$/, title: "Trip Workspace", subtitle: "Manage your trip details" },
  { pattern: /^\/trips\/?$/, title: "My Trips", subtitle: "Manage your curated adventures" },
  { pattern: /^\/city-search$/, title: "Explore Destinations", subtitle: "Discover places around the world" },
  { pattern: /^\/smart-search$/, title: "Smart Search", subtitle: "AI-powered destination intelligence" },
  { pattern: /^\/activity-search$/, title: "Activities", subtitle: "Find experiences and tours" },
  { pattern: /^\/budget$/, title: "Budget", subtitle: "Track and manage your finances" },
  { pattern: /^\/packing-list$/, title: "Packing List", subtitle: "Never forget an essential again" },
  { pattern: /^\/profile$/, title: "Profile", subtitle: "Manage your account" },
  { pattern: /^\/notifications$/, title: "Notifications", subtitle: "Stay up to date" },
  { pattern: /^\/admin$/, title: "Admin Console", subtitle: "Platform health and growth" },
];

export default function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const meta = pageMeta.find((p) => p.pattern.test(pathname || ""));

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-background/85 backdrop-blur-xl border-b border-border shrink-0">
      <div className="min-w-0 flex-1 lg:flex-none">
        <h1 className="text-base font-bold tracking-tight text-foreground truncate leading-tight">
          {meta?.title || "Traveloop"}
        </h1>
        <p className="text-[11px] sm:text-xs text-muted-foreground truncate leading-tight">{meta?.subtitle || ""}</p>
      </div>

      <div className="flex-1" />

      {/* Global search */}
      <div className="relative hidden md:block w-64 lg:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search destinations, trips..."
          className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/notifications" className="icon-btn relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </Link>
        <Link href="/profile" className="avatar w-9 h-9 text-sm" aria-label="Profile">
          {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : initials}
        </Link>
      </div>
    </header>
  );
}
