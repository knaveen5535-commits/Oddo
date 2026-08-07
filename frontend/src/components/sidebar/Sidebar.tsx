"use client";

import React from "react";
import {
  Plane, 
  User, 
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { menuItems } from "./menuItems";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear cookies/localstorage here
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col p-6 hidden lg:flex h-screen sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <Plane className="text-foreground w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gradient tracking-tight">Traveloop</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            }`}>
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
        <Link href="/profile">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === "/profile" 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          }`}>
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
    </aside>
  );
}
