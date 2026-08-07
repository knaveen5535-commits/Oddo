"use client";

import { Calendar, LayoutDashboard, Search, Wallet, Briefcase } from "lucide-react";

export const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
  { icon: <Calendar size={20} />, label: "My Trips", href: "/trips" },
  { icon: <Search size={20} />, label: "Explore", href: "/city-search" },
  { icon: <Wallet size={20} />, label: "Budget", href: "/budget" },
  { icon: <Briefcase size={20} />, label: "Packing List", href: "/packing-list" },
];
