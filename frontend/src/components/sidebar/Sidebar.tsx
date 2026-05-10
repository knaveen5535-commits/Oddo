"use client";

import React from "react";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Wallet, 
  Briefcase, 
  Search, 
  User, 
  Settings, 
  LogOut,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear cookies/localstorage here
    router.push("/login");
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
    { icon: <Calendar size={20} />, label: "My Trips", href: "/trips" },
    { icon: <Search size={20} />, label: "Explore", href: "/city-search" },
    { icon: <Wallet size={20} />, label: "Budget", href: "/trips/1/budget" },
    { icon: <Briefcase size={20} />, label: "Packing List", href: "/trips/1/packing" },
  ];

  return (
    <aside className="w-64 glass border-r border-white/5 flex flex-col p-6 hidden lg:flex h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <Plane className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gradient tracking-tight">Traveloop</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-6 border-t border-white/5">
        <Link href="/profile">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === "/profile" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-white/5 hover:text-white"
          }`}>
            <User size={20} />
            <span className="font-medium">Profile</span>
          </button>
        </Link>
        <Link href="/settings">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === "/settings" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-white/5 hover:text-white"
          }`}>
            <Settings size={20} />
            <span className="font-medium">Settings</span>
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
    </aside>
  );
}
