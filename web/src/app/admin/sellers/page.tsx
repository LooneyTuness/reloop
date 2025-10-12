"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SellerProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'seller';
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminSellerManagement() {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSeller, setNewSeller] = useState({
    email: '',
    fullName: ''
  });

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers');
      const data = await response.json();
      
      if (response.ok) {
        setSellers(data.sellers || []);
      } else {
        console.error('Failed to fetch sellers:', data);
        alert(`Error: ${data.error || 'Unknown error'}\n\nDetails: ${data.details || 'No details available'}\n\nInstructions: ${data.instructions ? data.instructions.join('\n') : 'None'}`);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert('You must be logged in to create sellers');
      return;
    }

    setActionLoading('create');
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newSeller.email,
          fullName: newSeller.fullName,
          createdBy: user.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Seller created:', data.message);
        // Refresh sellers
        await fetchSellers();
        // Reset form
        setNewSeller({ email: '', fullName: '' });
        setShowCreateForm(false);
        alert(`Seller created! Dashboard link: ${data.dashboardUrl}`);
      } else {
        const errorData = await response.json();
        console.error('Create seller error:', errorData);
        alert(`Error: ${errorData.error || 'Unknown error'}\n\nDetails: ${errorData.details || 'No details available'}\n\nInstructions: ${errorData.instructions ? errorData.instructions.join('\n') : 'None'}`);
      }
    } catch (error) {
      console.error('Error creating seller:', error);
      alert('An error occurred while creating the seller');
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

  const getDashboardUrl = (email: string) => {
    return `${window.location.origin}/seller-dashboard`;
  };

  const copyDashboardLink = (email: string) => {
    const url = getDashboardUrl(email);
    navigator.clipboard.writeText(url);
    alert('Dashboard link copied to clipboard!');
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
              Seller Management
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                {showCreateForm ? 'Cancel' : '+ Add Seller'}
              </button>
            </div>
          </div>

          {showCreateForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New Seller
              </h2>
              <form onSubmit={handleCreateSeller} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newSeller.email}
                    onChange={(e) => setNewSeller(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="seller@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newSeller.fullName}
                    onChange={(e) => setNewSeller(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={actionLoading === 'create'}
                    className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading === 'create' ? 'Creating...' : 'Create Seller'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="text-sm text-gray-500 mb-6">
            {sellers.length} total sellers
          </div>

          {sellers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Sellers Found
              </h3>
              <p className="text-gray-500">
                Add your first seller to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {seller.email}
                      </h3>
                      <p className="text-gray-600 capitalize">
                        Role: {seller.role} • Status: {seller.is_approved ? 'Approved' : 'Pending'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        seller.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {seller.is_approved ? 'Active' : 'Pending'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(seller.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyDashboardLink(seller.email)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      📋 Copy Dashboard Link
                    </button>
                    <a
                      href={getDashboardUrl(seller.email)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      🔗 Open Dashboard
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
