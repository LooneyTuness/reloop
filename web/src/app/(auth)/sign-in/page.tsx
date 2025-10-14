"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { SignInForm } from "@/app/(auth)/sign-in/sign-in-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { VtorarakaLogo } from "@/components/icons";

function SignInContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50bg-gray-900 relative">
      {/* Main Content - Account for navbar height */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="w-full max-w-md">
          {/* Professional Card - matching dashboard style */}
          <div className="bg-whitebg-gray-800 rounded-xl border border-gray-200border-gray-700 shadow-lg p-6 sm:p-8">
            {/* Logo */}
            <div className="text-center mb-6 sm:mb-8">
              <VtorarakaLogo size="lg" className="mx-auto" />
            </div>

            {/* Main heading and subheading */}
            <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900text-white">
                {t("welcomeBack")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600text-gray-400">
                {t("continueJourney")}
              </p>
            </div>

            {/* Authentication form */}
            <div className="space-y-4 sm:space-y-6">
              <SignInForm />

              {/* Sign up link */}
              <div className="text-center pt-2 sm:pt-4">
                <p className="text-sm text-gray-600text-gray-400">
                  {t("dontHaveAccount")}{" "}
                  <Link
                    href="/sign-up"
                    className="font-semibold text-blue-600text-blue-400 hover:text-blue-700hover:text-blue-300 transition-colors duration-200"
                  >
                    {t("join")}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators - matching dashboard style */}
          <div className="mt-4 sm:mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-xs">
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-whitebg-gray-800 rounded-lg border border-gray-200border-gray-700">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600text-gray-400 font-medium text-xs sm:text-sm">{t("secure")}</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-whitebg-gray-800 rounded-lg border border-gray-200border-gray-700">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600text-gray-400 font-medium text-xs sm:text-sm">{t("private")}</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-whitebg-gray-800 rounded-lg border border-gray-200border-gray-700">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600text-gray-400 font-medium text-xs sm:text-sm">{t("fast")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="w-full max-w-md">
          <div className="bg-whitebg-gray-800 rounded-xl border border-gray-200border-gray-700 shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <VtorarakaLogo size="lg" className="mx-auto" />
            </div>
            <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900text-white">
                Loading...
              </h1>
              <p className="text-sm sm:text-base text-gray-600text-gray-400">
                Please wait a moment
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
