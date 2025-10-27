"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignUpAsVendor } from '@/app/api/auth/sign-in/sign-in.hook';
import { useLanguage } from '@/contexts/LanguageContext';
import { VtorarakaLogo } from '@/components/icons';

type VendorSignUpFormValues = {
  email: string;
  fullName: string;
};

interface VendorSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorSignUpModal({ isOpen, onClose }: VendorSignUpModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();
  
  const vendorSignUpSchema = z.object({
    email: z.string().email(t("emailInvalid")),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
  });
  
  const signUpAsVendor = useSignUpAsVendor();

  const form = useForm<VendorSignUpFormValues>({
    resolver: zodResolver(vendorSignUpSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const handleSubmit = (data: VendorSignUpFormValues) => {
    signUpAsVendor.mutate(
      { email: data.email, fullName: data.fullName, isVendor: true },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="text-center space-y-4">
          <VtorarakaLogo size="lg" className="mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSubmitted ? t("checkYourEmail") : "Sign Up as Vendor"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSubmitted ? t("magicLinkSent") : "Create your vendor account and start selling"}
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                placeholder="Enter your full name"
                type="text"
                autoComplete="name"
                disabled={signUpAsVendor.isPending}
                className="h-12 text-base"
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input
                placeholder={t("enterEmailAddress")}
                type="email"
                autoComplete="email"
                disabled={signUpAsVendor.isPending}
                className="h-12 text-base"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12"
                disabled={signUpAsVendor.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                disabled={signUpAsVendor.isPending}
              >
                {signUpAsVendor.isPending ? "Creating Account..." : "Create Vendor Account"}
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
                Check your email for the magic link to complete your vendor registration.
              </p>
            </div>
            <Button onClick={onClose} className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium">
              {t("continueShopping")}
            </Button>
          </div>
        )}

        {!isSubmitted && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Why Sell with Us?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Free seller account setup</li>
              <li>• Reach thousands of customers</li>
              <li>• Easy product management</li>
              <li>• Secure payment processing</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
