'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export default function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState({
    supabaseConnected: false,
    session: null as Session | null,
    user: null as User | null,
    error: null as string | null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AuthDebug: Checking Supabase connection...');
        
        // Test basic connection
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('AuthDebug: Session check result:', { session, error });
        
        setDebugInfo({
          supabaseConnected: true,
          session,
          user: session?.user || null,
          error: error?.message || null
        });
      } catch (err) {
        console.error('AuthDebug: Error checking auth:', err);
        setDebugInfo(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : String(err),
          supabaseConnected: false
        }));
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div>Supabase: {debugInfo.supabaseConnected ? '✅ Connected' : '❌ Error'}</div>
        <div>Session: {debugInfo.session ? '✅ Active' : '❌ None'}</div>
        <div>User: {debugInfo.user ? '✅ Logged in' : '❌ Not logged in'}</div>
        {debugInfo.user && (
          <div>Email: {debugInfo.user.email}</div>
        )}
        {debugInfo.error && (
          <div className="text-red-600">Error: {debugInfo.error}</div>
        )}
      </div>
    </div>
  );
}
