"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
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
          <h1 className="text-2xl font-bold text-gradient">Reset Password</h1>
          <p className="text-muted-foreground mt-2 text-center px-4">Enter your email and we'll send you instructions to reset your password</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all group">
            Send Reset Link
            <Send className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" title="Back to Login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
