"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/supabase.browser';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback page loaded');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        console.log('URL search:', window.location.search);

        // Create Supabase client
        const supabase = createBrowserClient();

        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const typeQuery = urlParams.get('type');
        const typeHash = hashParams.get('type');
        const type = typeHash || typeQuery; // Prefer hash type, Supabase uses hash for magic links
        const redirectParam = urlParams.get('redirect');

        console.log('Processing callback with code:', !!code, 'type:', type);
        console.log('Redirect parameter from URL:', redirectParam);
        console.log('Full URL:', window.location.href);
        console.log('All URL params:', Object.fromEntries(urlParams.entries()));
        console.log('All HASH params:', Object.fromEntries(hashParams.entries()));

        // Handle OAuth errors
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setError(errorDescription || error);
          setLoading(false);
          return;
        }

        // Handle magic link authentication (Supabase uses hash tokens, no code)
        if (type === 'magiclink') {
          console.log('Processing magic link authentication');

          // Wait briefly for Supabase to process the URL hash and set the session
          for (let i = 0; i < 6; i++) {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              console.log('Magic link authentication successful');

              // Check for redirect URL from URL params first, then localStorage
              const redirectUrl = redirectParam || localStorage.getItem('auth_redirect');
              console.log('Redirect URL (from URL param or localStorage):', redirectUrl);

              toast.success("Welcome! You're now signed in.", {
                duration: 5000,
              });

              if (redirectUrl) {
                console.log('Redirecting to:', redirectUrl);
                localStorage.removeItem('auth_redirect');
                router.push(redirectUrl);
              } else {
                console.log('No redirect URL found, going to seller dashboard');
                router.push('/seller-dashboard');
              }
              setLoading(false);
              return;
            }
            await new Promise(r => setTimeout(r, 300));
          }

          console.warn('Magic link: no session found after waiting');
        }

        // Handle email confirmations (signup)
        if (type === 'signup' || type === 'recovery') {
          console.log('Email confirmation link clicked');
          
          // Check for redirect URL from URL params first, then localStorage
          const redirectUrl = redirectParam || localStorage.getItem('auth_redirect');
          console.log('Redirect URL after email confirmation (from URL param or localStorage):', redirectUrl);
          
          toast.success("Your email has been confirmed! You can now sign in.", {
            duration: 5000,
          });
          
          if (redirectUrl) {
            console.log('Redirecting to:', redirectUrl);
            localStorage.removeItem('auth_redirect');
            router.push(redirectUrl);
          } else {
            console.log('No redirect URL found after email confirmation, going to seller dashboard');
            router.push('/seller-dashboard');
          }
          setLoading(false);
          return;
        }

        // If we have a code but no type, still try to exchange the code (email link variant)
        if (code) {
          console.log('Type not provided but code present - waiting for session (detectSessionInUrl)');
          // detectSessionInUrl=true should process the code automatically; poll for session
          for (let i = 0; i < 10; i++) {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              const redirectUrl = redirectParam || localStorage.getItem('auth_redirect') || '/';
              console.log('Session detected via auto handling. Redirecting to:', redirectUrl);
              localStorage.removeItem('auth_redirect');
              router.push(redirectUrl);
              setLoading(false);
              return;
            }
            await new Promise(r => setTimeout(r, 300));
          }
          console.warn('No session detected after waiting; falling back to home');
        }

        // Fallback - redirect to seller dashboard
        console.log('No specific type detected, redirecting to seller dashboard');
        router.push('/seller-dashboard');
        setLoading(false);

      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Processing authentication...</p>
            <p className="text-sm text-gray-500">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 px-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Authentication Error</h1>
            <p className="text-lg text-gray-600">
              There was an error processing your authentication.
            </p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // This should not render as we redirect
}
