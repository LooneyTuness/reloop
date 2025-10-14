'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryProvider, useCategory } from '@/contexts/CategoryContext';
import CategoryNavigation from '@/components/category/CategoryNavigation';
import CategoryFilter from '@/components/category/CategoryFilter';
import CategoryBreadcrumbs from '@/components/category/CategoryBreadcrumbs';
import { CategoryHierarchy, CategoryFilter as CategoryFilterType } from '@/types/category';
import { CategoryService } from '@/lib/services/categoryService';
import { ChevronLeft, ChevronRight, Grid, Layout, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from '@/components/ProductImage';

function CatalogContent() {
  const searchParams = useSearchParams();
  const { categories, buildCategoryPath, getCategoryBySlug } = useCategory();
  const { t, translateCategory } = useLanguage();
  
  const [items, setItems] = useState<Array<{
    id: string;
    name?: string;
    title?: string;
    photos?: string[] | string;
    price: number;
    condition?: string;
    brand?: string;
    size?: string;
    description?: string;
    seller_name?: string;
    seller?: string;
    seller_profiles?: {
      business_name?: string;
      full_name?: string;
    } | null;
    old_price?: number;
    is_eco?: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<CategoryFilterType>(() => {
    // Try to restore filters from localStorage on initial load
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('catalog-filters');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<CategoryHierarchy | null>(null);

  // Get category from URL
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    console.log('Category useEffect running:', { categorySlug, categoriesLength: categories.length });
    if (categorySlug && categories.length > 0) {
      const category = getCategoryBySlug(categorySlug);
      setSelectedCategory(category || null);
      if (category) {
        // Only set category-based filters if no manual filters have been applied
        setFilters(prevFilters => {
          console.log('Setting filters, prevFilters:', prevFilters);
          // If there are already manual filters applied, don't override them
          if (prevFilters.brand || Object.keys(prevFilters).length > 0) {
            console.log('Keeping existing filters');
            return prevFilters;
          }
          // Check if there are saved filters in localStorage
          if (typeof window !== 'undefined') {
            try {
              const saved = localStorage.getItem('catalog-filters');
              if (saved) {
                const savedFilters = JSON.parse(saved);
                if (Object.keys(savedFilters).length > 0) {
                  console.log('Restoring saved filters from localStorage');
                  return savedFilters;
                }
              }
            } catch (error) {
              console.warn('Failed to restore filters from localStorage:', error);
            }
          }
          // Otherwise, set the category-based filters
          console.log('Setting category-based filters');
          return {
            mainCategory: category.level === 0 ? category.id : undefined,
            subcategory: category.level === 1 ? category.id : undefined,
            type: category.level === 2 ? category.id : undefined,
          };
        });
      }
    } else {
      setSelectedCategory(null);
      // Only reset filters if we're not on a specific category page
      if (!categorySlug) {
        console.log('Resetting filters - no category slug');
        setFilters({});
      }
    }
  }, [categorySlug, categories, getCategoryBySlug]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      if (selectedCategory) {
        // Fetch items by specific category
        response = await CategoryService.getItemsByCategory(selectedCategory.id, {
          page: pagination.page,
          limit: pagination.limit,
          sortBy,
          sortOrder,
          brand: filters.brand,
        });
      } else {
        // Fetch all items using the general items API
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        // Add all filter properties
        if (filters.brand) {
          params.append('brand', filters.brand);
        }
        if (filters.mainCategory) {
          params.append('mainCategory', filters.mainCategory);
        }
        if (filters.subcategory) {
          params.append('subcategory', filters.subcategory);
        }
        if (filters.type) {
          params.append('type', filters.type);
        }

        const itemsResponse = await fetch(`/api/items?${params}`);
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch items');
        }
        response = await itemsResponse.json();
      }

      console.log('API Response items:', response.items);
      if (response.items && response.items.length > 0) {
        console.log('First item seller_profiles:', response.items[0].seller_profiles);
        console.log('First item seller field:', response.items[0].seller);
      }
      setItems(response.items);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, pagination.page, pagination.limit, sortBy, sortOrder, filters]);

  // Fetch items when filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Debug: Track when filters change
  useEffect(() => {
    console.log('Filters changed:', filters);
  }, [filters]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('catalog-filters', JSON.stringify(filters));
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error);
      }
    }
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: CategoryFilterType) => {
    console.log('Filter changed in catalog page:', newFilters);
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const clearAllFilters = () => {
    setFilters({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('catalog-filters');
    }
  };

  // Removed unused handleSortChange function

  const breadcrumbs = selectedCategory ? buildCategoryPath(selectedCategory.id) : [];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Breadcrumbs positioned below navbar */}
      {breadcrumbs.length > 0 && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <CategoryBreadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-6 sm:pb-8 overflow-x-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedCategory ? translateCategory(selectedCategory.name) : t('allProducts')}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 relative overflow-visible">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('categories')}
              </h2>
              <CategoryNavigation
                onCategorySelect={useCallback((category: CategoryHierarchy | null) => {
                  console.log('CategoryNavigation onCategorySelect called:', category);
                  console.trace('CategoryNavigation call stack');
                  if (category) {
                    setSelectedCategory(category);
                    setFilters(prevFilters => {
                      console.log('CategoryNavigation setting filters, prevFilters:', prevFilters);
                      // If there are already manual filters applied, don't override them
                      if (prevFilters.brand || Object.keys(prevFilters).length > 0) {
                        console.log('CategoryNavigation keeping existing filters');
                        return prevFilters;
                      }
                      // Otherwise, set the category-based filters
                      console.log('CategoryNavigation setting category-based filters');
                      return {
                        mainCategory: category.level === 0 ? category.id : undefined,
                        subcategory: category.level === 1 ? category.id : undefined,
                        type: category.level === 2 ? category.id : undefined,
                      };
                    });
                  } else {
                    setSelectedCategory(null);
                    // Only reset filters if we're not on a specific category page
                    if (!categorySlug) {
                      console.log('CategoryNavigation resetting filters - no category');
                      setFilters({});
                    }
                  }
                }, [categorySlug])}
              />
            </div>

            {/* Filters */}
            <div className="mt-6 bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 relative min-h-fit overflow-visible">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('filters')}
              </h3>
              <CategoryFilter
                onFilterChange={handleFilterChange}
                currentFilter={filters}
                showApplyButton={true}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-x-hidden">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pagination.total} products found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder as 'asc' | 'desc');
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-200 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <Layout size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Items Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchItems}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  Try Again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No products found in this category.
                </p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className={`group bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className="relative overflow-hidden">
                        <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} relative`}>
                          {/* Image */}
                          <ProductImage
                            src={item.photos}
                            alt={item.name || item.title || 'Product'}
                            className="object-cover"
                            fallbackText={t("noImage")}
                          />

                          {/* Eco Badge */}
                          {item.is_eco && (
                            <div className="absolute top-3 left-3">
                              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span>♻</span>
                                <span>{t("ecoChoice")}</span>
                              </div>
                            </div>
                          )}

                          {/* View Button */}
                          <div className="absolute top-3 right-3">
                            <Link
                              href={`/products/${item.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="w-10 h-10 bg-white/90/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-lg"
                              title={t("viewProduct")}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      <div className={`p-6 ${
                        viewMode === 'list' ? 'flex-1' : ''
                      }`}>
                        {/* Title and Description */}
                        <div className="mb-4">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item.name || item.title}
                          </h3>
                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Attributes */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-semibold">
                            {t("condition")}: {item.condition || t("Used")}
                          </div>
                          {item.size && (
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-semibold">
                              {t("size")}: {item.size}
                            </div>
                          )}
                          {item.brand && (
                            <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-semibold">
                              {item.brand}
                            </div>
                          )}
                        </div>

                        {/* Price and Seller */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              {item.price} {t("currency")}
                            </span>
                            {item.old_price && (
                              <span className="text-gray-400 line-through text-sm ml-2">
                                {item.old_price} {t("currency")}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t("seller")}: {item.seller_profiles?.business_name || item.seller_profiles?.full_name || item.seller || t("anonymousSeller")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-2 border rounded-xl ${
                          pagination.page === i + 1
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'border-gray-200 bg-white text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <CategoryProvider>
      <CatalogContent />
    </CategoryProvider>
  );
}
