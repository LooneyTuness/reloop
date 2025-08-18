import { createBrowserClient } from "@/lib/supabase/supabase.browser";

export type AuthProvider = "google" | "email";

export async function signInWithProvider(provider: AuthProvider) {
  const supabase = createBrowserClient();
  
  if (provider === "google") {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }
  
  return { error: new Error("Provider not supported") };
}

export async function signOut() {
  const supabase = createBrowserClient();
  return supabase.auth.signOut();
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createBrowserClient();
  
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
} 