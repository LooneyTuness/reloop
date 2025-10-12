'use client';

import React, { useState } from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { AnalyticsZeroState } from '@/components/seller-dashboard/ZeroStates';
import { TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

function AnalyticsContent() {
  const { stats, products, orders, isLoading, error } = useDashboard();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  // Show zero state if no data available
  if (!isLoading && products.length === 0 && orders.length === 0) {
    return (
      <SellerDashboardLayout>
        <div className="px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your sales performance and insights
            </p>
          </div>
          <AnalyticsZeroState
            onViewAnalytics={() => router.push('/seller-dashboard/analytics')}
            onAddProducts={() => router.push('/seller-dashboard/add-product')}
          />
        </div>
      </SellerDashboardLayout>
    );
  }

  // Calculate analytics from real data
  const analyticsData = {
    sales: {
      current: stats.totalEarnings,
      previous: stats.totalEarnings * 0.8, // Mock previous period
      change: 25.0,
      trend: 'up' as const
    },
    views: {
      current: products.reduce((sum, product) => sum + (product.views || 0), 0),
      previous: products.reduce((sum, product) => sum + (product.views || 0), 0) * 0.8,
      change: 20.0,
      trend: 'up' as const
    },
    orders: {
      current: stats.totalOrders,
      previous: Math.floor(stats.totalOrders * 0.8),
      change: 30.0,
      trend: 'up' as const
    },
    conversion: {
      current: stats.conversionRate,
      previous: stats.conversionRate * 0.9,
      change: 15.0,
      trend: 'up' as const
    }
  };

  // Generate chart data from orders
  const generateChartData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const chartData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(order => 
        order.created_at && order.created_at.startsWith(dateStr)
      );
      
      chartData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        sales: dayOrders.length,
        views: Math.floor(Math.random() * 50) + 10 // Mock views for now
      });
    }
    
    return chartData;
  };

  const chartData = generateChartData();

  // Top products from real data
  const topProducts = products
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(product => ({
      id: product.id,
      title: product.title,
      sales: Math.floor(Math.random() * 20) + 1, // Mock sales count
      revenue: (Math.floor(Math.random() * 20) + 1) * product.price
    }));

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'sales': return <DollarSign className="text-green-600 dark:text-green-400" size={24} />;
      case 'views': return <Eye className="text-blue-600 dark:text-blue-400" size={24} />;
      case 'orders': return <ShoppingCart className="text-purple-600 dark:text-purple-400" size={24} />;
      case 'conversion': return <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />;
      default: return <TrendingUp className="text-gray-600 dark:text-gray-400" size={24} />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'sales': return 'bg-green-100 dark:bg-green-900/20';
      case 'views': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'orders': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'conversion': return 'bg-orange-100 dark:bg-orange-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (isLoading) {
    return (
      <SellerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SellerDashboardLayout>
    );
  }

  return (
    <SellerDashboardLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your sales performance and insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(analyticsData).map(([key, data]) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${getMetricColor(key)}`}>
                  {getMetricIcon(key)}
                </div>
                <div className={`flex items-center text-sm ${
                  data.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {data.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="ml-1">{data.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {key === 'sales' ? `$${data.current.toLocaleString()}` : 
                   key === 'conversion' ? `${data.current.toFixed(1)}%` : 
                   data.current.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key === 'sales' ? 'Total Sales' :
                   key === 'views' ? 'Product Views' :
                   key === 'orders' ? 'Total Orders' :
                   'Conversion Rate'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sales Overview
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('sales')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedMetric === 'sales'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setSelectedMetric('views')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedMetric === 'views'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Views
                </button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-1">
              {chartData.slice(-6).map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                    style={{
                      height: `${Math.max((selectedMetric === 'sales' ? data.sales : data.views) * 2, 4)}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Top Performing Products
            </h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.sales} sales • ${product.revenue.toFixed(2)} revenue
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      #{index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Customer Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Returning Customers</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">4.8/5</span>
              </div>
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sales by Category
            </h2>
            <div className="space-y-3">
              {['Clothing', 'Shoes', 'Accessories', 'Bags'].map((category, index) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(index + 1) * 20}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {(index + 1) * 20}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="text-green-600 dark:text-green-400" size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">
                      New order from {order.customer}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SellerDashboardLayout>
  );
}

export default function AnalyticsPage() {
  return (
    <DashboardProvider>
      <AnalyticsContent />
    </DashboardProvider>
  );
}
