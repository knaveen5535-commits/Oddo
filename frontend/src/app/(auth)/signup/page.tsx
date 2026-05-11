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
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    region: "",
    password: ""
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            region: formData.region,
            birth_date: formData.birthDate
          }
        }
      });

      if (signupError) throw signupError;

      if (data.user) {
        console.log("[AUTH] User registered successfully:", data.user.email);
        router.push("/");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.message?.toLowerCase().includes("already registered") || err.message?.toLowerCase().includes("already exists")) {
        setError("This traveler is already in our system. Please login to continue.");
      } else {
        setError(err.message || "Failed to initiate traveler synchronization.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-card rounded-[40px] border-white/5 p-8 md:p-12 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/20 rounded-xl">
                  <Plane className="text-primary w-5 h-5" />
               </div>
               <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Expedition Registration</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Create Profile</h1>
          </div>
          <Link href="/login" className="text-sm font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest border-b border-white/10 pb-1">
            Already a traveler? Login
          </Link>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-sm font-bold italic"
          >
            <Zap className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Given Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Family Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Communication Hub</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="navigator@traveloop.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Satellite Connection</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 italic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Manifest Origin</label>
              <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="date" 
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white/40 italic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Home Base</label>
              <div className="relative group">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <select 
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white/40 italic appearance-none"
                >
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
            <label className="text-sm font-black text-white/30 uppercase tracking-[0.3em] ml-2">Master Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10 tracking-[0.8em]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-4 transition-all group mt-6 uppercase tracking-widest text-sm italic"
          >
            {loading ? "Synchronizing..." : "Synchronize Profile"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 relative">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
           </div>
           <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
              <span className="bg-[#0b0f1a] px-4 text-white/20 italic">Or Operational Sync</span>
           </div>
        </div>

        <div className="mt-8 flex justify-center">
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
            className="w-full glass-card rounded-2xl border-white/5 hover:border-primary/20 transition-all flex items-center justify-center py-4 gap-3 text-white font-black uppercase tracking-widest text-xs italic"
           >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Operational Sync with Google
           </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
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
      </motion.div>
    </div>
  );
}
