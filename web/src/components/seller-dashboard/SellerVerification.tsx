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

  useEffect(() => {
    const checkSellerProfile = async () => {
      console.log('SellerVerification: Checking seller profile...', {
        authLoading,
        user: user?.email,
        userId: user?.id,
        hasUser: !!user
      });

      // Wait for auth to finish loading
      if (authLoading) {
        console.log('SellerVerification: Auth still loading, waiting...');
        return;
      }
      
      if (!user) {
        console.log('SellerVerification: No user found after auth loading complete, redirecting to sign-in');
        // User not authenticated, redirect to login with return URL
        const currentPath = window.location.pathname;
        router.push(`/sign-in?returnUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      setProfileLoading(true);

      try {
        // Check if user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('SellerVerification: Profile check result:', {
          profile,
          error: profileError
        });

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found - redirect to home page
            console.log('SellerVerification: No profile found, redirecting to home');
            router.push('/');
            return;
          }
          throw profileError;
        }

        if (!profile) {
          // No profile found - redirect to home page
          console.log('SellerVerification: No profile data, redirecting to home');
          router.push('/');
          return;
        }

        // Type assertion to help TypeScript understand the profile type
        const sellerProfile = profile as SellerProfile;

        console.log('SellerVerification: Raw profile object:', sellerProfile);
        console.log('SellerVerification: Profile keys:', Object.keys(sellerProfile));
        console.log('SellerVerification: is_approved value from DB:', sellerProfile.is_approved, 'type:', typeof sellerProfile.is_approved);
        console.log('SellerVerification: Seller profile details:', {
          isApproved: sellerProfile.is_approved,
          role: sellerProfile.role,
          email: sellerProfile.email,
          fullName: sellerProfile.full_name
        });

        // Note: We allow access to dashboard even if not approved yet
        // This allows sellers to complete their profile and manage their listings
        // while waiting for approval
        if (!sellerProfile.is_approved) {
          console.log('SellerVerification: Account not approved yet, but allowing dashboard access');
        }

        // Check if user has seller or admin role
        if (sellerProfile.role !== 'seller' && sellerProfile.role !== 'admin') {
          // Wrong role - redirect to home page
          console.log('SellerVerification: Wrong role, redirecting to home. Role:', sellerProfile.role);
          router.push('/');
          return;
        }

        console.log('SellerVerification: All checks passed, setting seller profile');

        setSellerProfile(sellerProfile);
      } catch (err) {
        console.error('Error checking seller profile:', err);
        // On error, redirect to home page
        router.push('/');
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

  // If we have an error, we'll redirect to home, so no need to show error state

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
