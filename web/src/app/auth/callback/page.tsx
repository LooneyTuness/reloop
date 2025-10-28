'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
        const redirectUrl = searchParams.get('redirect') || '/seller-application';
        console.log('AuthCallback: Redirect URL:', redirectUrl);
        
        // Get the session - force refresh if this is a confirmation redirect
        const isConfirmed = searchParams.get('confirmed') === 'true';
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        let session = initialSession;
        
        console.log('AuthCallback: Session check:', {
          hasSession: !!session,
          userEmail: session?.user?.email,
          error
        });

        if (error) {
          console.error('AuthCallback: Session error:', error);
          setError('Authentication error');
          setLoading(false);
          return;
        }

        // If no session but this is a confirmed redirect, try to refresh the session
        if (!session && isConfirmed) {
          console.log('AuthCallback: No session found but confirmed redirect, refreshing...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error('AuthCallback: Session refresh error:', refreshError);
            setError('Authentication failed');
            setLoading(false);
            return;
          }
          
          if (refreshedSession?.user) {
            console.log('AuthCallback: Session refreshed successfully:', refreshedSession.user.email);
            // Use the refreshed session
            session = refreshedSession;
          } else {
            console.log('AuthCallback: Still no session after refresh, redirecting to home');
            router.push('/');
            return;
          }
        }

        if (session?.user) {
          console.log('AuthCallback: User authenticated:', session.user.email);
          console.log('AuthCallback: User ID:', session.user.id);
          
          // Wait for auth state to propagate by triggering a session refresh
          // This ensures the AuthContext receives the session update
          console.log('AuthCallback: Triggering session refresh to propagate auth state...');
          await supabase.auth.refreshSession();
          
          // Wait a bit longer to ensure AuthContext has processed the auth state change
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // If redirecting to seller dashboard, check if user is a seller
          if (redirectUrl.includes('seller-dashboard')) {
            const { data: sellerProfile, error: profileError } = await supabase
              .from('seller_profiles')
              .select('is_approved, role')
              .eq('user_id', session.user.id)
              .single();

            console.log('AuthCallback: Seller profile check:', {
              profile: sellerProfile,
              error: profileError
            });

            if (profileError) {
              console.log('AuthCallback: No seller profile found, redirecting to home');
              router.push('/');
            } else if (sellerProfile) {
              console.log('AuthCallback: User is a seller, redirecting to dashboard');
              console.log('AuthCallback: Redirecting to:', redirectUrl);
              router.push(redirectUrl);
            } else {
              console.log('AuthCallback: User is not a seller, redirecting to home');
              router.push('/');
            }
          } else if (redirectUrl.includes('seller-application')) {
            // If redirecting to seller application, wait a bit more to ensure auth is fully established
            console.log('AuthCallback: Redirecting to seller application, ensuring auth is established...');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('AuthCallback: Redirecting to:', redirectUrl);
            router.push(redirectUrl);
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
                <p className="text-lg font-medium text-white">Completing authentication...</p>
                <p className="text-sm text-gray-300">Please wait a moment</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Authentication Error
              </h3>
              <p className="text-sm text-gray-300 mb-6">
                {error}
              </p>
              
              <button
                onClick={() => router.push('/')}
                className="w-full h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}