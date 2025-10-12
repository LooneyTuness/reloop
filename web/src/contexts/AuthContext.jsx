"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing authentication...");

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("AuthContext: getSession result:");
      console.log("- Session exists:", !!session);
      console.log("- User exists:", !!session?.user);
      console.log("- User ID:", session?.user?.id);
      console.log("- User email:", session?.user?.email);
      console.log("- Error:", error);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthContext: Auth state change:");
      console.log("- Event:", event);
      console.log("- Session exists:", !!session);
      console.log("- User exists:", !!session?.user);
      console.log("- User ID:", session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Handle sign out error silently in production
    }
  };

  const logout = signOut; // Alias for compatibility

  const value = {
    user,
    signOut,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
