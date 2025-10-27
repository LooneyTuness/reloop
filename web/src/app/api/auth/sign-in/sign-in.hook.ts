import { createBrowserClient } from "@/lib/supabase/supabase.browser";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import * as Routes from "@/lib/routes";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";

export function useSignInWithEmail() {
  const router = useRouter();
  const posthog = usePostHog();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const supabase = createBrowserClient();
  
      const response = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (response.error) {
        throw response.error;
      }
    },
    onSuccess: () => {
      // Check if there's a return URL in the query params, otherwise go to home
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl') || Routes.HOME.getPath();
      router.push(returnUrl);
    },
    onError: (error) => {
      switch (error.message) {
        case 'Invalid login credentials':
          toast.error('Invalid email or password.');
          break;
        case 'Email not confirmed':
          toast.error('Your email is not confirmed. Please open the confirmation email we sent you.');
          break;
        default:
          posthog.captureException(error);
          toast.error('Something went wrong. Please try again.');
          break;
      }
    },
  });
}

export function useSignInWithSocial() {
  const searchParams = useSearchParams();
  
  return useMutation({
    mutationFn: async (provider: "google") => {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
        redirectTo: `${window.origin}/api/auth/callback?next=${searchParams.get('next') ?? Routes.HOME.getPath()}`,
      },
      });
      
      if (error) {
        throw error;
      }
    },
    onError: (error) => {
      posthog.captureException(error);
      toast.error('Something went wrong. Please try again.');
    }
  });
}

export function useSignInWithMagicLink(onError?: (error: Error) => void, t?: (key: string) => string) {
  const router = useRouter();
  const posthog = usePostHog();

  return useMutation({
    mutationFn: async (email: string) => {
      const supabase = createBrowserClient();
      
      // Check if there's a redirect URL in the query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrlFromQuery = urlParams.get('redirect');
      const redirectUrlFromStorage = localStorage.getItem('auth_redirect') || '';
      
      // Use redirect from query params first, then localStorage, then let callback determine
      const redirectUrl = redirectUrlFromQuery || redirectUrlFromStorage;
      console.log('Magic link hook - chosen redirect URL:', redirectUrl, {
        fromQuery: redirectUrlFromQuery,
        fromStorage: redirectUrlFromStorage,
      });
      
      // Include redirect URL in the magic link callback URL
      // Use environment variable for production, fallback to window.location.origin for development
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const emailRedirectTo = redirectUrl 
        ? `${baseUrl}/auth/confirm?redirect=${encodeURIComponent(redirectUrl)}`
        : `${baseUrl}/auth/confirm`;
      
      console.log('=== MAGIC LINK CONFIGURATION ===');
      console.log('Base URL:', baseUrl);
      console.log('Redirect URL from params/storage:', redirectUrl);
      console.log('Magic link email redirect to:', emailRedirectTo);
      console.log('==================================');
      
      // Store redirect URL in localStorage as backup (even if empty, so callback can determine)
      localStorage.setItem('auth_redirect', redirectUrl || '');
      console.log('Stored redirect URL in localStorage:', redirectUrl || '');
      
      console.log('Attempting to send magic link to:', email);
      
      const { error, data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
        },
      });
      
      console.log('Magic link response:', { error, data: !!data });
      
      if (error) {
        console.error('Magic link error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Check your email for the magic link!');
      // Redirect to success page with magic link indicator
      router.push('/auth/success?from=magiclink');
    },
    onError: (error) => {
      console.error('Magic link mutation error:', error);
      posthog.captureException(error);
      
      // Provide more specific error messages
      let errorMessage = t ? t('magicLinkFailed') : 'Failed to send magic link. Please try again.';
      
      if (error.message) {
        // Rate limiting error - check for specific countdown message
        if (error.message.includes('can only request this after')) {
          const match = error.message.match(/after (\d+) seconds/);
          const seconds = match ? match[1] : '60';
          if (t) {
            errorMessage = t('magicLinkWaitXSeconds').replace('{seconds}', seconds);
          } else {
            errorMessage = `Please wait ${seconds} more seconds before requesting another magic link.`;
          }
        }
        else if (error.message.includes('rate limit') || error.message.includes('too many')) {
          errorMessage = t ? t('magicLinkTooManyRequests') : 'Too many requests. Please wait a minute and try again.';
        }
        // Email not found or invalid
        else if (error.message.includes('not found') || error.message.includes('invalid')) {
          errorMessage = t ? t('magicLinkInvalidEmail') : 'Invalid email address. Please check and try again.';
        }
        // Network error
        else if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMessage = t ? t('magicLinkNetworkError') : 'Network error. Please check your connection and try again.';
        }
      }
      
      if (onError) {
        onError(error);
      } else {
        toast.error(errorMessage);
      }
    },
  });
}