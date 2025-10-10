"use client";

import Link from "next/link";
import { SignUpForm } from "@/app/(auth)/sign-up/sign-up-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { VtorarakaLogo } from "@/components/icons";

export default function SignUp() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl"></div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-lg animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 pt-24 sm:pt-28 pb-8">
        <div className="w-full max-w-md">
          {/* Enhanced Professional Card */}
          <div className="professional-card p-8 sm:p-10 shadow-luxury animate-fade-in-up">
            {/* Logo */}
            <div className="text-center mb-8 animate-scale-in delay-100">
              <VtorarakaLogo size="lg" className="mx-auto" />
            </div>

            {/* Main heading and subheading */}
            <div className="text-center space-y-3 mb-8 animate-fade-in-up delay-200">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {t("welcomeToVtoraraka")}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("startSustainableJourney")}
              </p>
            </div>

            {/* Authentication form */}
            <div className="space-y-6 animate-fade-in-up delay-300">
              <SignUpForm />

              {/* Sign in link */}
              <div className="text-center pt-4 animate-fade-in-up delay-400">
                <p className="text-sm text-gray-600">
                  {t("alreadyHaveAccount")}{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 underline underline-offset-4 hover:underline-offset-2"
                  >
                    {t("signIn")}
                  </Link>
                </p>
              </div>

              {/* Terms and Privacy */}
              <div className="text-xs text-center text-gray-500 pt-2 animate-fade-in-up delay-500">
                {t("byContinuing")}{" "}
                <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-gray-700 transition-colors duration-200"
                >
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-gray-700 transition-colors duration-200"
                >
                  {t("privacyPolicy")}
                </Link>
              </div>
            </div>
          </div>

          {/* Clean Trust Indicators */}
          <div className="mt-8 text-center animate-fade-in-up delay-600">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 font-medium">{t("secure")}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 font-medium">{t("private")}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 font-medium">{t("fast")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
