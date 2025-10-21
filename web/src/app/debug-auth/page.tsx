"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createBrowserClient } from '@/lib/supabase/supabase.browser';

export default function DebugAuthPage() {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<{session: any; error: any} | null>(null);
  const [authEvents, setAuthEvents] = useState<Array<{event: string; user: string | undefined; timestamp: string}>>([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSessionInfo({ session, error });
    };
    
    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const eventInfo = {
        event,
        user: session?.user?.email,
        timestamp: new Date().toISOString()
      };
      setAuthEvents(prev => [...prev, eventInfo]);
      console.log('Auth event:', eventInfo);
    });

    return () => subscription.unsubscribe();
  }, []);

  const testSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('Signed out successfully');
    }
  };

  const testGetUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Current user:', { user: user?.email, error });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context State */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? user.email : 'None'}</p>
              <p><strong>User ID:</strong> {user?.id || 'None'}</p>
              <p><strong>Created At:</strong> {user?.created_at || 'None'}</p>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Session Info</h2>
            <div className="space-y-2">
              <p><strong>Has Session:</strong> {sessionInfo?.session ? 'Yes' : 'No'}</p>
              <p><strong>Session User:</strong> {sessionInfo?.session?.user?.email || 'None'}</p>
              <p><strong>Session Error:</strong> {sessionInfo?.error?.message || 'None'}</p>
            </div>
          </div>

          {/* Auth Events */}
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Auth Events</h2>
            <div className="max-h-64 overflow-y-auto">
              {authEvents.length === 0 ? (
                <p className="text-gray-500">No auth events yet...</p>
              ) : (
                <div className="space-y-2">
                  {authEvents.map((event, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <p><strong>Event:</strong> {event.event}</p>
                      <p><strong>User:</strong> {event.user || 'None'}</p>
                      <p><strong>Time:</strong> {event.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-x-4">
              <button
                onClick={testSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Test Sign Out
              </button>
              <button
                onClick={testGetUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Get User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
