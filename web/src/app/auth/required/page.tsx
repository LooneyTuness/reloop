"use client";

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpForm } from '@/app/(auth)/sign-up/sign-up-form';
import { SignInForm } from '@/app/(auth)/sign-in/sign-in-form';
import { useLanguage } from '@/contexts/LanguageContext';

function AuthRequiredContent() {
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50bg-gray-900 py-12 px-4 pt-32 sm:pt-36 relative">
      <div className="max-w-md w-full bg-whitebg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900text-white mb-2">
            {isSignUp ? t("startSelling") : t("signIn")}
          </h1>
          <p className="text-gray-600text-gray-400">
            {isSignUp 
              ? t("createAccountToStartSelling") 
              : t("signInToContinue")}
          </p>
        </div>

        {isSignUp ? <SignUpForm /> : <SignInForm />}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-600text-gray-400 hover:text-gray-900hover:text-white"
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
            className="text-sm text-gray-500text-gray-400 hover:text-gray-700hover:text-gray-300"
          >
            ← {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthRequiredPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50bg-gray-900 py-12 px-4 pt-32 sm:pt-36">
        <div className="max-w-md w-full bg-whitebg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900text-white mb-2">
              Loading...
            </h1>
            <p className="text-gray-600text-gray-400">
              Please wait a moment
            </p>
          </div>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-12 bg-gray-200bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-12 bg-gray-200bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-12 bg-gray-200bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    }>
      <AuthRequiredContent />
    </Suspense>
  );
}
