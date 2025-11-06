"use client";

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/supabase.browser';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TestMagicLinkPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const supabase = createBrowserClient();

  const testMagicLink = async () => {
    if (!email) {
      setResult('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      console.log('Testing magic link for:', email);
      
      // Test the magic link configuration
      // In development (localhost), always use window.location.origin to avoid port mismatches
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocalhost 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_APP_URL || window.location.origin);
      const redirectUrl = `${baseUrl}/auth/confirm`;
      
      console.log('Magic link redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Magic link error:', error);
        setResult(`❌ Error: ${error.message}`);
      } else {
        console.log('Magic link sent successfully');
        setResult(`✅ Magic link sent to ${email}! Check your email and click the link.`);
      }
    } catch (err) {
      console.error('Exception:', err);
      setResult(`❌ Exception: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setResult(`✅ User is signed in: ${session.user.email}`);
      } else {
        setResult('❌ No active session');
      }
    } catch (err) {
      setResult(`❌ Session check error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Magic Link Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="test@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <button
              onClick={testMagicLink}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            
            <button
              onClick={checkSession}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Check Current Session
            </button>
          </div>
          
          {result && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p><strong>Environment:</strong></p>
          <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          <p>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
          <p>Current URL: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
