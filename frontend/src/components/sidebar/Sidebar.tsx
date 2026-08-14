"use client";

import React from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuGroups } from "./menuItems";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    router.push("/login");
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col hidden lg:flex h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center justify-center h-24 border-b border-border shrink-0 py-2 mt-2">
        <img src="/logo.png" alt="Traveloop" className="h-[72px] w-auto object-contain" />
      </div>

      {/* Nav */}
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

      {/* User */}
      <div className="p-3 border-t border-border shrink-0">
        <Link
          href="/profile"
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
    </aside>
  );
}
