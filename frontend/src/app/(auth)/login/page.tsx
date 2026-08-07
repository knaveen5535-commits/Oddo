"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Premium ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glass-card rounded-3xl border-foreground/10 p-8 sm:p-10 relative z-10 shadow-2xl backdrop-blur-2xl"
      >
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-9">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
            <Plane className="text-primary w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your journeys</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-medium"
          >
            <Zap className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all group"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-xs font-medium text-muted-foreground">or continue with</span>
          </div>
        </div>

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
          className="w-full glass rounded-xl border-foreground/10 hover:border-primary/30 transition-all flex items-center justify-center py-3 gap-3 text-foreground font-medium text-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Sign in with Google
        </button>

        <div className="mt-7 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs">Secure encrypted</span>
          </div>
          <div className="w-1 h-1 bg-foreground/10 rounded-full" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs">Real-time sync</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Traveloop?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
