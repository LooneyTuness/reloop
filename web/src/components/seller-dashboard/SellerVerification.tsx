'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseDataService } from '@/lib/supabase/data-service';

interface SellerVerificationProps {
  children: React.ReactNode;
}

export default function SellerVerification({ children }: SellerVerificationProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verificationAttempted = useRef(false);

  const verifySeller = useCallback(async () => {
    // Wait for authentication to complete before making any decisions
    if (loading) {
      return;
    }
    
    if (!user?.id) {
      router.push('/sign-in');
      return;
    }

    if (verificationAttempted.current) {
      return;
    }

    if (isSeller) {
      return;
    }

    verificationAttempted.current = true;
    
    try {
      const sellerProfile = await supabaseDataService.getSellerProfile(user.id);
      
      if (!sellerProfile) {
        setError('You are not registered as a seller. Please apply to become a seller first.');
        setIsVerifying(false);
        return;
      }

      const typedSellerProfile = sellerProfile as { is_approved: boolean };
      if (!typedSellerProfile.is_approved) {
        setError('Your seller application is pending approval. Please wait for admin approval.');
        setIsVerifying(false);
        return;
      }

      setIsSeller(true);
      setIsVerifying(false);
    } catch (error) {
      console.error('SellerVerification: Error verifying seller status:', error);
      setError('Error verifying seller status. Please try again.');
      setIsVerifying(false);
    }
  }, [user?.id, router, loading, isSeller]);

  useEffect(() => {
    verifySeller();
  }, [verifySeller, loading, user?.id]);

  // Show loading state while authentication is being checked
  if (loading) {
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
  return <>{children}</>;

  if (isVerifying) {
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

  return <>{children}</>;
}
