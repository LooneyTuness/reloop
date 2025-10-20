import React from 'react';
import { Package, Eye, ShoppingCart, CheckCircle, Truck, Home } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import ShimmerPlaceholder, { ShimmerCard } from '@/components/ui/ShimmerPlaceholder';

interface Product {
  id: string;
  name: string;
  status: 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered' | 'active' | 'draft' | 'inactive';
  views: number;
  price: string;
  image?: string;
}

export default function ProductLifecycle() {
  const { products, isLoading } = useDashboard();
  const { t } = useDashboardLanguage();
  
  // Normalize statuses to lifecycle stages to avoid mismatches (e.g., 'active' -> 'listed')
  const normalizeStatus = (status: Product['status'] | undefined): Product['status'] => {
    if (!status) return 'listed';
    switch (status) {
      case 'active':
        return 'listed';
      case 'listed':
      case 'viewed':
      case 'in_cart':
      case 'sold':
      case 'shipped':
      case 'delivered':
        return status;
      default:
        return 'listed';
    }
  };

  const normalizedProducts = products.map(p => ({
    ...p,
    name: (p as any).title || p.name, // prefer title if available
    status: normalizeStatus(p.status)
  }));

  // Force re-render when normalized statuses change
  const renderKey = normalizedProducts.map(p => `${p.id}-${p.status}`).join(',');

  const lifecycleStages = [
    { key: 'listed', label: t('listed'), icon: Home, color: 'bg-gray-500', activeColor: 'bg-gray-600', textColor: 'text-gray-600' },
    { key: 'viewed', label: t('viewed'), icon: Eye, color: 'bg-blue-500', activeColor: 'bg-blue-600', textColor: 'text-blue-600' },
    { key: 'in_cart', label: t('inCart'), icon: ShoppingCart, color: 'bg-yellow-500', activeColor: 'bg-yellow-600', textColor: 'text-yellow-600' },
    { key: 'sold', label: t('sold'), icon: CheckCircle, color: 'bg-green-500', activeColor: 'bg-green-600', textColor: 'text-green-600' },
    { key: 'shipped', label: t('shipped'), icon: Truck, color: 'bg-orange-500', activeColor: 'bg-orange-600', textColor: 'text-orange-600' },
    { key: 'delivered', label: t('delivered'), icon: CheckCircle, color: 'bg-emerald-500', activeColor: 'bg-emerald-600', textColor: 'text-emerald-600' }
  ];

  const getStageIndex = (status: Product['status'] | undefined) => {
    const validStatuses = ['listed', 'viewed', 'in_cart', 'sold', 'shipped', 'delivered'];
    if (!status || !validStatuses.includes(status)) return 0;
    return lifecycleStages.findIndex(stage => stage.key === status);
  };

  const getStatusColor = (status: Product['status'] | undefined) => {
    const validStatuses = ['listed', 'viewed', 'in_cart', 'sold', 'shipped', 'delivered'];
    if (!status || !validStatuses.includes(status)) return 'bg-gray-500';
    const stage = lifecycleStages.find(s => s.key === status);
    return stage ? stage.color : 'bg-gray-500';
  };

  const getProgressPercentage = (status: Product['status'] | undefined) => {
    const validStatuses = ['listed', 'viewed', 'in_cart', 'sold', 'shipped', 'delivered'];
    if (!status || !validStatuses.includes(status)) return 0;
    const index = getStageIndex(status);
    return ((index + 1) / lifecycleStages.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        {/* Static header - renders immediately */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('productLifecycle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('trackProductsThroughSalesFunnel')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ShimmerPlaceholder className="h-8 w-12" />
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalProducts')}</div>
          </div>
        </div>

        {/* Shimmer for sales funnel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('salesFunnel')}</h4>
            <ShimmerPlaceholder className="h-4 w-24" />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            {lifecycleStages.map((stage) => (
              <div key={stage.key} className="flex flex-col items-center">
                <ShimmerPlaceholder className="h-12 w-12 rounded-2xl mb-2" />
                <div className="text-center">
                  <ShimmerPlaceholder className="h-3 w-4 mb-1" />
                  <ShimmerPlaceholder className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shimmer for product cards */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div key={renderKey} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center mr-4">
            <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('productLifecycle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('trackProductsThroughSalesFunnel')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalProducts')}</div>
        </div>
      </div>

      {/* Enhanced Sales Funnel */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('salesFunnel')}</h4>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {normalizedProducts.filter(p => p.status === 'sold' || p.status === 'shipped' || p.status === 'delivered').length} {t('productsSold')}
          </div>
        </div>
        
        <div className="relative">
          {/* Sales Funnel with Connecting Lines */}
          <div className="flex items-center justify-between mb-4">
            {lifecycleStages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = normalizedProducts.some(p => p.status === stage.key);
              const count = normalizedProducts.filter(p => p.status === stage.key).length;
              const isLastStage = index === lifecycleStages.length - 1;
              
              return (
                <div key={stage.key} className="flex items-center">
                  {/* Stage Circle */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive 
                        ? `${stage.activeColor} text-white shadow-lg scale-110` 
                        : `${stage.color} text-white/70`
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-900 dark:text-white">{count}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{stage.label}</div>
                    </div>
                  </div>
                  
                  {/* Connecting Line */}
                  {!isLastStage && (
                    <div className="flex-1 mx-2 relative">
                      {/* Background line */}
                      <div className="h-0.5 bg-gray-200 dark:bg-gray-700 w-full"></div>
                      {/* Active progress line */}
                      <div 
                        className={`absolute top-0 h-0.5 transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-r from-current to-transparent' 
                            : 'bg-transparent'
                        }`}
                        style={{
                          width: isActive ? '100%' : '0%',
                          background: isActive 
                            ? `linear-gradient(to right, ${stage.color.replace('bg-', '')}, transparent)`
                            : 'transparent'
                        }}
                      ></div>
                      {/* Arrow indicator */}
                      <div className={`absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 transition-all duration-300 ${
                        isActive 
                          ? 'border-l-2 border-l-gray-400 border-t-1 border-b-1 border-t-transparent border-b-transparent' 
                          : 'border-l-2 border-l-gray-300 border-t-1 border-b-1 border-t-transparent border-b-transparent'
                      }`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

     {/* Product Cards */}
      <div className="space-y-4">
        {normalizedProducts.slice(0, 4).map((product) => {
          const progressPercentage = getProgressPercentage(product.status);
          const stageIndex = getStageIndex(product.status);
          
          
          return (
            <div
              key={`${product.id}-${product.status}`}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.price} • {product.views} views
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(product.status)}`}>
                    {lifecycleStages[stageIndex]?.label}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('progress')}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(product.status)}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Stage Indicators with Connecting Lines */}
              <div className="flex items-center justify-between relative">
                {lifecycleStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isCompleted = index <= stageIndex;
                  const isCurrent = index === stageIndex;
                  const isLastStage = index === lifecycleStages.length - 1;
                  
                  return (
                    <div key={stage.key} className="flex items-center">
                      {/* Stage Circle */}
                      <div className="flex flex-col items-center space-y-1 relative z-10">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                              ? `${stage.color} text-white shadow-md`
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                          } ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          {stage.label}
                        </span>
                      </div>
                      
                      {/* Connecting Line */}
                      {!isLastStage && (
                        <div className="flex-1 mx-1 relative">
                          {/* Background line */}
                          <div className="h-0.5 bg-gray-200 dark:bg-gray-600 w-full"></div>
                          {/* Completed progress line */}
                          <div 
                            className={`absolute top-0 h-0.5 transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-gray-400 to-gray-300' 
                                : 'bg-transparent'
                            }`}
                            style={{
                              width: isCompleted ? '100%' : '0%'
                            }}
                          ></div>
                          {/* Arrow indicator */}
                          <div className={`absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-0 h-0 transition-all duration-300 ${
                            isCompleted 
                              ? 'border-l-1 border-l-gray-400 border-t-0.5 border-b-0.5 border-t-transparent border-b-transparent' 
                              : 'border-l-1 border-l-gray-300 border-t-0.5 border-b-0.5 border-t-transparent border-b-transparent'
                          }`}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {products.length > 4 && (
        <div className="mt-4 text-center">
          <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
{t('viewAllProducts')} ({products.length})
          </button>
        </div>
      )}
    </div>
  );
}