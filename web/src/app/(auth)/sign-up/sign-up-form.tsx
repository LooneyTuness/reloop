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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema } from "@/app/api/auth/sign-up/sign-up.schema";
import { useSignUpWithEmail } from "@/app/api/auth/sign-up/sign-up.hook";
import { useLanguage } from "@/contexts/LanguageContext";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const signUpWithEmail = useSignUpWithEmail();
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          signUpWithEmail.mutate(data);
        })}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("enterFullName")}
                  type="text"
                  autoComplete="name"
                  disabled={signUpWithEmail.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("enterEmail")}
                  type="email"
                  autoComplete="email"
                  disabled={signUpWithEmail.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("enterPassword")}
                  autoComplete="new-password"
                  disabled={signUpWithEmail.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                  disabled={signUpWithEmail.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          isPending={signUpWithEmail.isPending}
        >
          {t("createAccountButton")}
        </Button>
      </form>
    </Form>
  );
}
