"use client";

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

function AuthSuccessContent() {
  const [user, setUser] = useState<{ id: string; email?: string; email_confirmed_at?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [checkingVendor, setCheckingVendor] = useState(true);
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

  // Check if user is a vendor
  useEffect(() => {
    if (!user?.id) {
      setCheckingVendor(false);
      return;
    }

    const checkVendorStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('seller_profiles')
          .select('is_approved, role')
          .eq('user_id', user.id)
          .single();

        if (!error && profile) {
          setIsVendor(true);
        }
      } catch (err) {
        console.error('Error checking vendor status:', err);
      } finally {
        setCheckingVendor(false);
      }
    };

    checkVendorStatus();
  }, [user]);

  if (loading || checkingVendor) {
    return (
      <div 
        className="h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')",
          minHeight: '100dvh'
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="w-full max-w-md">
            <div className="bg-black/90 rounded-2xl border border-gray-600/30 shadow-2xl p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-6"></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">{t("confirmingYourEmail")}</p>
                <p className="text-sm text-gray-300">{t("pleaseWait")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')",
          minHeight: '100dvh'
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="w-full max-w-md">
            <div className="bg-black/90 rounded-2xl border border-gray-600/30 shadow-2xl p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl font-bold text-white">{t("confirmationError")}</h1>
                <p className="text-base text-gray-300">
                  {t("thereWasAnError")}
                </p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-left mb-6">
                <p className="text-sm text-red-300">
                  <strong>{t("error")}</strong> {error}
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/sign-up')}
                  className="w-full h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-colors"
                >
                  {t("tryAgain")}
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full text-gray-300 hover:text-white py-2 text-sm transition-colors"
                >
                  {t("goToHomepage")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')",
        minHeight: '100dvh'
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-16">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-black/90 rounded-2xl border border-gray-600/30 shadow-2xl p-4 sm:p-8">
            {user ? (
              <div className="text-center space-y-4 sm:space-y-6">
                {/* Success Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 mt-1 sm:mt-2">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Success Message */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {t("welcomeToVtoraraka")}!
                  </h1>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed px-1">
                    {isVendor
                      ? "Сега сте најавени! Започнете го вашето патување кон одржлива мода."
                      : fromMagicLink 
                        ? t("youreNowSignedIn")
                        : t("emailConfirmed")}
                  </p>
                </div>

                {/* Action Button */}
                {isVendor ? (
                  <button
                    onClick={() => router.push('/seller-dashboard')}
                    className="w-full h-10 sm:h-12 bg-white hover:bg-gray-100 text-black font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Отвори го таблата за продавачи
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/')}
                    className="w-full h-10 sm:h-12 bg-white hover:bg-gray-100 text-black font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t("startShopping")}
                  </button>
                )}

                {/* Playful annotation */}
                {!isVendor && (
                  <div className="text-center pt-1 sm:pt-2 pb-1 sm:pb-2">
                    <p className="text-xs sm:text-sm text-green-400 font-medium">
                      {t("readyToMakeDifference")}
                      <span className="ml-1 text-sm sm:text-base">♻️</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 sm:space-y-6">
                {/* Email Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 mt-1 sm:mt-2">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Email Confirmation Message */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {t("checkYourEmail")}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed px-1">
                    {fromMagicLink 
                      ? t("magicLinkSent")
                      : t("confirmationLinkSent")}
                  </p>
                </div>
                
                {/* Help Section */}
                <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 sm:p-4 text-left mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-gray-300 mb-2 font-medium">
                    {fromMagicLink ? t("cantFindMagicLink") : t("cantFindEmail")}
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                    <li>{t("checkSpamFolder")}</li>
                    <li>{t("waitFewMinutes")}</li>
                    <li>{t("makeSureEmailCorrect")}</li>
                    {fromMagicLink && <li>{t("magicLinksExpire")}</li>}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3 pb-1 sm:pb-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full text-gray-300 hover:text-white py-1 sm:py-2 text-xs sm:text-sm transition-colors"
                  >
                    {t("alreadyConfirmedEmail")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div 
        className="h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')",
          minHeight: '100dvh'
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="w-full max-w-md">
            <div className="bg-black/90 rounded-2xl border border-gray-600/30 shadow-2xl p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-6"></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">Confirming your email...</p>
                <p className="text-sm text-gray-300">Please wait a moment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
