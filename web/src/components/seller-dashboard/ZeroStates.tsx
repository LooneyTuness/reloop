import React from 'react';
import { Package, Plus, ShoppingBag, TrendingUp, BarChart3, Eye } from 'lucide-react';
import ZeroState from './ZeroState';

interface ProductsZeroStateProps {
  onAddProduct: () => void;
  onViewGuide?: () => void;
}

export function ProductsZeroState({ onAddProduct, onViewGuide }: ProductsZeroStateProps) {
  return (
    <ZeroState
      icon={Package}
      title="No products listed yet"
      description="Start building your store by adding your first product. List items to begin selling and reach customers."
      actionLabel="Add Product"
      onAction={onAddProduct}
      secondaryAction={onViewGuide ? {
        label: "View Guide",
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
  return (
    <ZeroState
      icon={ShoppingBag}
      title="No recent orders"
      description="Orders will appear here once customers start purchasing your products. Focus on creating great listings to attract buyers."
      actionLabel="View All Orders"
      onAction={onViewOrders}
      secondaryAction={onPromoteProducts ? {
        label: "Promote Products",
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
  return (
    <ZeroState
      icon={BarChart3}
      title="Analytics data coming soon"
      description="Once you start selling, you'll see detailed analytics about your performance, sales trends, and customer insights."
      actionLabel="View Analytics"
      onAction={onViewAnalytics}
      secondaryAction={onAddProducts ? {
        label: "Add Products",
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
  return (
    <ZeroState
      icon={TrendingUp}
      title="No earnings yet"
      description="Your earnings will appear here once you make your first sale. Start by listing products and attracting customers."
      actionLabel="View Earnings"
      onAction={onViewEarnings}
      secondaryAction={onStartSelling ? {
        label: "Start Selling",
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
  return (
    <ZeroState
      icon={Eye}
      title="No views yet"
      description="Product views will appear here once customers start browsing your listings. Optimize your product descriptions and photos to attract more visitors."
      actionLabel="Optimize Listings"
      onAction={onOptimizeListings}
      secondaryAction={onAddMoreProducts ? {
        label: "Add More Products",
        onClick: onAddMoreProducts
      } : undefined}
      className="min-h-[300px]"
    />
  );
}
