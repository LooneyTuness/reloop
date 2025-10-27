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

type MagicLinkFormValues = {
  email: string;
};

export function SignInForm() {
  const { t } = useLanguage();
  
  const magicLinkSchema = z.object({
    email: z.string().email(t("emailInvalid")),
  });
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
                    className="h-12 text-base border-gray-600/30 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 rounded-lg transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-400 mt-2" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full h-12 bg-white text-black hover:bg-gray-100 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            disabled={signInWithMagicLink.isPending}
          >
            {signInWithMagicLink.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                <span className="text-base">{t("sendingMagicLink")}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base">{t("sendMagicLink")}</span>
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Professional annotation - matching image style */}
      <div className="text-center pt-2">
        <p className="text-base leading-relaxed text-white">
          {t("oneClickAndYoureIn")}
        </p>
      </div>
    </div>
  );
}
