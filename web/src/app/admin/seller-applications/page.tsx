"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SellerApplication {
  id: string;
  full_name: string;
  email: string;
  store_name?: string;
  website_social?: string;
  product_description: string;
  understands_application: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export default function AdminSellerApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      console.time('fetchApplications');
      console.log('🔄 Fetching applications...');
      
      const response = await fetch('/api/admin/seller-applications');
      console.log('✅ Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received applications:', data.applications?.length || 0);
        setApplications(data.applications || []);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch applications:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
    } finally {
      console.timeEnd('fetchApplications');
      setLoading(false);
    }
  };

  const handleAction = async (applicationId: string, action: 'approved' | 'rejected') => {
    if (!user?.id) {
      alert('You must be logged in to perform this action');
      return;
    }

    setActionLoading(applicationId);
    try {
      const response = await fetch('/api/admin/seller-applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          action,
          notes: notes[applicationId] || '',
          adminUserId: user.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Action successful:', data.message);
        // Refresh applications
        await fetchApplications();
        // Clear notes for this application
        setNotes(prev => ({ ...prev, [applicationId]: '' }));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert('An error occurred while processing the application');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Seller Applications Management
            </h1>
            <div className="text-sm text-gray-500">
              {applications.length} total applications
            </div>
          </div>

          {/* Debug Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <div className="text-sm space-y-1">
              <p><strong>User:</strong> {user ? `Logged in (${user.email})` : 'Not logged in'}</p>
              <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Applications Count:</strong> {applications.length}</p>
            </div>
          </div>

          {!loading && applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-500">
                There are currently no seller applications to review.
              </p>
            </div>
          ) : !loading ? (
            <div className="space-y-6">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.full_name}
                      </h3>
                      <p className="text-gray-600">{application.email}</p>
                      {application.store_name && (
                        <p className="text-sm text-gray-500">
                          Store: {application.store_name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(application.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Product Description:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {application.product_description}
                    </p>
                  </div>

                  {application.website_social && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Website/Social Media:</h4>
                      <p className="text-gray-600">{application.website_social}</p>
                    </div>
                  )}

                  {application.status === 'pending' && (
                    <div className="border-t pt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Notes (Optional):
                        </label>
                        <textarea
                          value={notes[application.id] || ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [application.id]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          rows={3}
                          placeholder="Add any notes about this application..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAction(application.id, 'approved')}
                          disabled={actionLoading === application.id}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {actionLoading === application.id ? 'Processing...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(application.id, 'rejected')}
                          disabled={actionLoading === application.id}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {actionLoading === application.id ? 'Processing...' : '❌ Reject'}
                        </button>
                      </div>
                    </div>
                  )}

                  {application.status !== 'pending' && (
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-500">
                        <p>Reviewed on: {formatDate(application.reviewed_at || application.updated_at)}</p>
                        {application.notes && (
                          <div className="mt-2">
                            <p className="font-medium">Admin Notes:</p>
                            <p className="text-gray-700 bg-gray-50 p-2 rounded mt-1">
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
