"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, User, Phone, Globe, Calendar, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#050811] relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
          alt="Travel Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-primary/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 glass-card rounded-[56px] overflow-hidden border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10"
      >
        {/* Registration Side (Larger) */}
        <div className="lg:col-span-7 p-12 lg:p-20 flex flex-col justify-center border-r border-white/5">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6 lg:hidden">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/40">
                <Plane className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Traveloop</h1>
            </div>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">Register Travel Profile</h3>
            <p className="text-white/40 text-sm font-medium italic uppercase tracking-widest">Construct your global traveler identity</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Primary Identification</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="First Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Traveler Surname</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Transmission Channel</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    placeholder="john@expedition.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Satellite Connection</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="+1 234 567 890"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Manifest Origin</label>
                <div className="relative group">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white/40 italic"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Home Base</label>
                <div className="relative group">
                  <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white/40 italic appearance-none">
                    <option value="" className="bg-[#050811]">Select Region</option>
                    <option value="US" className="bg-[#050811]">United States</option>
                    <option value="GB" className="bg-[#050811]">United Kingdom</option>
                    <option value="IN" className="bg-[#050811]">India</option>
                    <option value="FR" className="bg-[#050811]">France</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-white/30 uppercase tracking-[0.3em] ml-2">Master Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 tracking-[0.8em]"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-4 transition-all group mt-6 uppercase tracking-widest text-xs italic">
              Synchronize Profile
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

          <div className="mt-10 text-center">
            <p className="text-white/20 text-xs font-black uppercase tracking-widest">
              Existing explorer?{" "}
              <Link href="/login" title="Login" className="text-primary font-black hover:underline italic ml-2 text-sm">Initiate Access Hub</Link>
            </p>
          </div>
        </div>

        {/* Cinematic Side (Smaller) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-16 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <ShieldCheck size={400} />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-20">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40">
                  <Plane className="text-white w-7 h-7" />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Traveloop</h1>
              </div>
              
              <div className="space-y-8">
                 <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl w-fit">
                    <Zap size={32} className="text-primary animate-pulse" />
                 </div>
                 <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                    Join the <br />
                    <span className="text-primary drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">Traveler's Grid</span>
                 </h2>
                 <p className="text-white/40 text-lg font-medium italic">
                    Unified intelligence for every landing, every stay, and every discovery.
                 </p>
              </div>
           </div>

           <div className="relative z-10 pt-20">
              <div className="flex items-center gap-4 p-6 glass rounded-[32px] border-white/5">
                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="User" />
                 </div>
                 <div>
                    <div className="text-white font-black text-[10px] uppercase tracking-widest">Recently Joined</div>
                    <div className="text-white/40 text-[9px] font-medium uppercase tracking-[0.2em] italic">3.4k Explorers Online</div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
