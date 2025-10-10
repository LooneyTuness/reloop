"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/app/(auth)/sign-up/sign-up-form';
import { SignInForm } from '@/app/(auth)/sign-in/sign-in-form';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthRequiredPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 pt-32 sm:pt-36">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? t("startSelling") : t("signIn")}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? t("createAccountToStartSelling") 
              : t("signInToContinue")}
          </p>
        </div>

        {isSignUp ? <SignUpForm /> : <SignInForm />}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {isSignUp ? (
              <>
                {t("alreadyHaveAccount")} <span className="text-primary font-medium">{t("signIn")}</span>
              </>
            ) : (
              <>
                {t("dontHaveAccount")} <span className="text-primary font-medium">{t("signUp")}</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
