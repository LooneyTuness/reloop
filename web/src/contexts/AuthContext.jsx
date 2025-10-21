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
    console.log("AuthContext: Initializing auth state...");

    // Always try to get the session first
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log("AuthContext: Initial session check:", {
          user: session?.user?.email,
          error,
          hasSession: !!session,
        });

        if (session?.user) {
          setUser(session.user);
          setLoading(false);

          // Clean up URL parameters if this was a confirmation redirect
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("confirmed") === "true") {
            const url = new URL(window.location);
            url.searchParams.delete("confirmed");
            window.history.replaceState({}, "", url);
          }
        } else {
          // Check if this is a confirmation redirect and retry
          const urlParams = new URLSearchParams(window.location.search);
          const isConfirmed = urlParams.get("confirmed") === "true";

          if (isConfirmed) {
            console.log(
              "AuthContext: Confirmation redirect detected, retrying session..."
            );
            // Wait a bit and try again
            setTimeout(async () => {
              const {
                data: { session: retrySession },
                error: retryError,
              } = await supabase.auth.getSession();
              console.log("AuthContext: Retry session check:", {
                user: retrySession?.user?.email,
                error: retryError,
                hasSession: !!retrySession,
              });

              if (retrySession?.user) {
                setUser(retrySession.user);
                setLoading(false);

                // Clean up URL parameters
                const url = new URL(window.location);
                url.searchParams.delete("confirmed");
                window.history.replaceState({}, "", url);
              } else {
                setUser(null);
                setLoading(false);
              }
            }, 1000);
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("AuthContext: Error initializing auth:", error);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthContext: Auth state change:", {
        event,
        user: session?.user?.email,
      });
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
