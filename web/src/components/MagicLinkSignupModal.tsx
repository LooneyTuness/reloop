"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignInWithMagicLink } from '@/app/api/auth/sign-in/sign-in.hook';
import { useLanguage } from '@/contexts/LanguageContext';
import { VtorarakaLogo } from '@/components/icons';
import { toast } from 'sonner';

const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

interface MagicLinkSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerEmail?: string;
  buyerName?: string;
}

export default function MagicLinkSignupModal({ 
  isOpen, 
  onClose, 
  buyerEmail = ""
}: MagicLinkSignupModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();
  const signInWithMagicLink = useSignInWithMagicLink(() => {
    toast.error(t("magicLinkFailed"));
  });

  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: buyerEmail,
    },
  });

  const handleSubmit = (data: MagicLinkFormValues) => {
    signInWithMagicLink.mutate(data.email, {
      onSuccess: () => {
        setIsSubmitted(true);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <VtorarakaLogo size="lg" className="mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSubmitted ? t("checkYourEmail") : t("createYourAccount")}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSubmitted 
                ? t("magicLinkSent")
                : t("magicLinkDescription")
              }
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder={t("enterEmailAddress")}
                type="email"
                autoComplete="email"
                disabled={signInWithMagicLink.isPending}
                className="h-12 text-base"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12"
                disabled={signInWithMagicLink.isPending}
              >
                {t("skipForNow")}
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                disabled={signInWithMagicLink.isPending}
              >
                {signInWithMagicLink.isPending ? t("sendingMagicLink") : t("sendMagicLink")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {t("magicLinkSent")}
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              {t("continueShopping")}
            </Button>
          </div>
        )}

        {/* Benefits */}
        {!isSubmitted && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{t("whyCreateAccount")}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>{t("trackOrderStatus")}</li>
              <li>{t("saveShippingDetails")}</li>
              <li>{t("getNotified")}</li>
              <li>{t("easyCheckout")}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
