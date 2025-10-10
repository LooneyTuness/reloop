"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { GoogleIcon } from "@/components/icons";
import { signUpSchema } from "@/app/api/auth/sign-up/sign-up.schema";
import { useSignUpWithEmail } from "@/app/api/auth/sign-up/sign-up.hook";
import { useSignInWithSocial } from "@/app/api/auth/sign-in/sign-in.hook";
import { useLanguage } from "@/contexts/LanguageContext";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const signUpWithEmail = useSignUpWithEmail();
  const signInWithSocial = useSignInWithSocial();
  const { t } = useLanguage();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="space-y-6">
      {/* Sign Up Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            signUpWithEmail.mutate(data);
          })}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("fullName")}
                    type="text"
                    autoComplete="name"
                    disabled={signUpWithEmail.isPending}
                    className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 rounded-lg transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("emailAddress")}
                    type="email"
                    autoComplete="email"
                    disabled={signUpWithEmail.isPending}
                    className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 rounded-lg transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder={t("createPassword")}
                    autoComplete="new-password"
                    disabled={signUpWithEmail.isPending}
                    className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 rounded-lg transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    placeholder={t("confirmPassword")}
                    autoComplete="new-password"
                    disabled={signUpWithEmail.isPending}
                    className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 rounded-lg transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-2" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full"
            disabled={signUpWithEmail.isPending}
          >
            {signUpWithEmail.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t("creatingAccount")}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>{t("createAccount")}</span>
              </div>
            )}
          </Button>
        </form>
      </Form>

      {/* Clean Professional annotation */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 font-medium">
            {t("joinThousands")}
          </p>
          <svg className="w-3 h-3 text-gray-600 ml-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
