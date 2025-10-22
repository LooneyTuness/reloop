'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { BarChart3, Clock, ArrowLeft, TrendingUp, Eye, ShoppingCart, DollarSign } from 'lucide-react';

function AnalyticsContent() {
  const router = useRouter();

  // Redirect to dashboard after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/seller-dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="px-3 sm:px-6 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <BarChart3 size={48} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Coming Soon
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We're working on bringing you detailed analytics and insights for your products and sales.
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Sales Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your sales performance and trends</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Eye size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Product Views</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor product visibility and engagement</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <ShoppingCart size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Order Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analyze order patterns and customer behavior</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Revenue Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Understand your revenue streams and growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Redirect Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-800 dark:text-yellow-200">
              Redirecting to dashboard in a few seconds...
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/seller-dashboard')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/seller-dashboard/listings')}
            className="flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Manage Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <SellerDashboardLayout>
      <DashboardProvider>
        <AnalyticsContent />
      </DashboardProvider>
    </SellerDashboardLayout>
  );
}