"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { SignInForm } from "@/app/(auth)/sign-in/sign-in-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { VtorarakaLogo } from "@/components/icons";
import { ArrowLeft } from "lucide-react";

function SignInContent() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }
        #__next {
          height: 100%;
        }
      `}</style>
      <div 
        className="h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')",
          minHeight: '100dvh' // Dynamic viewport height for mobile
        }}
      >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-black/40"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">{t("back")}</span>
      </button>

      {/* Main Content - Full height layout */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="w-full max-w-md">
          {/* Professional Card - matching image design */}
          <div className="bg-black/90 rounded-2xl border border-gray-600/30 shadow-2xl p-6 sm:p-8">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-white text-lg font-medium">vtoraraka.mk</span>
            </div>

            {/* Main heading and subheading */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {t("welcomeBack")}
              </h1>
              <p className="text-sm sm:text-base text-white leading-relaxed">
                {t("continueJourney")}
              </p>
            </div>

            {/* Authentication form */}
            <div className="space-y-6">
              <SignInForm />
            </div>
          </div>

          {/* Trust Indicators - matching image design */}
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-black/50 rounded-lg border border-gray-600/30">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium text-sm">{t("secure")}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-black/50 rounded-lg border border-gray-600/30">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium text-sm">{t("private")}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-black/50 rounded-lg border border-gray-600/30 w-fit">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium text-sm">{t("fast")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div 
        className="h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')",
          minHeight: '100dvh', // Dynamic viewport height for mobile
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="w-full max-w-md">
            <div className="bg-black/90 rounded-2xl border border-gray-600/30 shadow-2xl p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <VtorarakaLogo size="lg" className="mx-auto" />
              </div>
              <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Loading...
                </h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Please wait a moment
                </p>
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
