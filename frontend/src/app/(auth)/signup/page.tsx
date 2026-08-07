"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, User, Phone, Globe, Calendar, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/60";

const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors";

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
        className="w-full max-w-2xl glass-card rounded-3xl border-foreground/10 p-8 sm:p-10 relative z-10 shadow-2xl backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <Plane className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Create your account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Start planning your next journey</p>
            </div>
          </div>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline whitespace-nowrap">
            Already have an account? Sign in
          </Link>
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

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">First name</label>
              <div className="relative group">
                <User className={iconClass} />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Last name</label>
              <div className="relative group">
                <User className={iconClass} />
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground/80">Email</label>
              <div className="relative group">
                <Mail className={iconClass} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Phone</label>
              <div className="relative group">
                <Phone className={iconClass} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Date of birth</label>
              <div className="relative group">
                <Calendar className={iconClass} />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground/80">Region</label>
              <div className="relative group">
                <Globe className={iconClass} />
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="" className="bg-card text-foreground">Select region</option>
                  <option value="US" className="bg-card text-foreground">United States</option>
                  <option value="GB" className="bg-card text-foreground">United Kingdom</option>
                  <option value="IN" className="bg-card text-foreground">India</option>
                  <option value="FR" className="bg-card text-foreground">France</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-sm font-medium text-foreground/80">Password</label>
            <div className="relative group">
              <Lock className={iconClass} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all group"
          >
            {loading ? "Creating account..." : "Create account"}
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
          Sign up with Google
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
      </motion.div>
    </div>
  );
}
