import React from 'react';
import { Package, Plus, ShoppingBag, TrendingUp, BarChart3, Eye } from 'lucide-react';
import ZeroState from './ZeroState';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

interface ProductsZeroStateProps {
  onAddProduct: () => void;
  onViewGuide?: () => void;
}

export function ProductsZeroState({ onAddProduct, onViewGuide }: ProductsZeroStateProps) {
  const { t } = useDashboardLanguage();
  
  return (
    <ZeroState
      icon={Package}
      title={t('noProductsListedYet')}
      description={t('startBuildingStore')}
      actionLabel={t('addProduct')}
      onAction={onAddProduct}
      secondaryAction={onViewGuide ? {
        label: t('viewGuide'),
        onClick: onViewGuide
      } : undefined}
      className="min-h-[400px]"
    />
  );
}

interface OrdersZeroStateProps {
  onViewOrders: () => void;
  onPromoteProducts?: () => void;
}

export function OrdersZeroState({ onViewOrders, onPromoteProducts }: OrdersZeroStateProps) {
  const { t } = useDashboardLanguage();
  
  return (
    <ZeroState
      icon={ShoppingBag}
      title={t('noRecentOrders')}
      description={t('ordersWillAppear')}
      actionLabel={t('viewAllOrders')}
      onAction={onViewOrders}
      secondaryAction={onPromoteProducts ? {
        label: t('promoteProducts'),
        onClick: onPromoteProducts
      } : undefined}
      className="min-h-[300px]"
    />
  );
}

interface AnalyticsZeroStateProps {
  onViewAnalytics: () => void;
  onAddProducts?: () => void;
}

export function AnalyticsZeroState({ onViewAnalytics, onAddProducts }: AnalyticsZeroStateProps) {
  const { t } = useDashboardLanguage();
  
  return (
    <ZeroState
      icon={BarChart3}
      title={t('analyticsDataComingSoon')}
      description={t('onceYouStartSelling')}
      actionLabel={t('viewAnalytics')}
      onAction={onViewAnalytics}
      secondaryAction={onAddProducts ? {
        label: t('addProducts'),
        onClick: onAddProducts
      } : undefined}
      className="min-h-[300px]"
    />
  );
}

interface EarningsZeroStateProps {
  onViewEarnings: () => void;
  onStartSelling?: () => void;
}

export function EarningsZeroState({ onViewEarnings, onStartSelling }: EarningsZeroStateProps) {
  const { t } = useDashboardLanguage();
  
  return (
    <ZeroState
      icon={TrendingUp}
      title={t('noEarningsYet')}
      description={t('earningsWillAppear')}
      actionLabel={t('viewEarnings')}
      onAction={onViewEarnings}
      secondaryAction={onStartSelling ? {
        label: t('startSelling'),
        onClick: onStartSelling
      } : undefined}
      className="min-h-[300px]"
    />
  );
}

interface ViewsZeroStateProps {
  onOptimizeListings: () => void;
  onAddMoreProducts?: () => void;
}

export function ViewsZeroState({ onOptimizeListings, onAddMoreProducts }: ViewsZeroStateProps) {
  const { t } = useDashboardLanguage();
  
  return (
    <ZeroState
      icon={Eye}
      title={t('noViewsYet')}
      description={t('productViewsWillAppear')}
      actionLabel={t('optimizeListings')}
      onAction={onOptimizeListings}
      secondaryAction={onAddMoreProducts ? {
        label: t('addMoreProducts'),
        onClick: onAddMoreProducts
      } : undefined}
      className="min-h-[300px]"
    />
  );
}
