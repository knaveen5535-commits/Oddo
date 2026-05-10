"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  supabaseUser: User | null;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("[AUTH] Initializing Identity Hub...");

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error("[AUTH] Session retrieval error:", error.message);
      
      if (session) {
        console.log("[AUTH] Session recovered for:", session.user.email);
      } else {
        console.log("[AUTH] No existing session found.");
      }
      
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[AUTH] Auth State Changed: ${event}`);
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    console.log("[AUTH] Initiating termination of traveler session...");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Map Supabase User to our AuthUser format
  const mappedUser: AuthUser | null = supabaseUser ? {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || "Explorer",
    email: supabaseUser.email || "",
    avatar: supabaseUser.user_metadata?.avatar_url || null,
    token: session?.access_token
  } : null;

  return (
    <AuthContext.Provider value={{ user: mappedUser, isLoading, logout, supabaseUser, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
