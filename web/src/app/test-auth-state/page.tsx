"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function TestAuthState() {
  const { user } = useAuth();
  const [serverUser, setServerUser] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        setServerUser(null);
        return;
      }

      try {
        // Check server-side user
        const response = await fetch('/api/check-user-exists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        const result = await response.json();
        setServerUser(result);
        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError(String(err));
      }
    };

    checkUser();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Auth State Debug</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Client-Side Auth (useAuth)</h2>
          {user ? (
            <pre className="bg-black p-4 rounded overflow-auto">
              {JSON.stringify(
                {
                  id: user.id,
                  email: user.email,
                  created_at: user.created_at,
                },
                null,
                2
              )}
            </pre>
          ) : (
            <p className="text-red-400">No user found</p>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Server-Side Auth Check</h2>
          {error && <p className="text-red-400 mb-4">Error: {error}</p>}
          {serverUser && (
            <pre className="bg-black p-4 rounded overflow-auto">
              {JSON.stringify(serverUser, null, 2)}
            </pre>
          )}
        </div>

        {user && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <button
              onClick={async () => {
                const { data, error } = await supabase.auth.refreshSession();
                console.log('Refresh result:', { data, error });
                alert(`Refresh: ${error ? error.message : 'Success'}`);
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-4"
            >
              Refresh Session
            </button>
            <button
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                console.log('Sign out:', { error });
                alert(`Sign out: ${error ? error.message : 'Success'}`);
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

