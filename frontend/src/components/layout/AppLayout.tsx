"use client";

import React from "react";
import Sidebar from "../sidebar/Sidebar";
import MobileNav from "../sidebar/MobileNav";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/forgot-password");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
