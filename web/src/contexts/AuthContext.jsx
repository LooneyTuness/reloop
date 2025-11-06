"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import posthog from "posthog-js";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always try to get the session first
    const initializeAuth = async () => {
      try {
        console.log("AuthContext: Initializing auth...");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("AuthContext: Initial session check:", {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: error?.message,
        });

        if (session?.user) {
          console.log(
            "AuthContext: Session found, setting user:",
            session.user.email
          );
          setUser(session.user);
          setLoading(false);

          // Identify user in PostHog
          if (typeof window !== "undefined") {
            try {
              posthog.identify(session.user.id, {
                email: session.user.email,
                user_id: session.user.id,
              });
            } catch (error) {
              // PostHog might not be initialized yet, ignore
              console.debug("PostHog not ready for identification:", error);
            }
          }

          // Clean up URL parameters if this was a confirmation redirect
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("confirmed") === "true") {
            const url = new URL(window.location);
            url.searchParams.delete("confirmed");
            window.history.replaceState({}, "", url);
          }
        } else {
          console.log("AuthContext: No session found initially");

          // Check if this is a confirmation redirect and retry
          const urlParams = new URLSearchParams(window.location.search);
          const isConfirmed = urlParams.get("confirmed") === "true";

          if (isConfirmed) {
            console.log(
              "AuthContext: Confirmed redirect detected, retrying session..."
            );

            // Wait a bit and try again
            setTimeout(async () => {
              const {
                data: { session: retrySession },
                error: retryError,
              } = await supabase.auth.getSession();

              if (retrySession?.user) {
                console.log(
                  "AuthContext: Session found on retry:",
                  retrySession.user.email
                );
                setUser(retrySession.user);
                setLoading(false);

                // Identify user in PostHog
                if (typeof window !== "undefined") {
                  try {
                    posthog.identify(retrySession.user.id, {
                      email: retrySession.user.email,
                      user_id: retrySession.user.id,
                    });
                  } catch (error) {
                    // PostHog might not be initialized yet, ignore
                    console.debug(
                      "PostHog not ready for identification:",
                      error
                    );
                  }
                }

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
      console.log("AuthContext: Auth state change event:", event, {
        hasSession: !!session,
        userEmail: session?.user?.email,
      });

      // Handle different auth events
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("AuthContext: Signed in or token refreshed, updating user");
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        // Identify user in PostHog
        if (currentUser && typeof window !== "undefined") {
          try {
            posthog.identify(currentUser.id, {
              email: currentUser.email,
              user_id: currentUser.id,
            });
          } catch (error) {
            // PostHog might not be initialized yet, ignore
            console.debug("PostHog not ready for identification:", error);
          }
        }
      } else if (event === "SIGNED_OUT") {
        console.log("AuthContext: Signed out");
        setUser(null);
        setLoading(false);

        // Reset PostHog user
        if (typeof window !== "undefined") {
          try {
            posthog.reset();
          } catch (error) {
            // PostHog might not be initialized yet, ignore
            console.debug("PostHog not ready for reset:", error);
          }
        }
      } else {
        // For other events, update user state
        console.log("AuthContext: Other auth event, updating user state");
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        // Identify user in PostHog if user exists
        if (currentUser && typeof window !== "undefined" && posthog.__loaded) {
          posthog.identify(currentUser.id, {
            email: currentUser.email,
            user_id: currentUser.id,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Handle sign out error silently in production
    } else {
      // Reset PostHog user on sign out
      if (typeof window !== "undefined") {
        try {
          posthog.reset();
        } catch (error) {
          // PostHog might not be initialized yet, ignore
          console.debug("PostHog not ready for reset:", error);
        }
      }
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
