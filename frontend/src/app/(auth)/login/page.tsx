"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050811] relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109c05a?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
          alt="Travel Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-primary/10" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 glass-card rounded-[56px] overflow-hidden border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10"
      >
        {/* Brand Side */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-primary/20 to-transparent border-r border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 p-12 opacity-10">
              <Globe size={300} />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40">
                  <Plane className="text-white w-7 h-7" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Traveloop</h1>
              </div>
              
              <div className="space-y-6">
                 <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Start Your <br />
                    <span className="text-primary drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">Global Expedition</span>
                 </h2>
                 <p className="text-white/40 text-lg font-medium italic max-w-sm">
                    Access your personalized travel intelligence dashboard and map your next discovery.
                 </p>
              </div>
           </div>

           <div className="relative z-10 flex gap-8">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    <ShieldCheck size={14} /> Secured
                 </div>
                 <div className="text-white/20 text-[9px] font-medium uppercase tracking-[0.2em]">AES-256 Protocol</div>
              </div>
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    <Zap size={14} /> Intelligence
                 </div>
                 <div className="text-white/20 text-[9px] font-medium uppercase tracking-[0.2em]">AI Powered Engine</div>
              </div>
           </div>
        </div>

        {/* Login Side */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Traveler Login</h3>
            <p className="text-white/40 text-sm font-medium italic uppercase tracking-widest">Enter your access credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Identity Hub</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Username or Email"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Security Access</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary font-black uppercase tracking-widest hover:underline italic">Lost Access Key?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 tracking-[0.5em]"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-4 transition-all group mt-10 uppercase tracking-widest text-xs italic">
              Initiate Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="mt-8 relative">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-[#0b0f1a] px-4 text-white/20 italic">Or Operational Sync</span>
             </div>
          </div>

          <div className="mt-8 flex justify-center">
             <button 
              onClick={async () => {
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/profile`
                  }
                });
              }}
              className="w-full glass-card rounded-2xl border-white/5 hover:border-primary/20 transition-all flex items-center justify-center py-4 gap-3 text-white font-black uppercase tracking-widest text-[10px] italic"
             >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Operational Sync with Google
             </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/20 text-xs font-black uppercase tracking-widest">
              New explorer?{" "}
              <Link href="/signup" title="Signup" className="text-primary font-black hover:underline italic ml-2 text-sm">Register Travel Profile</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
