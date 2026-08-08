"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Compass,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { travelService } from "@/services/api";

type Mode = "login" | "signup";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  region: string;
  password: string;
}

const inputClass =
  "w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/60";

const iconClass =
  "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors";

export default function AuthPage({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loginData, setLoginData] = React.useState<LoginFormData>({ email: "", password: "" });
  const [signupData, setSignupData] = React.useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    region: "",
    password: "",
  });

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setError(null);
    setMode(next);
    router.replace(next === "login" ? "/login" : "/signup");
  };

  const handleChange =
    <T extends object>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setter((prev) => ({ ...prev, [name]: value } as T));
    };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        console.log("[AUTH] Access granted for:", data.user.email);
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (message.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email address before logging in.");
      } else {
        setError(message || "Identity verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await travelService.supabaseSignup({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: signupData.phone,
        dob: signupData.birthDate,
        region: signupData.region,
        password: signupData.password,
      });

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: signupData.email,
        password: signupData.password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        console.log("[AUTH] User registered successfully:", data.user.email);
        router.push("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message =
        axiosErr.response?.data?.message ||
        (err instanceof Error ? err.message : String(err));
      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("already exists")
      ) {
        setError("This traveler is already in our system. Please login to continue.");
      } else {
        setError(message || "Failed to initiate traveler synchronization.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
        queryParams: {
          prompt: "select_account",
          access_type: "offline",
        },
      },
    });
  };

  const features = [
    { icon: <Globe2 size={18} />, label: "Plan trips across the globe" },
    { icon: <Compass size={18} />, label: "AI-powered destination insights" },
    { icon: <Wallet size={18} />, label: "Smart budget & expense tracking" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-background relative overflow-hidden">
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
        className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[28px] sm:rounded-[40px] border border-foreground/10 shadow-2xl backdrop-blur-2xl glass-card"
      >
        {/* ============ LEFT PANEL ============ */}
        <div className="relative flex flex-col p-7 sm:p-10 lg:p-14 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent border-b lg:border-b-0 lg:border-r border-foreground/10 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Brand */}
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <Plane className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gradient tracking-tight">Traveloop</h1>
          </div>

          {/* Login / Sign up toggle */}
          <div className="relative mt-8 grid grid-cols-2 gap-1.5 p-1.5 glass rounded-2xl border-foreground/10 max-w-sm">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`relative py-3 rounded-xl text-sm font-bold transition-all ${
                  mode === m ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="authToggle"
                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{m === "login" ? "Login" : "Sign up"}</span>
              </button>
            ))}
          </div>

          {/* Headline */}
          <div className="relative mt-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
              {mode === "login"
                ? "Welcome back, explorer."
                : "Start your next adventure."}
            </h2>
            <p className="text-muted-foreground font-medium">
              {mode === "login"
                ? "Sign in to continue planning your journeys."
                : "Create an account to plan, budget, and track trips anywhere on Earth."}
            </p>
          </div>

          {/* Feature list */}
          <ul className="relative mt-10 space-y-4">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  {f.icon}
                </span>
                {f.label}
              </li>
            ))}
          </ul>

          {/* Decorative */}
          <div className="relative mt-auto pt-10 hidden lg:flex items-center gap-2 text-xs font-bold text-foreground/30 uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Trusted by 12,000+ travelers
          </div>
        </div>

        {/* ============ RIGHT PANEL ============ */}
        <div className="p-7 sm:p-10 lg:p-14 bg-card">
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

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Email</label>
                  <div className="relative group">
                    <Mail className={iconClass} />
                    <input
                      type="email"
                      name="email"
                      required
                      value={loginData.email}
                      onChange={handleChange(setLoginData)}
                      placeholder="you@example.com"
                      className={inputClass}
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
                    <Lock className={iconClass} />
                    <input
                      type="password"
                      name="password"
                      required
                      value={loginData.password}
                      onChange={handleChange(setLoginData)}
                      placeholder="••••••••••••"
                      className={inputClass}
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

                <div className="my-2 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-foreground/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-4 text-xs font-medium text-muted-foreground">or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={googleSignIn}
                  className="w-full glass rounded-xl border-foreground/10 hover:border-primary/30 transition-all flex items-center justify-center py-3 gap-3 text-foreground font-medium text-sm"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Sign in with Google
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">First name</label>
                    <div className="relative group">
                      <User className={iconClass} />
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={signupData.firstName}
                        onChange={handleChange(setSignupData)}
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
                        value={signupData.lastName}
                        onChange={handleChange(setSignupData)}
                        placeholder="Doe"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Email</label>
                    <div className="relative group">
                      <Mail className={iconClass} />
                      <input
                        type="email"
                        name="email"
                        required
                        value={signupData.email}
                        onChange={handleChange(setSignupData)}
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
                        value={signupData.phone}
                        onChange={handleChange(setSignupData)}
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
                        value={signupData.birthDate}
                        onChange={handleChange(setSignupData)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Region</label>
                    <div className="relative group">
                      <Globe className={iconClass} />
                      <select
                        name="region"
                        value={signupData.region}
                        onChange={handleChange(setSignupData)}
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
                      value={signupData.password}
                      onChange={handleChange(setSignupData)}
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

                <div className="my-2 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-foreground/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-4 text-xs font-medium text-muted-foreground">or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={googleSignIn}
                  className="w-full glass rounded-xl border-foreground/10 hover:border-primary/30 transition-all flex items-center justify-center py-3 gap-3 text-foreground font-medium text-sm"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Sign up with Google
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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
            {mode === "login" ? (
              <>
                New to Traveloop?{" "}
                <button onClick={() => switchMode("signup")} className="font-medium text-primary hover:underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="font-medium text-primary hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
