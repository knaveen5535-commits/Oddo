"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function GlobalLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading phase on any route change
    setIsLoading(true);

    // Keep the loading screen visible for exactly 1 second
    const finishTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => {
      clearTimeout(finishTimeout);
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-md transition-opacity duration-500">
      <div className="relative flex flex-col items-center w-full max-w-sm px-8">
        
        {/* Animated Glow Behind Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        
        {/* Logo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 animate-[bounce_2s_infinite]">
          <img 
            src="/logo.png" 
            alt="TravelLoop Loading" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default function GlobalLoader() {
  return (
    <React.Suspense fallback={null}>
      <GlobalLoaderInner />
    </React.Suspense>
  );
}
