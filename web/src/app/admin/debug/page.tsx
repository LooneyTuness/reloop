"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDebugPage() {
  const { user, loading: authLoading } = useAuth();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      console.log("Testing API endpoint...");
      const response = await fetch('/api/admin/seller-applications');
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);
        setApiResponse(data);
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        setApiError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      setApiError(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Debug Page
          </h1>

          {/* Authentication Status */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Auth Loading:</strong> {authLoading ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? "Logged in" : "Not logged in"}</p>
              {user && (
                <>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>User Email:</strong> {user.email}</p>
                </>
              )}
            </div>
          </div>

          {/* API Test */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">API Test</h2>
            <button
              onClick={testAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test API"}
            </button>
            
            {apiError && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>Error:</strong> {apiError}
              </div>
            )}
            
            {apiResponse && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <strong>Success!</strong>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Check if you're logged in (Authentication Status section)</li>
              <li>Click "Test API" to see if the API is working</li>
              <li>If API works but admin page doesn't show data, there's a frontend issue</li>
              <li>If API fails, check the server logs and database connection</li>
              <li>Open browser console (F12) to see any JavaScript errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
