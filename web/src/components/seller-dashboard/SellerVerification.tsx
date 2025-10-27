'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    // Only run if we have a user and auth is not loading
    if (authLoading) {
      return;
    }

    if (!user) {
      // User not authenticated, redirect to login with return URL
      const currentPath = window.location.pathname;
      console.log('No user found, redirecting to sign-in from:', currentPath);
      router.push(`/sign-in?returnUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // If we already have a seller profile for this user, don't check again
    if (sellerProfile && sellerProfile.user_id === user.id) {
      return;
    }

    // Reset profile if user has changed
    if (sellerProfile && sellerProfile.user_id !== user.id) {
      console.log('User changed, resetting seller profile');
      setSellerProfile(null);
    }

    const checkSellerProfile = async () => {
      try {
        console.log('Checking seller profile for user:', user.id, user.email);
        
        // Check if user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching seller profile:', profileError);
          if (profileError.code === 'PGRST116') {
            // No profile found - redirect to home page
            console.log('No seller profile found, redirecting to home');
            router.push('/');
            return;
          }
          throw profileError;
        }

        if (!profile) {
          // No profile found - redirect to home page
          console.log('No seller profile data returned, redirecting to home');
          router.push('/');
          return;
        }

        // Type assertion to help TypeScript understand the profile type
        const sellerProfile = profile as SellerProfile;

        console.log('Seller profile found:', { 
          is_approved: sellerProfile.is_approved, 
          role: sellerProfile.role 
        });

        // Check if user has seller or admin role
        if (sellerProfile.role !== 'seller' && sellerProfile.role !== 'admin') {
          // Wrong role - redirect to home page
          router.push('/');
          return;
        }

        // Check if user is an approved seller (or admin)
        const isApprovedSeller = sellerProfile.is_approved === true || sellerProfile.role === 'admin';
        
        console.log('Approval check:', { 
          is_approved: sellerProfile.is_approved, 
          role: sellerProfile.role,
          isApprovedSeller 
        });
        
        if (!isApprovedSeller) {
          // Not approved - redirect to application page
          console.log('User is not approved, redirecting to application');
          router.push('/seller-application');
          return;
        }

        console.log('User verified as approved seller, allowing access to dashboard');
        setSellerProfile(sellerProfile);
      } catch (err) {
        console.error('Error checking seller profile:', err);
        // On error, redirect to home page
        router.push('/');
      }
    };

    checkSellerProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  // If we have a valid seller profile, render the children
  if (sellerProfile) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, show loading while redirect happens
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show loading while checking seller profile
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
      </div>
    </div>
  );
}
