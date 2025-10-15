'use client';

import React, { useState, useEffect } from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { ProductsZeroState } from '@/components/seller-dashboard/ZeroStates';
import PlaceholderImage from '@/components/PlaceholderImage';
import { Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical, Package } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';

function ListingsContent() {
  const { products, isLoading, error, updateProduct, deleteProduct, searchProducts } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useDashboardLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Handle browser extension errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Suppress browser extension communication errors
      if (event.message?.includes('listener indicated an asynchronous response') ||
          event.message?.includes('message channel closed')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress browser extension promise rejection errors
      if (event.reason?.message?.includes('listener indicated an asynchronous response') ||
          event.reason?.message?.includes('message channel closed')) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter products based on search query and status filter
    let filtered = products.filter(product => {
      const matchesSearch = (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case 'price-high':
          return parseFloat(b.price || '0') - parseFloat(a.price || '0');
        case 'price-low':
          return parseFloat(a.price || '0') - parseFloat(b.price || '0');
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, statusFilter, sortBy]);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      const searchResults = await searchProducts(query);
      setFilteredProducts(searchResults);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleStatusUpdate = async (productId: string, newStatus: string) => {
    try {
      await updateProduct(productId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm(t('confirmDeleteProduct'))) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'sold': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show zero state if no products
  if (!isLoading && products.length === 0) {
    return (
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('productListings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('manageProductInventory')}
          </p>
        </div>
        <ProductsZeroState
          onAddProduct={() => router.push('/seller-dashboard/add-product')}
          onViewGuide={() => router.push('/seller-dashboard/guide')}
        />
      </div>
    );
  }

  return (
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('myListings')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('manageProductInventory')}
            </p>
          </div>
          <button 
            onClick={() => router.push('/seller-dashboard/add-product')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            {t('addProduct')}
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('searchProducts')}
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
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="active">{t('active')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="sold">{t('sold')}</option>
              <option value="draft">{t('draft')}</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">{t('newestFirst')}</option>
              <option value="oldest">{t('oldestFirst')}</option>
              <option value="price-high">{t('priceHighToLow')}</option>
              <option value="price-low">{t('priceLowToHigh')}</option>
              <option value="views">{t('mostViewed')}</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => {
            // Simplified image handling
            let productImage = '/api/placeholder/400/400'; // Default fallback
            
            if (product.images) {
              if (Array.isArray(product.images) && product.images.length > 0) {
                productImage = product.images[0];
              } else if (typeof product.images === 'string' && (product.images as string).trim() !== '') {
                productImage = product.images;
              }
            }
            
            
            
            return (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                  <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded z-10">
                    #{index + 1}
                  </div>
                  <PlaceholderImage
                    src={productImage}
                    alt={product.title || 'Product'}
                    className="w-full h-full object-cover"
                    fallbackText={t("noImage")}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status || 'active')}`}>
                      {product.status || 'active'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <button className="p-1 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {product.title || 'Untitled Product'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {product.category_id ? 'Category ID: ' + product.category_id : t('uncategorized')}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {product.price || '0.00'} MKD
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.views || 0} {t('views')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => router.push(`/seller-dashboard/edit-product/${product.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title={t("editProduct")}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <select
                      value={product.status || 'active'}
                      onChange={(e) => handleStatusUpdate(product.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="active">{t('active')}</option>
                      <option value="inactive">{t('inactive')}</option>
                      <option value="sold">{t('sold')}</option>
                      <option value="draft">{t('draft')}</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Package size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('noProductsFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? t('tryAdjustingSearch')
                : t('getStartedByAdding')
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button 
                onClick={() => router.push('/seller-dashboard/add-product')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus size={20} className="mr-2" />
                {t('addYourFirstProduct')}
              </button>
            )}
          </div>
        )}
      </div>
  );
}

export default function ListingsPage() {
  return (
    <DashboardProvider>
      <DashboardLanguageProvider>
        <SellerDashboardLayout>
          <ListingsContent />
        </SellerDashboardLayout>
      </DashboardLanguageProvider>
    </DashboardProvider>
  );
}
