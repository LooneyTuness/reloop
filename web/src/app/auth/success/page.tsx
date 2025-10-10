"use client";

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

function AuthSuccessContent() {
  const [user, setUser] = useState<{ id: string; email?: string; email_confirmed_at?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const confirmed = searchParams.get('confirmed');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('description');
  const fromMagicLink = searchParams.get('from') === 'magiclink';

  useEffect(() => {
    // Handle errors from callback
    if (errorParam) {
      setError(errorDescription || errorParam);
      setLoading(false);
      return;
    }
    const checkUser = async () => {
      // If coming from email confirmation, give more time for session to be established
      if (confirmed === 'true') {
        // Wait for cookies and session to be set
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try multiple times to get the session
        for (let i = 0; i < 5; i++) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            setLoading(false);
            return;
          }
          // Wait a bit before trying again
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // If still no session after retries, stop loading
        setLoading(false);
        return;
      }
      
      // Not from confirmation - check session normally
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        return;
      }

      // If no session, wait a bit and try again
      setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
      }, 2000);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [confirmed, errorParam, errorDescription]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">{t("confirmingYourEmail")}</p>
            <p className="text-sm text-gray-500">{t("pleaseWait")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{t("confirmationError")}</h1>
            <p className="text-lg text-gray-600">
              {t("thereWasAnError")}
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm text-red-700">
              <strong>{t("error")}</strong> {error}
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/sign-up')}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              {t("tryAgain")}
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
            >
              {t("goToHomepage")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 px-6">
        {user ? (
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {t("welcomeToVtoraraka")}!
              </h1>
              <p className="text-lg text-gray-600">
                {fromMagicLink 
                  ? t("youreNowSignedIn")
                  : t("emailConfirmed")}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => router.push('/')}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              {t("startShopping")}
            </button>

            {/* Playful annotation */}
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">
                {t("readyToMakeDifference")}
                <span className="ml-1">♻️</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            {/* Email Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Email Confirmation Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {t("checkYourEmail")}
              </h1>
              <p className="text-lg text-gray-600">
                {fromMagicLink 
                  ? t("magicLinkSent")
                  : t("confirmationLinkSent")}
              </p>
            </div>
            
            {/* Help Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                {fromMagicLink ? t("cantFindMagicLink") : t("cantFindEmail")}
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>{t("checkSpamFolder")}</li>
                <li>{t("waitFewMinutes")}</li>
                <li>{t("makeSureEmailCorrect")}</li>
                {fromMagicLink && <li>{t("magicLinksExpire")}</li>}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                {t("browseProductsMeantime")}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
              >
                {t("alreadyConfirmedEmail")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Confirming your email...</p>
            <p className="text-sm text-gray-500">Please wait a moment</p>
          </div>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
