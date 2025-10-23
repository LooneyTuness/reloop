'use client';

import React, { useState, useCallback, Suspense } from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { OrdersZeroState } from '@/components/seller-dashboard/ZeroStates';
import BackButton from '@/components/seller-dashboard/BackButton';
import { Search, Eye, Package, Truck, CheckCircle, Clock, AlertCircle, X, ZoomIn, ChevronLeft, ChevronRight, User, Calendar, CreditCard, Info, Mail, Phone, MapPin } from 'lucide-react';
import EnhancedImage from '@/components/EnhancedImage';
import { useRouter } from 'next/navigation';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import OrdersSkeleton from '@/components/seller-dashboard/OrdersSkeleton';

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

interface ExtendedOrder {
  id: string;
  user_id?: string | null;
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
  // Computed fields from DashboardContext
  customer?: string;
  customer_name?: string;
  customer_email?: string;
  product?: string;
  product_name?: string;
  product_image?: string;
  amount?: string;
  date?: string;
  order_items?: OrderItem[];
  // Additional computed fields
  item_count?: number;
  seller_order_items?: OrderItem[];
}

const OrdersContent = React.memo(function OrdersContent() {
  const { orders, updateOrderStatus, isLoading, error } = useDashboard();
  const router = useRouter();
  const { t } = useDashboardLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
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
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!imageViewer.isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          closeImageViewer();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageViewer.isOpen, nextImage, prevImage]);

  // Generate a user-friendly order number from UUID
  const generateOrderNumber = (orderId: string) => {
    // Take the first 6 characters and make them uppercase
    return `#${orderId.substring(0, 6).toUpperCase()}`;
  };

  // Memoize filtered orders to avoid expensive recalculations (must be before conditionals)
  const filteredOrders = React.useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return (orders as ExtendedOrder[]).filter(order => {
      const matchesSearch = !searchQuery ||
        (order.customer_name && String(order.customer_name).toLowerCase().includes(searchLower)) ||
        (order.product_name && String(order.product_name).toLowerCase().includes(searchLower)) ||
        (order.id && String(order.id).toLowerCase().includes(searchLower));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show zero state if no orders (only after loading is complete)
  if (!isLoading && orders.length === 0) {
    return (
      <div className="px-3 sm:px-6 py-4 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('orders')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('manageCustomerOrders')}
          </p>
        </div>
        <OrdersZeroState
          onViewOrders={() => router.push('/seller-dashboard/orders')}
          onPromoteProducts={() => router.push('/seller-dashboard/listings')}
        />
      </div>
    );
  }

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
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch {
    }
  };

  const openImageViewer = (images: string[], title: string, startIndex: number = 0) => {
    const newState = {
      isOpen: true,
      images,
      currentIndex: startIndex,
      title
    };
    setImageViewer(newState);
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      images: [],
      currentIndex: 0,
      title: ''
    });
  };

  return (
    <div className="w-full py-4 sm:py-8 max-w-none">
      {/* Header */}
      <div className="px-3 sm:px-6 mb-8">
        <BackButton className="mb-4" />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('ordersPageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('ordersPageDescription')}
          </p>
        </div>
      </div>

        {/* Filters and Search */}
        <div className="px-3 sm:px-6 flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('searchOrders')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm cursor-pointer font-medium text-sm"
            >
              <option value="all">{t('allOrders')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="processing">{t('processing')}</option>
              <option value="shipped">{t('shipped')}</option>
              <option value="delivered">{t('delivered')}</option>
              <option value="cancelled">{t('cancelled')}</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-3 sm:px-6 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Orders Table */}
        <div className="w-full bg-white dark:bg-gray-800 shadow-sm border-t border-b border-gray-200 dark:border-gray-700 overflow-hidden mx-0 sm:mx-0 lg:mx-0 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('orderId')}
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    {t('customer')}
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('product')}
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    {t('total')}
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    {t('date')}
                  </th>
                  <th className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={(e) => {
                    // Prevent row click from interfering with image clicks
                    if (e.target !== e.currentTarget) {
                      e.stopPropagation();
                    }
                  }}>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative group">
                          <EnhancedImage
                            className="h-10 w-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            src={order.product_image || '/api/placeholder/60/60'}
                            alt={order.product_name || 'Product'}
                            retryCount={2}
                            enableRefresh={true}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Get images from the first seller order item
                              const firstItem = order.seller_order_items?.[0];
                              if (firstItem?.items?.images) {
                                const images = Array.isArray(firstItem.items.images) ? 
                                  firstItem.items.images : 
                                  [firstItem.items.images];
                                openImageViewer(images, firstItem.items.title || 'Product', 0);
                              } else {
                                // Fallback to placeholder image
                                openImageViewer(['/api/placeholder/60/60'], order.product_name || 'Product', 0);
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all">
                            <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {(order.item_count || 0) > 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                              {order.item_count}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.customer_name || 'Customer'} - {order.product_name || 'Product'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown date'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customer_name || 'Unknown Customer'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {order.customer_email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4">
                      <div className="space-y-2">
                        {order.seller_order_items?.slice(0, 2).map((item: OrderItem, index: number) => {
                          return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.items?.title || 'Unknown Product'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="print-mk-qty">Qty:</span> {item.quantity} × <span className="print-currency">{item.price?.toFixed(2)} {t("currency")}</span>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                        {(order.item_count || 0) > 2 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            +{(order.item_count || 0) - 2} more items
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.total_amount.toFixed(2)} MKD
                      </div>
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {t(order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
                        </span>
                      </div>
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="pl-3 sm:pl-6 pr-3 sm:pr-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={t('viewOrderDetails')}
                        >
                          <Eye size={16} />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm cursor-pointer font-medium"
                        >
                          <option value="pending" className="py-2">🕐 {t('pending')}</option>
                          <option value="processing" className="py-2">📦 {t('processing')}</option>
                          <option value="shipped" className="py-2">🚚 {t('shipped')}</option>
                          <option value="delivered" className="py-2">✅ {t('delivered')}</option>
                          <option value="cancelled" className="py-2">❌ {t('cancelled')}</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="px-3 sm:px-6 text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Package size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('noOrdersFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? t('tryAdjustingFilters')
                : t('noOrdersYetMessage')
              }
            </p>
          </div>
        )}

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            .no-print { display: none !important; }
            .print-currency::after { content: " MKD"; }
            .print-currency { font-weight: bold; }
            
            /* Macedonian translations for print */
            .print-mk-order-details::before { content: "Детали за нарачката"; }
            .print-mk-order-id::before { content: "ID на нарачката: "; }
            .print-mk-order-date::before { content: "Датум на нарачката: "; }
            .print-mk-status::before { content: "Статус: "; }
            .print-mk-customer-info::before { content: "Информации за клиентот"; }
            .print-mk-full-name::before { content: "Име и презиме: "; }
            .print-mk-email::before { content: "Е-пошта: "; }
            .print-mk-phone::before { content: "Телефон: "; }
            .print-mk-shipping-address::before { content: "Адреса за испорака"; }
            .print-mk-address::before { content: "Адреса: "; }
            .print-mk-city-postal::before { content: "Град и поштенски код: "; }
            .print-mk-order-notes::before { content: "Белешки за нарачката"; }
            .print-mk-products::before { content: "Производи во нарачката"; }
            .print-mk-items::before { content: "број предмети"; }
            .print-mk-payment-method::before { content: "Начин на плаќање: "; }
            .print-mk-order-total::before { content: "Вкупна сума на нарачката: "; }
            .print-mk-order-subtotal::before { content: "Подзбир на нарачката: "; }
            .print-mk-unit-price::before { content: "Цена по единица: "; }
            .print-mk-quantity::before { content: "Количина: "; }
            .print-mk-size::before { content: "Големина: "; }
            .print-mk-brand::before { content: "Бренд: "; }
            .print-mk-condition::before { content: "Состојба: "; }
            .print-mk-category::before { content: "Категорија: "; }
            .print-mk-original-price::before { content: "Оригинална цена: "; }
            .print-mk-save::before { content: "Заштеда "; }
            .print-mk-description::before { content: "Опис: "; }
            .print-mk-item-id::before { content: "ID на предмет: "; }
            .print-mk-order-item-id::before { content: "ID на предмет во нарачка: "; }
            .print-mk-vendor-id::before { content: "ID на продавач: "; }
            .print-mk-buyer-name::before { content: "Име на купувач: "; }
            .print-mk-buyer-email::before { content: "Е-пошта на купувач: "; }
            .print-mk-buyer-phone::before { content: "Телефон на купувач: "; }
            .print-mk-added-to-order::before { content: "Додадено во нарачка: "; }
            .print-mk-sold-at::before { content: "Продадено на: "; }
            .print-mk-status-active::before { content: "Активен"; }
            .print-mk-status-inactive::before { content: "Неактивен"; }
            .print-mk-pending::before { content: "Во чекање"; }
            .print-mk-processing::before { content: "Во обработка"; }
            .print-mk-shipped::before { content: "Испратено"; }
            .print-mk-delivered::before { content: "Доставено"; }
            .print-mk-each::before { content: "по парче"; }
            .print-mk-qty::before { content: "Кол: "; }
          }
        `}</style>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white print-mk-order-details">
                    {t('orderDetails')}
                  </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="print-mk-order-id">{t('orderNumber')} #</span>{selectedOrder.customer_name || 'Customer'} • <span className="print-mk-order-date">{t('orderDate')}: </span>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                      className="no-print p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                      <X size={20} />
                  </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Order Status and Timeline */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(selectedOrder.status)}
                    <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('orderStatus')}
                          </h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                    </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 print-mk-order-total">{t('orderTotal')}</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 print-currency">
                          {selectedOrder.total_amount?.toFixed(2) || '0.00'} {t("currency")}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Timeline */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('orderTimeline')}</h4>
                      <div className="flex items-center space-x-4">
                        {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                          const isActive = selectedOrder.status === status;
                          const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status) >= index;
                          
                          return (
                            <div key={status} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isActive 
                                  ? 'bg-blue-500 text-white' 
                                  : isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle size={16} />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-current" />
                                )}
                              </div>
                              <span className={`ml-2 text-xs font-medium ${
                                isActive 
                                  ? 'text-blue-600 dark:text-blue-400' 
                                  : isCompleted 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                              {index < 3 && (
                                <div className={`w-8 h-0.5 mx-2 ${
                                  isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
{t('orderInformation')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-500" />
                    <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('orderId')}</p>
                            <p className="font-medium text-gray-900 dark:text-white font-mono">
                              #{selectedOrder.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('orderDate')}</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('paymentMethod')}</p>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {selectedOrder.payment_method || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        {selectedOrder.updated_at && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{t('lastUpdated')}</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {new Date(selectedOrder.updated_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-mk-order-details">
                        <Package className="w-5 h-5" />
{t('orderSummary')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 print-mk-order-id">{t('orderId')}:</span>
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {generateOrderNumber(selectedOrder.id)}
                          </span>
                      </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 print-mk-items">{t('itemsCount')}:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedOrder.item_count || 0} <span className="print-mk-items">items</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 print-mk-items">{t('items')}:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedOrder.seller_order_items?.length || selectedOrder.order_items?.length || 0} <span className="print-mk-items">items</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 print-mk-payment-method">{t('paymentMethod')}:</span>
                          <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            {selectedOrder.payment_method || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white print-mk-order-total">{t('orderTotal')}:</span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400 print-currency">
                            {(selectedOrder.seller_order_items || selectedOrder.order_items || [])
                              .reduce((sum: number, item: OrderItem) => sum + (item.quantity * item.price), 0)
                              .toFixed(2) || '0.00'} {t("currency")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  {(selectedOrder.full_name || selectedOrder.email || selectedOrder.phone) && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-mk-customer-info">
              <User className="w-5 h-5" />
{t('customerInformation')}
            </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrder.full_name && (
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
                    <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 print-mk-full-name">{t('fullName')}</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedOrder.full_name}
                              </p>
                    </div>
                          </div>
                        )}
                        {selectedOrder.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 print-mk-email">{t('email')}</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedOrder.email}
                              </p>
                    </div>
                  </div>
                        )}
                        {selectedOrder.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 print-mk-phone">{t('phone')}</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedOrder.phone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {(selectedOrder.address_line1 || selectedOrder.city || selectedOrder.postal_code) && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 print-mk-shipping-address">
              <MapPin className="w-5 h-5" />
{t('shippingAddress')}
            </h3>
                      <div className="space-y-2">
                        {selectedOrder.address_line1 && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 print-mk-address">{t('address')}</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {selectedOrder.address_line1}
                              </p>
                              {selectedOrder.address_line2 && (
                                <p className="text-gray-700 dark:text-gray-300">
                                  {selectedOrder.address_line2}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {(selectedOrder.city || selectedOrder.postal_code) && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 print-mk-city-postal">{t('cityPostalCode')}</p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {[selectedOrder.city, selectedOrder.postal_code].filter(Boolean).join(', ') || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Notes */}
                  {selectedOrder.notes && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 print-mk-order-notes">
              <Info className="w-5 h-5" />
              Order Notes
            </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}

                  {/* Product Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2 print-mk-products">
                      <Package className="w-5 h-5" />
{t('productsInThisOrder')} ({selectedOrder.seller_order_items?.length || selectedOrder.order_items?.length || 0} <span className="print-mk-items">{t('items')}</span>)
                    </h3>
                    <div className="space-y-6">
                      {(selectedOrder.seller_order_items || selectedOrder.order_items || []).map((orderItem: OrderItem, index: number) => {
                        const images = orderItem.items?.images ? 
                          (Array.isArray(orderItem.items.images) ? orderItem.items.images : [orderItem.items.images]) : 
                          ['/api/placeholder/80/80'];
                        
                        return (
                          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                              {/* Image Section */}
                              <div className="flex-shrink-0 relative group self-start">
                                <EnhancedImage
                                  src={images[0]}
                                  alt={orderItem.items?.title || 'Product'}
                                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                                  retryCount={2}
                                  enableRefresh={true}
                                  onClick={() => openImageViewer(images, orderItem.items?.title || 'Product', 0)}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl flex items-center justify-center transition-all">
                                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                {images.length > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                                    {images.length}
                                  </div>
                                )}
                              </div>
                              
                              {/* Content Section */}
                              <div className="flex-1 min-w-0">
                                {/* Header with title and price */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                      {orderItem.items?.title || 'Unknown Product'}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                      <span className="print-mk-qty">Qty:</span>
                                      <span className="font-medium">{orderItem.quantity}</span>
                                      <span>×</span>
                                      <span className="print-currency font-medium">{orderItem.price?.toFixed(2)} {t("currency")}</span>
                                      <span className="print-mk-each">each</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white print-currency">
                                      {(orderItem.quantity * orderItem.price)?.toFixed(2)} {t("currency")}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Product Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 print-mk-quantity font-medium">Quantity:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {orderItem.quantity}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 print-mk-unit-price font-medium">Unit Price:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white print-currency">
                                      {orderItem.price?.toFixed(2)} {t("currency")}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 print-mk-size font-medium">Size:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {orderItem.items?.size || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 print-mk-brand font-medium">Brand:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {orderItem.items?.brand || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 print-mk-condition font-medium">Condition:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {orderItem.items?.condition || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 print-mk-category font-medium">Category:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {orderItem.items?.category_id || 'N/A'}
                                    </span>
                                  </div>
                                  {orderItem.items?.old_price && (
                                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span className="text-gray-600 dark:text-gray-400 print-mk-original-price font-medium">Original Price:</span>
                                        <span className="font-medium text-gray-500 line-through print-currency">
                                          {orderItem.items.old_price.toFixed(2)} {t("currency")}
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                          (<span className="print-mk-save">Save</span> {((orderItem.items.old_price - orderItem.items.price) / orderItem.items.old_price * 100).toFixed(0)}%)
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Description Section */}
                                {orderItem.items?.description && (
                                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium print-mk-description">Description:</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                                      {orderItem.items.description}
                                    </p>
                                  </div>
                                )}

                                {/* Order Item Metadata */}
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 print-mk-order-details">
                                    <Info className="w-4 h-4" />
                                    Item Details
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-gray-500 dark:text-gray-400 print-mk-item-id font-medium">Item ID:</span>
                                      <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">
                                        {orderItem.item_id}
                                      </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-gray-500 dark:text-gray-400 print-mk-order-item-id font-medium">Order Item ID:</span>
                                      <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">
                                        {orderItem.id}
                                      </span>
                                    </div>
                                    {orderItem.vendor_id && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-vendor-id font-medium">Vendor ID:</span>
                                        <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">
                                          {orderItem.vendor_id}
                                        </span>
                                      </div>
                                    )}
                                    {orderItem.buyer_name && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-buyer-name font-medium">Buyer:</span>
                                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                                          {orderItem.buyer_name}
                                        </span>
                                      </div>
                                    )}
                                    {orderItem.buyer_email && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-buyer-email font-medium">Buyer Email:</span>
                                        <span className="text-gray-700 dark:text-gray-300 text-xs break-all">
                                          {orderItem.buyer_email}
                                        </span>
                                      </div>
                                    )}
                                    {orderItem.buyer_phone && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-buyer-phone font-medium">Buyer Phone:</span>
                                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                                          {orderItem.buyer_phone}
                                        </span>
                                      </div>
                                    )}
                                    {orderItem.created_at && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-added-to-order font-medium">Added to Order:</span>
                                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                                          {new Date(orderItem.created_at).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    {orderItem.items?.sold_at && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-sold-at font-medium">Sold At:</span>
                                        <span className="text-gray-700 dark:text-gray-300 text-xs">
                                          {new Date(orderItem.items.sold_at).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    {orderItem.items?.is_active !== undefined && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-gray-500 dark:text-gray-400 print-mk-status font-medium">Status:</span>
                                        <span className={`font-medium text-xs ${
                                          orderItem.items.is_active 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                          {orderItem.items.is_active ? <span className="print-mk-status-active">Active</span> : <span className="print-mk-status-inactive">Inactive</span>}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                    
                    {/* Show total for all items in this order */}
                    {((selectedOrder.seller_order_items && selectedOrder.seller_order_items.length > 0) || (selectedOrder.order_items && selectedOrder.order_items.length > 0)) && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white print-mk-order-subtotal">
                            Order Subtotal:
                          </span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 print-currency">
                            {(selectedOrder.seller_order_items || selectedOrder.order_items || [])
                              .reduce((sum: number, item: OrderItem) => sum + (item.quantity * item.price), 0)
                              .toFixed(2)} {t("currency")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Order Date
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedOrder.date}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {imageViewer.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
              {/* Close button */}
              <button
                onClick={closeImageViewer}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Image */}
                <div className="relative">
                  <img
                    src={imageViewer.images[imageViewer.currentIndex]}
                    alt={imageViewer.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                  
                  {/* Navigation arrows */}
                  {imageViewer.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image info */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {imageViewer.title}
                  </h3>
                  {imageViewer.images.length > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Image {imageViewer.currentIndex + 1} of {imageViewer.images.length}
                      </p>
                      <div className="flex space-x-1">
                        {imageViewer.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setImageViewer(prev => ({ ...prev, currentIndex: index }))}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === imageViewer.currentIndex 
                                ? 'bg-blue-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
});

export default function OrdersPage() {
  return (
    <SellerDashboardLayout>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent />
      </Suspense>
    </SellerDashboardLayout>
  );
}
