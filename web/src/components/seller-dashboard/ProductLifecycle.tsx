import React from 'react';
import { Package, Eye, ShoppingCart, CheckCircle, Truck, Home } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';

interface Product {
  id: string;
  name: string;
  status: 'listed' | 'viewed' | 'in_cart' | 'sold' | 'shipped' | 'delivered';
  views: number;
  price: string;
  image?: string;
}

export default function ProductLifecycle() {
  const { products, isLoading } = useDashboard();

  const lifecycleStages = [
    { key: 'listed', label: 'Listed', icon: Home, color: 'bg-gray-500' },
    { key: 'viewed', label: 'Viewed', icon: Eye, color: 'bg-blue-500' },
    { key: 'in_cart', label: 'In Cart', icon: ShoppingCart, color: 'bg-yellow-500' },
    { key: 'sold', label: 'Sold', icon: CheckCircle, color: 'bg-green-500' },
    { key: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-500' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-500' }
  ];

  const getStageIndex = (status: Product['status']) => {
    return lifecycleStages.findIndex(stage => stage.key === status);
  };

  const getStatusColor = (status: Product['status']) => {
    const stage = lifecycleStages.find(s => s.key === status);
    return stage ? stage.color : 'bg-gray-500';
  };

  const getProgressPercentage = (status: Product['status']) => {
    const index = getStageIndex(status);
    return ((index + 1) / lifecycleStages.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3 animate-pulse"></div>
          <div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
          <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Product Lifecycle
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Track your products through the sales funnel
          </p>
        </div>
      </div>

      {/* Lifecycle Stages Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Funnel</h4>
          <div className="flex space-x-1">
            {lifecycleStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.key}
                  className={`h-2 w-8 rounded-full ${stage.color} ${
                    index < lifecycleStages.length - 1 ? 'mr-1' : ''
                  }`}
                  title={stage.label}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {lifecycleStages.map((stage) => (
            <span key={stage.key} className="text-center">
              {stage.label}
            </span>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {products.slice(0, 4).map((product) => {
          const progressPercentage = getProgressPercentage(product.status);
          const stageIndex = getStageIndex(product.status);
          
          return (
            <div
              key={product.id}
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
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

              {/* Stage Indicators */}
              <div className="flex items-center justify-between">
                {lifecycleStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isCompleted = index <= stageIndex;
                  const isCurrent = index === stageIndex;
                  
                  return (
                    <div
                      key={stage.key}
                      className={`flex flex-col items-center space-y-1 ${
                        index < lifecycleStages.length - 1 ? 'mr-2' : ''
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? `${stage.color} text-white`
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500'
                        } ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {stage.label}
                      </span>
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
            View all products ({products.length})
          </button>
        </div>
      )}
    </div>
  );
}