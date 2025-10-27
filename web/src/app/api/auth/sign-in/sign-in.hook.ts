import { createBrowserClient } from "@/lib/supabase/supabase.browser";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import * as Routes from "@/lib/routes";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import { useLanguage } from "@/contexts/LanguageContext";

export function useSignInWithEmail() {
  const router = useRouter();
  const posthog = usePostHog();
  const { t } = useLanguage();

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
          toast.error(t('invalidEmailOrPassword'));
          break;
        case 'Email not confirmed':
          toast.error(t('emailNotConfirmed'));
          break;
        default:
          posthog.captureException(error);
          toast.error(t('somethingWentWrong'));
          break;
      }
    },
  });
}

export function useSignInWithSocial() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
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
      toast.error(t('somethingWentWrong'));
    }
  });
}

export function useSignInWithMagicLink(onError?: (error: Error) => void) {
  const router = useRouter();
  const posthog = usePostHog();
  const { t } = useLanguage();

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
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
        },
      });
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t('checkEmailForMagicLink'));
      // Redirect to success page with magic link indicator
      router.push('/auth/success?from=magiclink');
    },
    onError: (error) => {
      posthog.captureException(error);
      if (onError) {
        onError(error);
      } else {
        toast.error(t('magicLinkFailed'));
      }
    },
  });
}

export function useSignUpAsVendor() {
  const router = useRouter();
  const posthog = usePostHog();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (data: { email: string; fullName: string; isVendor: boolean }) => {
      const supabase = createBrowserClient();

      // 1. Create auth user with magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: {
            full_name: data.fullName,
            is_vendor: data.isVendor,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm?vendor=true`,
        },
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t('checkEmailForMagicLink'));
      // Store that this is a vendor sign-up
      localStorage.setItem('pending_vendor_signup', 'true');
      router.push('/auth/success?from=vendor-signup');
    },
    onError: (error) => {
      posthog.captureException(error);
      toast.error(error.message || t('somethingWentWrong'));
    },
  });
}