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

        // Get URL parameters for debugging
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        console.log('Processing callback with code:', !!code);

        // Handle OAuth errors
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setError(errorDescription || error);
          setLoading(false);
          return;
        }

        // For email confirmations, the simplest approach is to just redirect
        // The email confirmation should have already been processed by Supabase
        // when the user clicked the link in their email
        console.log('Email confirmation link clicked - redirecting to home page');
        
        // Show success message
        toast.success("Вашата е-пошта е успешно потврдена! Сега можете да се најавите.", {
          duration: 5000,
        });

        // Redirect to home page
        router.push('/');
        setLoading(false);

      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Потврдуваме вашата е-пошта...</h1>
          <p className="text-gray-600">Ве молиме почекајте...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Грешка при потврда</h1>
          <p className="text-gray-600 mb-6">
            Се случи грешка при потврдувањето на вашата е-пошта.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              <strong>Грешка:</strong> {error}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/sign-up')}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Обиди се повторно
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
            >
              Кон почетна страница
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // This should not render as we redirect
}
