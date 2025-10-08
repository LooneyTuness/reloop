"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInSchema } from "@/app/api/auth/sign-in/sign-in.schema";
import { useSignInWithEmail } from "@/app/api/auth/sign-in/sign-in.hook";
import { useLanguage } from "@/contexts/LanguageContext";

type AuthFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const signInWithEmail = useSignInWithEmail();
  const { t } = useLanguage();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          signInWithEmail.mutate(data);
        })}
        className="space-y-6"
      >
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
                  disabled={signInWithEmail.isPending}
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
                <Input
                  placeholder={t("enterPassword")}
                  type="password"
                  autoComplete="current-password"
                  disabled={signInWithEmail.isPending}
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
          isPending={signInWithEmail.isPending}
        >
          {t("signIn")}
        </Button>
      </form>
    </Form>
  );
}
