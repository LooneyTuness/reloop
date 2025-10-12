"use client";

import React from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { EarningsZeroState } from '@/components/seller-dashboard/ZeroStates';
import { useRouter } from 'next/navigation';

function PayoutsContent() {
  const { stats, isLoading } = useDashboard();
  const router = useRouter();

  // Show zero state if no earnings data
  if (!isLoading && stats.totalEarnings === 0) {
    return (
      <SellerDashboardLayout>
        <div className="px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payouts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your earnings and payment settings
            </p>
          </div>
          <EarningsZeroState
            onViewEarnings={() => router.push('/seller-dashboard/payouts')}
            onStartSelling={() => router.push('/seller-dashboard/add-product')}
          />
        </div>
      </SellerDashboardLayout>
    );
  }

  return (
    <SellerDashboardLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payouts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your earnings and payment settings
          </p>
        </div>

        {/* Payouts content would go here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Payouts functionality coming soon...
          </p>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}

export default function PayoutsPage() {
  return (
    <DashboardProvider>
      <PayoutsContent />
    </DashboardProvider>
  );
}