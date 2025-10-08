"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
  const [user, setUser] = useState<{ id: string; email?: string; email_confirmed_at?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('description');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    // Handle errors from callback
    if (errorParam) {
      setError(errorDescription || errorParam);
      setLoading(false);
      return;
    }
    const checkUser = async () => {
      // If coming from email confirmation, give more time for session to be established
      if (confirmed === 'true') {
        // Wait for cookies and session to be set
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try multiple times to get the session
        for (let i = 0; i < 5; i++) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            setLoading(false);
            return;
          }
          // Wait a bit before trying again
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // If still no session after retries, stop loading
        setLoading(false);
        return;
      }
      
      // Not from confirmation - check session normally
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        return;
      }

      // If no session, wait a bit and try again
      setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
      }, 2000);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [confirmed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Ја потврдуваме вашата е-пошта...</p>
            <p className="text-sm text-gray-500 mt-2">Ве молиме почекајте...</p>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {user ? (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Добредојдовте на vtoraraka.mk!</h1>
            <p className="text-gray-600 mb-6">
              Вашата е-пошта е успешно потврдена. Сега можете да започнете со купување и продавање.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Започни купување
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Проверете ја вашата е-пошта</h1>
            <p className="text-gray-600 mb-6">
              Испративме линк за потврда на вашата е-пошта. Кликнете на линкот за да ја активирате вашата сметка и да започнете со купување и продавање.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Не го најдовте е-мејлот?</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Проверете го вашиот spam/junk фолдер</li>
                <li>Почекајте неколку минути и обидете се повторно</li>
                <li>Проверете дали е-мејлот е точен</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Разгледај производи во меѓувреме
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
              >
                Веќе го потврдив е-мејлот
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
