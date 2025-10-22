'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SupabaseDataService } from '@/lib/supabase/data-service';
import { Eye, Package, Truck, CheckCircle, Clock, AlertCircle, X, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  order_id: string;
  item_id: string;
  vendor_id?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  quantity: number;
  price: number;
  created_at?: string;
  items?: {
    id: string;
    name?: string;
    title?: string;
    price: number;
    old_price?: number | null;
    condition?: string;
    size?: string | null;
    brand?: string | null;
    category?: string;
    category_id?: string | null;
    images?: string[] | null;
    seller_id?: string | null;
    status?: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    user_email?: string | null;
    is_active?: boolean;
    quantity?: number;
    sold_at?: string | null;
    buyer_id?: string | null;
    reserved_until?: string | null;
    reserved_by?: string | null;
    deleted_at?: string | null;
    seller?: string | null;
    description?: string;
  };
}

interface UserOrder {
  id: string;
  user_id?: string | null;
  buyer_id?: string | null;
  seller_id?: string | null;
  total_amount: number;
  payment_method?: string;
  status: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  });

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const dataService = new SupabaseDataService();
      const userOrders = await dataService.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const nextImage = useCallback(() => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  }, []);

  const prevImage = useCallback(() => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  }, []);


  // Keyboard navigation for image viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!imageViewer.isOpen) return;
      
      if (e.key === 'Escape') {
        setImageViewer(prev => ({ ...prev, isOpen: false }));
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageViewer.isOpen, nextImage, prevImage]);

  // Redirect to login if not authenticated (but only if not loading)
  if (!loading && !user) {
    router.push('/sign-in?redirect=/my-orders');
    return null;
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:pt-28">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 animate-pulse"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show zero state if no orders
  if (!isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:pt-28">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('myOrders')}</h1>
            <p className="text-gray-600 mb-8 text-lg">
              {t('noOrdersYet') || 'You haven\'t placed any orders yet.'}
            </p>
            <button
              onClick={() => router.push('/catalog')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="tracking-wide">{t('startShopping')}</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'processing': return <Package className="text-blue-500" size={16} />;
      case 'shipped': return <Truck className="text-purple-500" size={16} />;
      case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:pt-28">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 animate-pulse"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:pt-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('myOrders')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('viewYourOrderHistory') || 'View your order history and track your purchases'}
          </p>
        </div>


        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('order') || 'Нарачка'} #{order.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {t(order.status) || order.status}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {order.total_amount.toLocaleString()} {t('currency') || 'MKD'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items && order.order_items.length > 0 ? order.order_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="relative">
                        <img
                          src={
                            item.items?.images && Array.isArray(item.items.images) && item.items.images.length > 0
                              ? item.items.images[0]
                              : item.items?.images && typeof item.items.images === 'string'
                              ? item.items.images
                              : '/placeholder.svg'
                          }
                          alt={item.items?.title || 'Item'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.items?.title || 'Unknown Item'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.items?.brand && `${item.items.brand} • `}
                          {item.items?.size && `Size ${item.items.size} • `}
                          {item.items?.condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {(item.quantity * item.price).toLocaleString()} {t('currency') || 'MKD'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.price.toLocaleString()} {t('currency') || 'MKD'} each
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('noItemsInOrder') || 'No items found in this order'}</p>
                    </div>
                  )}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Eye size={16} />
                    {t('viewDetails') || 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pt-24 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('orderDetails') || 'Детали за нарачката'} #{selectedOrder.id.substring(0, 8).toUpperCase()}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {t(selectedOrder.status) || selectedOrder.status}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('orderedOn') || 'Нарачано на'} {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : t('unknownDate') || 'Непознат датум'}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('shippingAddress') || 'Адреса за испорака'}</h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.full_name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedOrder.address_line1}</p>
                    {selectedOrder.address_line2 && (
                      <p className="text-gray-600 dark:text-gray-400">{selectedOrder.address_line2}</p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedOrder.city}, {selectedOrder.postal_code}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedOrder.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('items') || 'Производи'}</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <img
                          src={
                            item.items?.images && Array.isArray(item.items.images) && item.items.images.length > 0
                              ? item.items.images[0]
                              : item.items?.images && typeof item.items.images === 'string'
                              ? item.items.images
                              : '/placeholder.svg'
                          }
                          alt={item.items?.title || 'Item'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {item.items?.title || 'Unknown Item'}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('quantity') || 'Количина'}: {item.quantity} × {item.price.toLocaleString()} {t('currency') || 'MKD'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {(item.quantity * item.price).toLocaleString()} {t('currency') || 'MKD'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="pt-6">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                    <span>{t('total') || 'Вкупно'}</span>
                    <span>{selectedOrder.total_amount.toLocaleString()} {t('currency') || 'MKD'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
