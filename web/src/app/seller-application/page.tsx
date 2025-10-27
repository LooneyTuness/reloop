"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserClient } from "@/lib/supabase/supabase.browser";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const supabase = createBrowserClient();

export default function SellerApplicationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checking, setChecking] = useState(true);

  const createSellerProfile = useCallback(async () => {
    if (!user) return;

    setIsProcessing(true);

    try {
      console.log('Creating seller profile for user:', user.id);
      
      // Create seller profile with automatic approval
      const { data: profile, error: profileError } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: user.id,
          email: user.email,
          role: 'seller',
          is_approved: true, // Automatically approve
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seller'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating seller profile:', profileError);
        toast.error('Error creating seller profile: ' + profileError.message);
        return;
      }

      console.log('Seller profile created successfully:', profile);
      toast.success('Seller profile created successfully! Redirecting to dashboard...');
      
      // Wait a moment for the toast to show, then redirect
      setTimeout(() => {
        router.push('/seller-dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error creating seller profile:', err);
      toast.error('Error creating seller profile');
    } finally {
      setIsProcessing(false);
      setChecking(false);
    }
  }, [user, router]);

  useEffect(() => {
    const checkSellerProfile = async () => {
      if (authLoading) {
        return;
      }

      // If not authenticated, redirect to sign-in
      if (!user) {
        console.log('No user found, redirecting to sign-in');
        router.push('/sign-in?returnUrl=/seller-application');
        return;
      }

      setChecking(true);

      try {
        console.log('Checking seller profile for user:', user.id, user.email);
        
        // Check if user has a seller profile
        const { data: profile, error: profileError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found - create one automatically
            console.log('No seller profile found, creating one automatically');
            await createSellerProfile();
          } else {
            console.error('Error checking seller profile:', profileError);
            toast.error('Error checking seller profile');
            setChecking(false);
          }
        } else if (profile) {
          console.log('Seller profile found:', profile);
          // Profile exists, redirect to dashboard
          router.push('/seller-dashboard');
        }
      } catch (err) {
        console.error('Error checking seller profile:', err);
        toast.error('Error processing request');
        setChecking(false);
      }
    };

    checkSellerProfile();
  }, [user, authLoading, router, createSellerProfile]);

  // Show loading state
  if (authLoading || checking || isProcessing) {
    return (
      <div className="min-h-screen bg-black text-white relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')"
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Header */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-20">
          <h1 className="text-white text-lg sm:text-xl font-medium">vtoraraka.mk</h1>
        </div>

        {/* Main content - centered */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md w-full">
            {/* Loading spinner */}
            <div className="mb-8 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Setting up your seller account
            </h2>
            
            {/* Status message */}
            <p className="text-base sm:text-lg text-gray-300">
              {isProcessing ? 'Creating your seller profile...' : 'Checking your account...'}
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
      
      {/* Header */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-20">
        <h1 className="text-white text-lg sm:text-xl font-medium">vtoraraka.mk</h1>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md w-full">
          {/* Loading spinner */}
          <div className="mb-8 flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </div>
          
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Please wait...
          </h2>
          
          {/* Status message */}
          <p className="text-base sm:text-lg text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
