import { createBrowserClient } from "@/lib/supabase/supabase.browser";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { useSignInWithEmail } from "../sign-in/sign-in.hook";

export type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function useSignUpWithEmail() {
  const posthog = usePostHog();
  const signIn = useSignInWithEmail();

  return useMutation({
    mutationFn: async (data: SignUpValues) => {
      const supabase = createBrowserClient();
  
      // Get redirect URL from query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || '';
      
      // Include redirect URL in the email confirmation link
      // Use environment variable for production, fallback to window.location.origin for development
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const emailRedirectTo = redirectUrl 
        ? `${baseUrl}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`
        : `${baseUrl}/auth/callback`;
      
      console.log('Sign-up with email redirect to:', emailRedirectTo);
      
      const response = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo,
        },
      });
      
      if (response.error) {
        throw response.error;
      }
    },
    onSuccess: () => {
      toast.success('We sent you a confirmation link to your email.');
      // Check if there's a redirect URL in the query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      console.log('Sign-up hook - redirect URL from params:', redirectUrl);
      
      if (redirectUrl) {
        // Store the redirect URL for after email confirmation
        localStorage.setItem('auth_redirect', redirectUrl);
        console.log('Stored redirect URL in localStorage for email confirmation:', redirectUrl);
      }
    },
    onError: (error, variables) => {
      switch (error.message) {
        case 'User already registered':
          signIn.mutate({
            email: variables.email,
            password: variables.password,
          });
          break;
        default:
          posthog.captureException(error);
          toast.error('Something went wrong. Please try again.');
          break;
      }
    },
  });
} 