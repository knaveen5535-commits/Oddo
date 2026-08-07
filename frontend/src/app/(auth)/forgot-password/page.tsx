"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
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
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
            <Plane className="text-primary w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all group">
            Send Reset Link
            <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
