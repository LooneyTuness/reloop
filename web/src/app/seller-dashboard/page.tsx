"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import SummaryCards from '@/components/seller-dashboard/SummaryCards';
import RecentOrders from '@/components/seller-dashboard/RecentOrders';
import ProductLifecycle from '@/components/seller-dashboard/ProductLifecycle';
import DashboardZeroState from '@/components/seller-dashboard/DashboardZeroState';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { useAuth } from '@/contexts/AuthContext';

function DashboardContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { stats, activities, products, isLoading, error } = useDashboard();

  // Personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get user's first name from email
  const getUserName = () => {
    if (!user?.email) return '';
    return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
  };

  // Personalized tips based on time and user activity
  const getPersonalizedTip = () => {
    const hour = new Date().getHours();
    const tips = [
      {
        morning: "Start your day by checking your listings and responding to any messages from potential buyers.",
        afternoon: "This is a great time to add new products - buyers are actively browsing during lunch breaks.",
        evening: "Review your daily performance and plan tomorrow's strategy for maximum impact."
      },
      {
        morning: "Morning shoppers are often serious buyers - make sure your product descriptions are clear and compelling.",
        afternoon: "Consider updating your product photos with better lighting - afternoon light works great for photography.",
        evening: "Evening is perfect for analyzing your analytics and understanding what's working best."
      },
      {
        morning: "Fresh listings get more visibility - consider adding new items early in the day.",
        afternoon: "Engage with your customers by responding quickly to messages and questions.",
        evening: "Plan your pricing strategy based on market trends and your performance data."
      }
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    if (hour < 12) return randomTip.morning;
    if (hour < 17) return randomTip.afternoon;
    return randomTip.evening;
  };


  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 opacity-60"></div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to access the seller dashboard.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                // Store the current page as redirect URL
                localStorage.setItem('auth_redirect', '/seller-dashboard');
                router.push('/sign-in');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In with Magic Link
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We&apos;ll send you a secure link to sign in instantly
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show zero state if no products are listed
  if (!isLoading && products.length === 0) {
    return (
      <div className="px-6 py-8">
        <DashboardZeroState
          onAddProduct={() => router.push('/seller-dashboard/add-product')}
          onViewGuide={() => router.push('/seller-dashboard/guide')}
        />
      </div>
    );
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        router.push('/seller-dashboard/add-product');
        break;
      case 'view-analytics':
        router.push('/seller-dashboard/analytics');
        break;
      case 'manage-orders':
        router.push('/seller-dashboard/orders');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      {/* Personalized Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {getGreeting()}{getUserName() ? `, ${getUserName()}` : ''}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Here&apos;s what&apos;s happening with your store today.
                </p>
              </div>
            </div>
            
            {/* Personalized Stats Preview */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Seller since {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Active seller</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Last updated</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div className="mb-8">
        <SummaryCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <RecentOrders />
        <ProductLifecycle />
      </div>

      {/* Quick Insights Section */}
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Quick Insights
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Key metrics and actions to help you manage your store
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('add-product')}
                className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Product
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('view-analytics')}
                className="w-full text-left p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('manage-orders')}
                className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Manage Orders
                </div>
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Metrics
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats?.conversionRate?.toFixed(1) || '0.0'}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Order Value</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">${stats?.avgOrderValue?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Rating</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white mr-1">{stats?.customerRating || '4.5'}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {(activities || []).slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`h-3 w-3 rounded-full ${
                    activity.status === 'active' 
                      ? 'bg-green-500 animate-pulse' 
                      : activity.type === 'order' 
                        ? 'bg-blue-500' 
                        : activity.type === 'view' 
                          ? 'bg-purple-500' 
                          : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Tip Section */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                💡 Pro Tip for {getUserName() || 'You'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {getPersonalizedTip()}
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updated {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  return (
    <DashboardProvider>
      <SellerDashboardLayout>
        <DashboardContent />
      </SellerDashboardLayout>
    </DashboardProvider>
  );
}