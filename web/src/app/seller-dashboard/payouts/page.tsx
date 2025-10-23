"use client";

import React from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { EarningsZeroState } from '@/components/seller-dashboard/ZeroStates';
import BackButton from '@/components/seller-dashboard/BackButton';
import { useRouter } from 'next/navigation';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';

function PayoutsContent() {
  const { stats, isLoading } = useDashboard();
  const router = useRouter();
  const { t } = useDashboardLanguage();

  // Show zero state if no earnings data
  if (!isLoading && stats.totalEarnings === 0) {
    return (
      <div className="px-6 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('payouts')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('manageEarnings')}
          </p>
        </div>
        <EarningsZeroState
          onViewEarnings={() => router.push('/seller-dashboard/payouts')}
          onStartSelling={() => router.push('/seller-dashboard/add-product')}
        />
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-4 sm:py-8">
      <div className="mb-8">
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('payouts')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('manageEarnings')}
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('payoutsComingSoon')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {t('workingOnPayoutSystem')}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t('whatsComing')}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
              <li>• {t('realTimeEarningsTracking')}</li>
              <li>• {t('multiplePaymentMethods')}</li>
              <li>• {t('automatedPayoutScheduling')}</li>
              <li>• {t('detailedTransactionHistory')}</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/seller-dashboard/listings')}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              {t('manageListings')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayoutsPage() {
  return (
    <SellerDashboardLayout>
      <DashboardProvider>
        <DashboardLanguageProvider>
          <PayoutsContent />
        </DashboardLanguageProvider>
      </DashboardProvider>
    </SellerDashboardLayout>
  );
}