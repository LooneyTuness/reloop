'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Handling auth callback...');
        
        // Get the redirect URL from query params
        const redirectUrl = searchParams.get('redirect') || '/';
        console.log('AuthCallback: Redirect URL:', redirectUrl);
        
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('AuthCallback: Session check:', {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error: sessionError
        });

        if (sessionError) {
          console.error('AuthCallback: Session error:', sessionError);
          setError('Authentication error');
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('AuthCallback: User authenticated:', session.user.email);
          
          // If redirecting to seller dashboard, check if user is a seller
          if (redirectUrl.includes('seller-dashboard')) {
            const { data: sellerProfile, error: profileError } = await supabase
              .from('seller_profiles')
              .select('is_approved')
              .eq('user_id', session.user.id)
              .single();

            if (profileError) {
              console.log('AuthCallback: No seller profile found, redirecting to home');
              router.push('/');
            } else if (sellerProfile) {
              console.log('AuthCallback: User is a seller, redirecting to dashboard');
              router.push(redirectUrl);
            } else {
              console.log('AuthCallback: User is not a seller, redirecting to home');
              router.push('/');
            }
          } else {
            // For other redirects, just go to the specified URL
            console.log('AuthCallback: Redirecting to:', redirectUrl);
            router.push(redirectUrl);
          }
        } else {
          console.log('AuthCallback: No session found, redirecting to home');
          router.push('/');
        }
      } catch (err) {
        console.error('AuthCallback: Error:', err);
        setError('Authentication failed');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Completing authentication..." />
        </div>
      </div>
    );
  }

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
            Authentication Error
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}