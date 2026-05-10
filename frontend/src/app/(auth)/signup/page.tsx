"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, User, Phone, Globe, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-card rounded-3xl p-8 border-white/10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40 mb-4">
            <Plane className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join Traveloop and start planning</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="John"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="tel" 
                  placeholder="+1 234 567 890"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground ml-1">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-muted-foreground appearance-none">
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IN">India</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all group mt-4">
            Sign Up
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" title="Login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
