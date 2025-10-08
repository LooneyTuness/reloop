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
  
      const response = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (response.error) {
        throw response.error;
      }
    },
    onSuccess: () => {
      toast.success('We sent you a confirmation link to your email.');
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