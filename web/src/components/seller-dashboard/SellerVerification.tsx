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
    if (authLoading || !user) {
      if (!authLoading && !user) {
        // User not authenticated, redirect to login with return URL
        const currentPath = window.location.pathname;
        router.push(`/sign-in?returnUrl=${encodeURIComponent(currentPath)}`);
      }
      return;
    }

    // If we already have a seller profile, don't check again
    if (sellerProfile) {
      return;
    }

    const checkSellerProfile = async () => {
      try {
        // Check if user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found - redirect to home page
            router.push('/');
            return;
          }
          throw profileError;
        }

        if (!profile) {
          // No profile found - redirect to home page
          router.push('/');
          return;
        }

        // Type assertion to help TypeScript understand the profile type
        const sellerProfile = profile as SellerProfile;

        // Check if user has seller or admin role
        if (sellerProfile.role !== 'seller' && sellerProfile.role !== 'admin') {
          // Wrong role - redirect to home page
          router.push('/');
          return;
        }

        setSellerProfile(sellerProfile);
      } catch (err) {
        console.error('Error checking seller profile:', err);
        // On error, redirect to home page
        router.push('/');
      }
    };

    checkSellerProfile();
  }, [user, authLoading, router, sellerProfile]);

  // If we have a valid seller profile, render the children
  if (sellerProfile) {
    return <>{children}</>;
  }

  // Show children while loading (no spinner)
  return <>{children}</>;
}
