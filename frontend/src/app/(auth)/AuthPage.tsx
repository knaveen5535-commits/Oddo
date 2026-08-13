"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  Sparkles,
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
  "w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-shadow";

const iconClass =
  "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none";

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
    { icon: <Globe2 size={16} />, label: "Plan trips across the globe" },
    { icon: <Compass size={16} />, label: "AI-powered destination insights" },
    { icon: <Wallet size={16} />, label: "Smart budget & expense tracking" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/20 p-4 sm:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="w-full max-w-5xl flex rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-border/40 bg-card relative z-10 max-h-[90vh]">
        {/* Left panel */}
        <div className="hidden lg:flex w-[45%] flex-col justify-between p-10 xl:p-12 relative overflow-hidden bg-background border-r border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative flex items-center">
          <img src="/logo.png" alt="Traveloop" className="h-12 w-auto object-contain" />
        </div>

        {/* Copy */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <span className="badge badge-primary">
              <Sparkles size={13} />
              Smart travel planning
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
              Everything you need to plan the perfect trip.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Plan itineraries, track budgets, build packing lists, and collaborate with
              friends — all in one beautifully simple workspace.
            </p>
          </div>

          <ul className="space-y-3.5">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm text-foreground">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  {f.icon}
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Trusted by 12,000+ travelers
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 overflow-y-auto bg-card scrollbar-hide">
        <div className="w-full max-w-[380px] my-auto py-8">
          {/* Brand (mobile) */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src="/logo.png" alt="Traveloop" className="h-10 w-auto object-contain" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl mb-8">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`relative py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="authToggle"
                      className="absolute inset-0 bg-card rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{m === "login" ? "Login" : "Sign up"}</span>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login"
                  ? "Sign in to continue planning your journeys."
                  : "Join Traveloop to plan, budget, and track trips anywhere on Earth."}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-5 p-3.5 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-2.5 text-danger text-sm font-medium"
              >
                <Zap className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="relative">
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

                  <div className="field">
                    <div className="flex justify-between items-center">
                      <label className="label">Password</label>
                      <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
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
                    className="btn btn-primary btn-lg w-full"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-xs font-medium text-muted-foreground">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={googleSignIn}
                    className="btn btn-outline w-full"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Sign in with Google
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="field">
                      <label className="label">First name</label>
                      <div className="relative">
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
                    <div className="field">
                      <label className="label">Last name</label>
                      <div className="relative">
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
                  </div>

                  <div className="field">
                    <label className="label">Email</label>
                    <div className="relative">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="field">
                      <label className="label">Phone</label>
                      <div className="relative">
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
                    <div className="field">
                      <label className="label">Date of birth</label>
                      <div className="relative">
                        <Calendar className={iconClass} />
                        <input
                          type="date"
                          name="birthDate"
                          value={signupData.birthDate}
                          onChange={handleChange(setSignupData)}
                          className={`${inputClass} text-sm`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Region</label>
                    <div className="relative">
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

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="relative">
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
                    className="btn btn-primary btn-lg w-full"
                  >
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-xs font-medium text-muted-foreground">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={googleSignIn}
                    className="btn btn-outline w-full"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Sign up with Google
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                Secure encrypted
              </span>
              <span className="w-1 h-1 bg-border rounded-full" />
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-warning" />
                Real-time sync
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}
