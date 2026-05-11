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
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (loginError) throw loginError;

      if (data.user) {
        console.log("[AUTH] Access granted for:", data.user.email);
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (err.message?.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email address before logging in.");
      } else {
        setError(err.message || "Identity verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card rounded-[48px] border-white/5 p-12 relative z-10 shadow-2xl backdrop-blur-3xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Globe size={120} />
        </div>

        <div className="space-y-2 mb-12">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/20 rounded-xl">
                <Plane className="text-primary w-5 h-5" />
             </div>
             <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Flight Deck Access</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Identity Check</h1>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-sm font-bold italic"
          >
            <Zap className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Explorer Identifier</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="navigator@traveloop.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em]">Security Protocol</label>
              <Link href="/forgot-password" size={18} className="text-xs font-black text-primary hover:underline uppercase tracking-widest italic">Signal Recovery</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 tracking-[0.8em]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-4 transition-all group mt-6 uppercase tracking-widest text-sm italic"
          >
            {loading ? "Authenticating..." : "Engage Voyage"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 relative">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
           </div>
           <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
              <span className="bg-[#0b0f1a] px-4 text-white/20 italic">Or Operational Sync</span>
           </div>
        </div>

        <div className="mt-10 flex justify-center">
           <button 
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/profile`,
                  queryParams: {
                    prompt: 'select_account',
                    access_type: 'offline'
                  }
                }
              });
            }}
            className="w-full glass-card rounded-2xl border-white/5 hover:border-primary/20 transition-all flex items-center justify-center py-5 gap-3 text-white font-black uppercase tracking-widest text-xs italic"
           >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Operational Sync with Google
           </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs font-black text-white/20 uppercase tracking-widest">AES-256 Encrypted</span>
           </div>
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-black text-white/20 uppercase tracking-widest">Real-time Sync</span>
           </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-black text-white/20 uppercase tracking-widest">
            New explorer? <Link href="/signup" className="text-primary hover:underline italic ml-2">Request Manifesto</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
