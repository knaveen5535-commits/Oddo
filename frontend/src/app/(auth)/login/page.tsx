"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 border-white/10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40 mb-4">
            <Plane className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">Welcome to Traveloop</h1>
          <p className="text-muted-foreground mt-2">Sign in to start your adventure</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                placeholder="username or email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all group">
            Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/signup" title="Signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
