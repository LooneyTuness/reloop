"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateSellerProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async () => {
    if (!user?.id || !user?.email) {
      setError("User information not available");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/create-seller-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          role: 'seller'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to create profile');
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create Seller Profile
          </h1>

          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user?.id || 'Not available'}</p>
              <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
            </div>
          </div>

          {/* Create Profile */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create Seller Profile</h2>
            <p className="text-gray-600 mb-4">
              This will create a seller profile for your account with approved status.
            </p>
            <button
              onClick={createProfile}
              disabled={loading || !user}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Seller Profile"}
            </button>
          </div>

          {/* Results */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <strong>Success!</strong>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Create Seller Profile" to create your profile</li>
              <li>Once created, go to <code>/seller-dashboard</code> to access the dashboard</li>
              <li>You should now have full seller access</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
