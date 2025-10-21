'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

interface SellerVerificationProps {
  children: React.ReactNode;
}

interface SellerProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'seller';
  is_approved: boolean;
  full_name?: string;
  business_name?: string;
  business_type?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  tax_id?: string;
  bank_account?: string;
  created_at: string;
  updated_at: string;
}

export default function SellerVerification({ children }: SellerVerificationProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSellerProfile = async () => {
      if (authLoading) return;
      
      if (!user) {
        // User not authenticated, redirect to login
        router.push('/sign-in?returnUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      setProfileLoading(true);
      setError(null);

      try {
        // Check if user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found
            setError('You need to be a registered seller to access this dashboard. Please contact an administrator.');
            return;
          }
          throw profileError;
        }

        if (!profile) {
          setError('You need to be a registered seller to access this dashboard. Please contact an administrator.');
          return;
        }

        // Type assertion to help TypeScript understand the profile type
        const sellerProfile = profile as SellerProfile;

        // Check if seller is approved
        if (!sellerProfile.is_approved) {
          setError('Your seller account is pending approval. Please wait for administrator approval or contact support.');
          return;
        }

        // Check if user has seller or admin role
        if (sellerProfile.role !== 'seller' && sellerProfile.role !== 'admin') {
          setError('You do not have permission to access the seller dashboard.');
          return;
        }

        setSellerProfile(sellerProfile);
      } catch (err) {
        console.error('Error checking seller profile:', err);
        setError('Failed to verify seller status. Please try again later.');
      } finally {
        setProfileLoading(false);
      }
    };

    checkSellerProfile();
  }, [user, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Verifying seller access..." />
        </div>
      </div>
    );
  }

  // Show error state if authentication fails
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Access Denied
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If we have a valid seller profile, render the children
  if (sellerProfile) {
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
