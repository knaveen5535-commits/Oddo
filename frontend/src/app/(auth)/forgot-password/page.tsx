"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 relative z-10 shadow-xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-5 shadow-lg shadow-primary/25">
            <Plane className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reset password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {sent
              ? "We've sent a reset link to your inbox. Check your email to continue."
              : "Enter your email and we'll send you instructions to reset your password."}
          </p>
        </div>

        {!sent ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger font-medium bg-danger/10 border border-danger/20 rounded-xl p-3">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? "Sending..." : "Send reset link"}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-sm text-success font-medium text-center">
            Check your inbox for the reset link.
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
