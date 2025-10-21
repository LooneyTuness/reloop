import React, { memo, useCallback } from 'react';
import { Clock, Package, DollarSign, ShoppingBag, MoreVertical, ArrowRight } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import { OrdersZeroState } from './ZeroStates';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  productImage?: string;
}

const RecentOrders = memo(function RecentOrders() {
  const { orders, isLoading, updateOrderStatus } = useDashboard();
  const { t } = useDashboardLanguage();
  const router = useRouter();

  // Show zero state if no orders
  if (!isLoading && orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
            <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('recentOrders')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('latestCustomerOrders')}
            </p>
          </div>
        </div>
        <OrdersZeroState
          onViewOrders={() => window.location.href = '/seller-dashboard/orders'}
          onPromoteProducts={() => window.location.href = '/seller-dashboard/listings'}
        />
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'shipped':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = useCallback(async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('❌ RecentOrders: Failed to update order status:', error);
    }
  }, [updateOrderStatus]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mr-3 animate-pulse"></div>
          <div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mr-4">
            <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('recentOrders')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('latestCustomerOrders')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalOrders')}</div>
        </div>
      </div>

      <div className="space-y-4">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {order.customer}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {order.product}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status as Order['status'])}`}>
                  {getStatusIcon(order.status as Order['status'])}
                  <span className="capitalize hidden sm:inline">{order.status}</span>
                </span>
                <div className="relative group">
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
{t('markAsProcessing')}
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
{t('markAsShipped')}
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
{t('markAsDelivered')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.amount}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {order.date}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all sm:break-normal">
                {order.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 5 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => router.push('/seller-dashboard/orders')}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {t('viewAllOrders')} ({orders.length})
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
});

export default RecentOrders;