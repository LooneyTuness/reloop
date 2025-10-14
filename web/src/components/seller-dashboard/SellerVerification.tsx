'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseDataService } from '@/lib/supabase/data-service';

interface SellerVerificationProps {
  children: React.ReactNode;
}

export default function SellerVerification({ children }: SellerVerificationProps) {
  console.log('SellerVerification: Component rendered');
  
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verificationAttempted = useRef(false);

  const verifySeller = useCallback(async () => {
    console.log('SellerVerification: Starting verification for user:', user?.id, 'loading:', loading);
    
    // Wait for authentication to complete before making any decisions
    if (loading) {
      console.log('SellerVerification: Authentication still loading, waiting...');
      return;
    }
    
    if (!user?.id) {
      console.log('SellerVerification: No user ID after loading complete, redirecting to sign-in');
      router.push('/sign-in');
      return;
    }

    if (verificationAttempted.current) {
      console.log('SellerVerification: Verification already attempted, skipping');
      return;
    }

    if (isSeller) {
      console.log('SellerVerification: Already verified as seller, skipping');
      return;
    }

    verificationAttempted.current = true;
    
    try {
      console.log('SellerVerification: Fetching seller profile...');
      const sellerProfile = await supabaseDataService.getSellerProfile(user.id);
      console.log('SellerVerification: Seller profile result:', sellerProfile);
      
      if (!sellerProfile) {
        console.log('SellerVerification: No seller profile found');
        setError('You are not registered as a seller. Please apply to become a seller first.');
        setIsVerifying(false);
        return;
      }

      if (!sellerProfile.is_approved) {
        console.log('SellerVerification: Seller profile not approved');
        setError('Your seller application is pending approval. Please wait for admin approval.');
        setIsVerifying(false);
        return;
      }

      console.log('SellerVerification: Seller verification successful - allowing access');
      console.log('SellerVerification: Setting isSeller to true and isVerifying to false');
      setIsSeller(true);
      setIsVerifying(false);
      console.log('SellerVerification: State updated - should show dashboard now');
      console.log('SellerVerification: Current state after update - isVerifying:', false, 'isSeller:', true);
    } catch (error) {
      console.error('SellerVerification: Error verifying seller status:', error);
      setError('Error verifying seller status. Please try again.');
      setIsVerifying(false);
    }
  }, [user?.id, router, loading]);

  useEffect(() => {
    console.log('SellerVerification: useEffect triggered, user:', user?.id, 'loading:', loading);
    verifySeller();
  }, [verifySeller, loading]);

  // Debug state changes
  useEffect(() => {
    console.log('SellerVerification: State changed - isVerifying:', isVerifying, 'isSeller:', isSeller, 'error:', error);
  }, [isVerifying, isSeller, error]);

  console.log('SellerVerification: Render state - isVerifying:', isVerifying, 'isSeller:', isSeller, 'error:', error, 'loading:', loading);

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('SellerVerification: Showing authentication loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // TEMPORARY: Always show dashboard for testing
  console.log('SellerVerification: TEMPORARILY BYPASSING ALL VERIFICATION - SHOWING DASHBOARD');
  return <>{children}</>;

  if (isVerifying) {
    console.log('SellerVerification: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying seller status...</p>
        </div>
      </div>
    );
  }

  if (!isSeller) {
    console.log('SellerVerification: Showing error state - not a seller');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'You must be an approved seller to access this dashboard.'}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/seller-application')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply to Become a Seller
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('SellerVerification: Rendering children - dashboard should be visible');
  return <>{children}</>;
}
