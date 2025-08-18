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
      router.push(Routes.DASHBOARD.getPath());
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
        redirectTo: `${window.origin}/api/auth/callback?next=${searchParams.get('next') ?? Routes.DASHBOARD.getPath()}`,
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