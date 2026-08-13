"use client";

import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import MobileNav from "../sidebar/MobileNav";
import AppHeader from "./AppHeader";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background pb-[70px] lg:pb-0">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <AppHeader onMenuClick={() => {}} />
        <main className="flex-1">
          <div className="page-container">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
