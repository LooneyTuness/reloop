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
  FormMessage,
} from "@/components/ui/form";
import { useSignInWithMagicLink } from "@/app/api/auth/sign-in/sign-in.hook";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

export function SignInForm() {
  const { t } = useLanguage();
  const signInWithMagicLink = useSignInWithMagicLink(() => {
    toast.error(t("magicLinkFailed"));
  });

  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleMagicLinkSubmit = (data: MagicLinkFormValues) => {
    signInWithMagicLink.mutate(data.email);
  };

  return (
    <div className="space-y-6">
      {/* Magic Link Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleMagicLinkSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("enterEmailAddress")}
                    type="email"
                    autoComplete="email"
                    disabled={signInWithMagicLink.isPending}
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
            disabled={signInWithMagicLink.isPending}
          >
            {signInWithMagicLink.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t("sendingMagicLink")}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{t("sendMagicLink")}</span>
              </div>
            )}
          </Button>
        </form>
      </Form>

      {/* Clean Professional annotation */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600 font-medium">
            {t("oneClickAndYoureIn")}
          </p>
        </div>
      </div>
    </div>
  );
}
