'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthTest() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      {user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ User Authenticated</h2>
          <p className="text-green-700">Email: {user.email}</p>
          <p className="text-green-700">ID: {user.id}</p>
          <p className="text-green-700">Created: {new Date(user.created_at).toLocaleString()}</p>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">❌ User Not Authenticated</h2>
          <p className="text-red-700 mb-4">You need to sign in to access the seller dashboard.</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Sign In
            </button>
            <a
              href="mailto:viktorijamatejevik@live.com"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-2 inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
