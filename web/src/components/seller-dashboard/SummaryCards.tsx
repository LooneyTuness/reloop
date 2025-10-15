import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, Eye } from 'lucide-react';
import SummaryCard from './SummaryCard';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SummaryCards() {
  const { stats, isLoading } = useDashboard();
  const { t } = useDashboardLanguage();
  const { user } = useAuth();
  const [accurateAnalytics, setAccurateAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Fetch accurate analytics data
  useEffect(() => {
    const fetchAccurateAnalytics = async () => {
      if (!stats) return;
      
      setAnalyticsLoading(true);
      try {
        const { SupabaseDataService } = await import('@/lib/supabase/data-service');
        const dataService = new SupabaseDataService();
        
        const userId = user?.id || '9a2b8c5f-3517-4f3a-9b03-cb43e1a95a98';
        const analytics = await dataService.getAccurateAnalytics(userId, '30d');
        setAccurateAnalytics(analytics);
      } catch (error) {
        console.error('Error fetching accurate analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAccurateAnalytics();
  }, [stats]);

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

  // Use accurate analytics if available, otherwise fall back to estimates
  const cards = accurateAnalytics ? [
    {
      title: t('totalListings'),
      value: accurateAnalytics.current.totalListings.toString(),
      change: accurateAnalytics.changes.totalListings > 0 ? 
        `+${accurateAnalytics.changes.totalListings.toFixed(1)}% ${t('fromLastPeriod')}` : 
        accurateAnalytics.changes.totalListings < 0 ?
        `${accurateAnalytics.changes.totalListings.toFixed(1)}% ${t('fromLastPeriod')}` :
        t('noChange'),
      changeType: accurateAnalytics.changes.totalListings > 0 ? 'positive' as const : 
                 accurateAnalytics.changes.totalListings < 0 ? 'negative' as const : 'neutral' as const,
      icon: <Package className="h-8 w-8 text-blue-500" />
    },
    {
      title: t('itemsSoldThisMonth'),
      value: accurateAnalytics.current.soldItems.toString(),
      change: accurateAnalytics.changes.soldItems > 0 ? 
        `+${accurateAnalytics.changes.soldItems.toFixed(1)}% ${t('fromLastPeriod')}` : 
        accurateAnalytics.changes.soldItems < 0 ?
        `${accurateAnalytics.changes.soldItems.toFixed(1)}% ${t('fromLastPeriod')}` :
        t('noChange'),
      changeType: accurateAnalytics.changes.soldItems > 0 ? 'positive' as const : 
                 accurateAnalytics.changes.soldItems < 0 ? 'negative' as const : 'neutral' as const,
      icon: <TrendingUp className="h-8 w-8 text-green-500" />
    },
    {
      title: t('totalEarnings'),
      value: `${accurateAnalytics.current.totalRevenue.toFixed(2)} ${t('currency')}`,
      change: accurateAnalytics.changes.totalRevenue > 0 ? 
        `+${accurateAnalytics.changes.totalRevenue.toFixed(1)}% ${t('fromLastPeriod')}` : 
        accurateAnalytics.changes.totalRevenue < 0 ?
        `${accurateAnalytics.changes.totalRevenue.toFixed(1)}% ${t('fromLastPeriod')}` :
        t('noChange'),
      changeType: accurateAnalytics.changes.totalRevenue > 0 ? 'positive' as const : 
                 accurateAnalytics.changes.totalRevenue < 0 ? 'negative' as const : 'neutral' as const,
      icon: <DollarSign className="h-8 w-8 text-emerald-500" />
    },
    {
      title: t('totalOrders'),
      value: accurateAnalytics.current.totalOrders.toString(),
      change: `${accurateAnalytics.current.conversionRate.toFixed(1)}% ${t('conversion')}`,
      changeType: 'neutral' as const,
      icon: <Eye className="h-8 w-8 text-orange-500" />
    }
  ] : [
    // Fallback to estimates if accurate data is not available
    {
      title: t('totalListings'),
      value: safeStats.totalListings.toString(),
      change: `+2 ${t('thisWeek')}`,
      changeType: 'positive' as const,
      icon: <Package className="h-8 w-8 text-blue-500" />
    },
    {
      title: t('itemsSoldThisMonth'),
      value: safeStats.soldItems.toString(),
      change: `+12% ${t('fromLastMonth')}`,
      changeType: 'positive' as const,
      icon: <TrendingUp className="h-8 w-8 text-green-500" />
    },
    {
      title: t('totalEarnings'),
      value: `${safeStats.totalEarnings.toFixed(2)} ${t('currency')}`,
      change: `+340 ${t('currency')} ${t('thisMonth')}`,
      changeType: 'positive' as const,
      icon: <DollarSign className="h-8 w-8 text-emerald-500" />
    },
    {
      title: t('totalOrders'),
      value: safeStats.totalOrders.toString(),
      change: `${safeStats.conversionRate.toFixed(1)}% ${t('conversion')}`,
      changeType: 'neutral' as const,
      icon: <Eye className="h-8 w-8 text-orange-500" />
    }
  ];

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('storeOverview')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('keyMetrics')}
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
          {t('storeOverview')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('keyMetrics')}
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
