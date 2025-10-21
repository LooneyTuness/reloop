"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import RecentOrders from '@/components/seller-dashboard/RecentOrders';
import DashboardZeroState from '@/components/seller-dashboard/DashboardZeroState';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';

function DashboardContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { products, isLoading, error } = useDashboard();
  const { t } = useDashboardLanguage();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load seller profile data
  useEffect(() => {
    const loadSellerProfile = async () => {
      if (!user?.id) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const response = await fetch(`/api/seller-profile/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Seller profile data:', data.profile);
          setSellerProfile(data.profile);
        } else {
          console.log('Failed to fetch seller profile:', response.status);
        }
      } catch (error) {
        console.error('Error loading seller profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadSellerProfile();
  }, [user?.id]);

  // Personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  // Get user's name from profile or fallback to email
  const getUserName = () => {
    if (sellerProfile?.full_name) {
      return sellerProfile.full_name.split(' ')[0]; // Get first name
    }
    if (sellerProfile?.business_name) {
      return sellerProfile.business_name;
    }
    if (user?.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    }
    return '';
  };



  // Show loading state while authentication is being checked
  if (loading || profileLoading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 opacity-60"></div>
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
      {/* Dashboard Instructions Section */}
      <div className="mb-6 sm:mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 sm:p-8 lg:p-10 text-white mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl flex-shrink-0 mt-1 ring-2 ring-white/20">
                  <svg className="h-7 w-7 sm:h-9 sm:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-rounded leading-tight">
                        {getGreeting()}
                        {getUserName() && (
                          <>
                            , <span className="inline-flex items-baseline gap-2">
                              {getUserName()}!
                              <span className="text-3xl sm:text-4xl lg:text-5xl leading-none animate-pulse">👋</span>
                            </span>
                          </>
                        )}
                        {!getUserName() && '!'}
                      </h1>
                    </div>
                  </div>
                  <p className="text-blue-100 text-lg sm:text-xl font-medium leading-relaxed">
                    {t('welcomeBack')}! {t('followTheseSteps')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center xl:items-end text-center xl:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 space-y-3">
                <div className="text-2xl sm:text-3xl font-bold">{t('quickActions')}</div>
                <div className="text-blue-100 text-lg sm:text-xl">{t('followTheseSteps')}</div>
                <div className="text-sm text-blue-200 bg-white/10 rounded-full px-3 py-1.5">
                  Step-by-step guide
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center space-x-3 bg-white/25 backdrop-blur-md rounded-full px-5 py-3 shadow-lg">
                <div className="h-6 w-6 bg-green-400/20 rounded-full flex items-center justify-center">
                  <span className="text-green-300 font-bold text-sm">1</span>
                </div>
                <span className="font-semibold text-sm sm:text-base">{t('addNewProduct')}</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/25 backdrop-blur-md rounded-full px-5 py-3 shadow-lg">
                <div className="h-6 w-6 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-300 font-bold text-sm">2</span>
                </div>
                <span className="font-semibold text-sm sm:text-base">{t('manageOrders')}</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/25 backdrop-blur-md rounded-full px-5 py-3 shadow-lg">
                <div className="h-6 w-6 bg-emerald-400/20 rounded-full flex items-center justify-center">
                  <span className="text-emerald-300 font-bold text-sm">3</span>
                </div>
                <span className="font-semibold text-sm sm:text-base">{t('trackProductsThroughSalesFunnel')}</span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push('/seller-dashboard/add-product')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
{t('addNewProduct')}
          </button>
          <button
            onClick={() => router.push('/seller-dashboard/orders')}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {t('viewAllOrders')}
          </button>
          <button
            onClick={() => router.push('/seller-dashboard/listings')}
            className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {t('viewAllListings')}
          </button>
        </div>
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <RecentOrders />
      </div>

      {/* Dashboard Guide Section */}
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold font-rounded text-gray-900 dark:text-white mb-2">
            {t('howToUseDashboard')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('followTheseSteps')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1: Add Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold font-rounded text-gray-900 dark:text-white">
                {t('step1AddProducts')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">{t('uploadImagesSetPrices')}</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>{t('addNewProduct')}</li>
                  <li>{t('uploadMultipleHighQuality')}</li>
                  <li>{t('writeDetailedHonest')}</li>
                  <li>{t('setCompetitivePrices')}</li>
                  <li>{t('chooseAppropriateCategories')}</li>
                </ul>
              </div>
              <button 
                onClick={() => router.push('/seller-dashboard/add-product')}
                className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
{t('addNewProduct')}
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Manage Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold font-rounded text-gray-900 dark:text-white">
                {t('step3TrackOrders')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">{t('trackCustomerPurchases')}</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>{t('checkOrdersPageRegularly')}</li>
                  <li>{t('updateOrderStatus')}</li>
                  <li>{t('communicateWithCustomers')}</li>
                  <li>{t('trackShippingAndDelivery')}</li>
                  <li>{t('handleReturnsIfNeeded')}</li>
                </ul>
              </div>
              <button 
                onClick={() => router.push('/seller-dashboard/orders')}
                className="w-full text-left p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
{t('viewAllOrders')}
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Track Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold font-rounded text-gray-900 dark:text-white">
                {t('step4UpdateSettings')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">{t('updateProfileBusiness')}</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>{t('viewSalesStatistics')}</li>
                  <li>{t('checkProductPerformance')}</li>
                  <li>{t('monitorCustomerFeedback')}</li>
                  <li>{t('updateProductListings')}</li>
                  <li>{t('adjustPricingStrategies')}</li>
                </ul>
              </div>
              <button 
                onClick={() => router.push('/seller-dashboard/listings')}
                className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
{t('viewAllListings')}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Section */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold font-rounded text-gray-900 dark:text-white mb-2">
                {t('quickReferenceGuide')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('quickReferenceDescription')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('essentialPages')}</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• <strong>{t('addProduct')}:</strong> {t('addProductDescription')}</li>
                    <li>• <strong>{t('myListings')}:</strong> {t('myListingsDescription')}</li>
                    <li>• <strong>{t('orders')}:</strong> {t('ordersDescription')}</li>
                    <li>• <strong>{t('settings')}:</strong> {t('settingsDescription')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('proTips')}</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• {t('uploadMultipleHighQuality')}</li>
                    <li>• {t('writeDetailedHonest')}</li>
                    <li>• {t('respondQuicklyToInquiries')}</li>
                    <li>• {t('keepProductListingsUpdated')}</li>
                  </ul>
                </div>
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
      <DashboardLanguageProvider>
        <SellerDashboardLayout>
          <DashboardContent />
        </SellerDashboardLayout>
      </DashboardLanguageProvider>
    </DashboardProvider>
  );
}