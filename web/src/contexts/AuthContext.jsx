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

    // Check if this is a confirmation redirect
    const urlParams = new URLSearchParams(window.location.search);
    const isConfirmed = urlParams.get('confirmed') === 'true';

    if (isConfirmed) {
      console.log("AuthContext: Detected confirmation redirect, refreshing session...");
      // Force refresh the session when coming from a confirmation link
      // Add a small delay to ensure the session is properly set
      setTimeout(() => {
        let retryCount = 0;
        const maxRetries = 5;
        
        const refreshSession = () => {
          if (retryCount >= maxRetries) {
            console.log("AuthContext: Max retries reached, giving up");
            setLoading(false);
            return;
          }
          
          supabase.auth.getSession().then(({ data: { session }, error }) => {
            console.log("AuthContext: Refreshed session after confirmation:", {
              user: session?.user?.email,
              error,
              retryCount,
            });
            
            if (session?.user) {
              setUser(session.user);
              setLoading(false);
              
              // Clean up URL parameters after successful authentication
              const url = new URL(window.location);
              url.searchParams.delete('confirmed');
              window.history.replaceState({}, '', url);
            } else {
              // If no session found, try again after a short delay
              retryCount++;
              console.log("AuthContext: No session found, retrying...", retryCount);
              setTimeout(refreshSession, 500);
            }
          });
        };
        
        refreshSession();
      }, 100);
    } else {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        console.log("AuthContext: Initial session check:", {
          user: session?.user?.email,
          error,
        });
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

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
