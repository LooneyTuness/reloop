"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TestRedirectPage() {
  const [storedUrl, setStoredUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  useEffect(() => {
    // Get stored URL
    const stored = localStorage.getItem('auth_redirect');
    setStoredUrl(stored);
    
    // Store redirect param if it exists
    if (redirectParam) {
      localStorage.setItem('auth_redirect', redirectParam);
      setStoredUrl(redirectParam);
    }
  }, [redirectParam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-32 sm:pt-36">
      <div className="max-w-md w-full space-y-6 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Redirect Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-medium text-gray-900">URL Parameters:</h2>
            <p className="text-sm text-gray-600">redirect: {redirectParam || 'None'}</p>
          </div>
          
          <div>
            <h2 className="font-medium text-gray-900">Stored in localStorage:</h2>
            <p className="text-sm text-gray-600">auth_redirect: {storedUrl || 'None'}</p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                localStorage.setItem('auth_redirect', '/dashboard');
                setStoredUrl('/dashboard');
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Store /dashboard in localStorage
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('auth_redirect');
                setStoredUrl(null);
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear localStorage
            </button>
            
            <button
              onClick={() => {
                const stored = localStorage.getItem('auth_redirect');
                setStoredUrl(stored);
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Refresh stored value
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
