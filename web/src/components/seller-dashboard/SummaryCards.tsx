import React from 'react';
import { Package, TrendingUp, DollarSign, Eye } from 'lucide-react';
import SummaryCard from './SummaryCard';
import { useDashboard } from '@/contexts/DashboardContext';

export default function SummaryCards() {
  const { stats, isLoading } = useDashboard();

  // Provide default values to prevent undefined errors
  const safeStats = {
    totalListings: stats?.totalListings || 0,
    activeListings: stats?.activeListings || 0,
    soldItems: stats?.soldItems || 0,
    totalEarnings: stats?.totalEarnings || 0,
    totalOrders: stats?.totalOrders || 0,
    avgOrderValue: stats?.avgOrderValue || 0,
    conversionRate: stats?.conversionRate || 0
  };

  const cards = [
    {
      title: 'Total Listings',
      value: safeStats.totalListings.toString(),
      change: '+2 this week',
      changeType: 'positive' as const,
      icon: <Package className="h-8 w-8 text-blue-500" />
    },
    {
      title: 'Items Sold (This Month)',
      value: safeStats.soldItems.toString(),
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: <TrendingUp className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Total Earnings',
      value: `$${safeStats.totalEarnings.toFixed(2)}`,
      change: '+$340 this month',
      changeType: 'positive' as const,
      icon: <DollarSign className="h-8 w-8 text-emerald-500" />
    },
    {
      title: 'Total Orders',
      value: safeStats.totalOrders.toString(),
      change: `${safeStats.conversionRate.toFixed(1)}% conversion`,
      changeType: 'neutral' as const,
      icon: <Eye className="h-8 w-8 text-purple-500" />
    }
  ];

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Store Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Key metrics for your store performance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Store Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Key metrics for your store performance
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
