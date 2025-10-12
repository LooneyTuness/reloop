"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SellerProfileTest() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkProfile = async () => {
    if (!user?.id) {
      setError("No user ID available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Checking profile for user ID:", user.id);
      const response = await fetch(`/api/seller-profile/${user.id}`);
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Profile data:", data);
        setProfile(data.profile);
      } else if (response.status === 404) {
        setError("Seller profile not found - you may not be approved yet");
      } else {
        const errorText = await response.text();
        setError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      checkProfile();
    }
  }, [user, authLoading]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Seller Profile Test
          </h1>

          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p><strong>Auth Loading:</strong> {authLoading ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? "Logged in" : "Not logged in"}</p>
              {user && (
                <>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Profile Check */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Seller Profile Check</h2>
            <button
              onClick={checkProfile}
              disabled={loading || !user}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Profile"}
            </button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {profile && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <strong>Profile Found!</strong>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Make sure you're logged in with the same email you used for the seller application</li>
              <li>Click "Check Profile" to see if your seller profile exists</li>
              <li>If profile exists and is_approved=true, you can access the seller dashboard</li>
              <li>If profile doesn't exist, the approval process may not have completed successfully</li>
              <li>Go to <code>/seller-dashboard</code> to access the dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
