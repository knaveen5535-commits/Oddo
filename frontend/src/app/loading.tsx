import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        
        {/* Ambient glow behind the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        
        {/* The Logo */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center animate-bounce">
          <img 
            src="/logo.png" 
            alt="Loading TravelLoop..." 
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
        
        {/* Loading Text */}
        <div className="mt-8 flex items-center text-foreground font-semibold tracking-[0.2em] uppercase text-xs sm:text-sm">
          <span>Preparing</span>
          <span className="ml-1 flex gap-0.5 text-primary">
            <span className="animate-[bounce_1s_infinite_0ms]">.</span>
            <span className="animate-[bounce_1s_infinite_200ms]">.</span>
            <span className="animate-[bounce_1s_infinite_400ms]">.</span>
          </span>
        </div>
        
        {/* Subtle Progress Bar */}
        <div className="mt-6 w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-primary to-secondary animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
