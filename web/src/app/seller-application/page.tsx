"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SellerApplicationPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checking, setChecking] = useState(true);

  const createSellerProfile = useCallback(async () => {
    if (!user) return;

    setIsProcessing(true);

    try {
      console.log('Creating seller profile for user:', user.id, user.email);
      
      // Call the API route to create seller profile
      const response = await fetch('/api/create-seller-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          role: 'seller'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let result;
        try {
          result = JSON.parse(errorText);
        } catch {
          result = { error: errorText };
        }
        
        console.error('Error creating seller profile:', result, 'Status:', response.status);
        
        // If it's a 404, the API route doesn't exist (deployment issue)
        if (response.status === 404) {
          toast.error(t('errorCreatingSellerProfile') + ': API endpoint not found. Please contact support.');
        } else if (response.status === 409) {
          // Profile already exists, redirect to dashboard
          console.log('Profile already exists, redirecting to dashboard');
          toast.success('Welcome back!');
          setTimeout(() => {
            router.push('/seller-dashboard');
          }, 500);
          return;
        } else {
          toast.error(t('errorCreatingSellerProfile') + ': ' + (result.error || t('unknownError')));
        }
        
        setIsProcessing(false);
        setChecking(false);
        return;
      }

      const result = await response.json();
      console.log('Seller profile created successfully:', result);
      
      // Success message based on whether it was created or already existed
      if (result.message && result.message.includes('already exists')) {
        toast.success('Welcome back!');
      } else {
        toast.success(t('sellerProfileCreatedSuccess'));
      }
      
      // Wait a moment for the toast to show, then redirect
      setTimeout(() => {
        router.push('/seller-dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error creating seller profile:', err);
      toast.error(t('errorCreatingSellerProfile') + ': ' + (err instanceof Error ? err.message : t('unknownError')));
      setIsProcessing(false);
      setChecking(false);
    }
  }, [user, router, t]);

  useEffect(() => {
    const checkSellerProfile = async () => {
      // Always wait for auth to finish loading
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      // If not authenticated, immediately redirect to sign-in
      if (!user) {
        console.log('No user found, redirecting to sign-in');
        // Store the redirect URL in localStorage for the magic link flow
        localStorage.setItem('auth_redirect', '/seller-application');
        router.push('/sign-in?redirect=/seller-application');
        return;
      }

      // Additional validation: ensure user has required fields
      if (!user.id || !user.email) {
        console.log('User missing required fields, redirecting to sign-in');
        // Store the redirect URL in localStorage for the magic link flow
        localStorage.setItem('auth_redirect', '/seller-application');
        router.push('/sign-in?redirect=/seller-application');
        return;
      }

      console.log('User authenticated, proceeding to check seller profile');
      setChecking(true);

      try {
        console.log('Checking seller profile for user:', user.id, user.email);
        
        // Check if user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking seller profile:', profileError);
          
          // If it's a 406 or other error, try to create a profile anyway
          if (profileError.code === 'PGRST116' || profileError.code === '42501' || profileError.code?.includes('406')) {
            console.log('No seller profile found or access error, creating one automatically');
            await createSellerProfile();
          } else {
            toast.error(t('errorCheckingSellerProfile'));
            setChecking(false);
          }
        } else if (profile) {
          console.log('Seller profile found:', profile);
          // Profile exists, redirect to dashboard
          router.push('/seller-dashboard');
        } else {
          // No profile found - create one automatically
          console.log('No seller profile found, creating one automatically');
          await createSellerProfile();
        }
      } catch (err) {
        console.error('Error checking seller profile:', err);
        toast.error(t('errorProcessingRequest'));
        setChecking(false);
      }
    };

    checkSellerProfile();
  }, [user, authLoading, router, createSellerProfile, t]);

  // Show loading state
  if (authLoading || checking || isProcessing || !user) {
    return (
      <div className="min-h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')"
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Header - optimized for small screens */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 z-20">
          <h1 className="text-white text-sm sm:text-base md:text-lg font-medium">vtoraraka.mk</h1>
        </div>

        {/* Main content - centered */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6">
          <div className="text-center max-w-xs sm:max-w-md w-full">
            {/* Loading spinner - smaller on mobile */}
            <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-white" />
            </div>

            {/* Title - responsive sizing */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {authLoading || !user ? t('pleaseWait') : t('settingUpYourSellerAccount')}
            </h2>
            
            {/* Status message - responsive sizing */}
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
              {authLoading || !user 
                ? t('checkingYourAccount') 
                : isProcessing 
                  ? t('creatingYourSellerProfile') 
                  : t('checkingYourAccount')
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // This shouldn't be reached as we redirect in useEffect, but just in case
  return (
    <div className="min-h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Header - optimized for small screens */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 z-20">
        <h1 className="text-white text-sm sm:text-base md:text-lg font-medium">vtoraraka.mk</h1>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="text-center max-w-xs sm:max-w-md w-full">
          {/* Loading spinner - smaller on mobile */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-white" />
          </div>

          {/* Title - responsive sizing */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            {t('pleaseWait')}
          </h2>
          
          {/* Status message - responsive sizing */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
            {t('loading')}
          </p>
        </div>
      </div>
    </div>
  );
}
