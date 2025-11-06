'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthTest() {
  const [testResult, setTestResult] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const testAuth = async () => {
    try {
      console.log('Testing authentication...');
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session test result:', { session, error });
      
      if (error) {
        setTestResult(`Error: ${error.message}`);
        return;
      }
      
      if (!session) {
        setTestResult('No active session found. You need to sign in first.');
        return;
      }
      
      setTestResult(`Success! Logged in as: ${session.user.email}`);
      
    } catch (err) {
      console.error('Auth test error:', err);
      setTestResult(`Test failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const sendMagicLink = async () => {
    if (!email) {
      setTestResult('Please enter an email address');
      return;
    }

    try {
      console.log('Sending magic link to:', email);
      
      // Store the current page as redirect URL (dashboard for sellers)
      localStorage.setItem('auth_redirect', '/seller-dashboard');
      
      // In development (localhost), always use window.location.origin to avoid port mismatches
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocalhost 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_APP_URL || window.location.origin);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${baseUrl}/auth/confirm?redirect=${encodeURIComponent('/seller-dashboard')}`
        }
      });
      
      if (error) {
        setTestResult(`Magic link failed: ${error.message}`);
        return;
      }
      
      setTestResult(`Magic link sent to ${email}! Check your email and click the link to sign in. You'll be redirected back to the dashboard.`);
      
    } catch (err) {
      console.error('Magic link error:', err);
      setTestResult(`Magic link failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const goToSignIn = () => {
    // Store the current page as redirect URL (dashboard for sellers)
    localStorage.setItem('auth_redirect', '/seller-dashboard');
    router.push('/sign-in?redirect=/seller-dashboard');
  };

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Auth Test</h3>
      <div className="space-y-2">
        <button
          onClick={testAuth}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Test Current Auth
        </button>
        
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={sendMagicLink}
            className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            Send Magic Link
          </button>
        </div>
        
        <button
          onClick={goToSignIn}
          className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
        >
          Go to Sign In Page
        </button>
        
        {testResult && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
}
