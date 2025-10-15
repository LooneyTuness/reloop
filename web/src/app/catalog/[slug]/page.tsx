'use client';

import React, { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CategoryProvider, useCategory } from '@/contexts/CategoryContext';
import { CatalogStateProvider, useCatalogState } from '@/contexts/CatalogStateContext';
import CategoryNavigation from '@/components/category/CategoryNavigation';
import CategoryFilter from '@/components/category/CategoryFilter';
import CategoryBreadcrumbs from '@/components/category/CategoryBreadcrumbs';
import { CategoryFilter as CategoryFilterType } from '@/types/category';
import { CategoryService } from '@/lib/services/categoryService';

interface CatalogItem {
  id: string;
  name?: string;
  title?: string;
  images?: string[] | string;
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
  };
  old_price?: number;
}
import { ChevronLeft, ChevronRight, Grid, Layout } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from '@/components/ProductImage';

function CategoryPageContent() {
  const params = useParams();
  const { categories, getCategoryBySlug, buildCategoryPath } = useCategory();
  const { t, translateCategory } = useLanguage();
  const {
    items,
    loading,
    error,
    pagination,
    filters,
    sortBy,
    sortOrder,
    viewMode,
    selectedCategory,
    setItems,
    setLoading,
    setError,
    setPagination,
    setFilters,
    setSortBy,
    setSortOrder,
    setViewMode,
    setSelectedCategory,
    updatePagination
  } = useCatalogState();

  const categorySlug = params.slug as string;

  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = getCategoryBySlug(categorySlug);
      if (category) {
        setSelectedCategory(category.id);
        setFilters({
          mainCategory: category.level === 0 ? category.id : undefined,
          subcategory: category.level === 1 ? category.id : undefined,
          type: category.level === 2 ? category.id : undefined,
        });
      } else {
        setError('Category not found');
        setLoading(false);
      }
    }
  }, [categorySlug, categories, getCategoryBySlug, setSelectedCategory, setFilters, setError, setLoading]);

  const fetchItems = useCallback(async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      setError(null);

      const response = await CategoryService.getItemsByCategory(selectedCategory, {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        brand: filters.brand,
      });

      setItems(response.items as CatalogItem[]);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
        hasNext: response.pagination.hasNext,
        hasPrev: response.pagination.hasPrev,
      });
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, pagination.page, pagination.limit, sortBy, sortOrder, filters, setLoading, setError, setItems, setPagination]);

  // Fetch items when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchItems();
    }
  }, [selectedCategory, pagination.page, sortBy, sortOrder, fetchItems]);

  const handleFilterChange = (newFilters: CategoryFilterType) => {
    console.log('Filter changed in [slug] page:', newFilters);
    setFilters(newFilters);
    updatePagination({ page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updatePagination({ page: newPage });
  };

  // const handleSortChange = (newSortBy: string) => {
  //   setSortBy(newSortBy);
  //   setPagination(prev => ({ ...prev, page: 1 }));
  // };

  const breadcrumbs = selectedCategory ? buildCategoryPath(selectedCategory) : [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <a
            href="/catalog"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse All Categories
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-6 sm:pb-8">
        {/* Breadcrumbs in main content area */}
        {breadcrumbs.length > 0 && (
          <div className="mb-6">
            <CategoryBreadcrumbs 
              breadcrumbs={breadcrumbs} 
              variant="default"
            />
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedCategory ? translateCategory(getCategoryBySlug(categorySlug)?.name || '') : 'Loading...'}
          </h1>

          {getCategoryBySlug(categorySlug)?.description && (
            <p className="mt-4 text-gray-600">
              {translateCategory(getCategoryBySlug(categorySlug)?.description || '')}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 overflow-visible">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('categories')}
              </h2>
              <CategoryNavigation
                onCategorySelect={(category) => {
                  if (category) {
                    setSelectedCategory(category.id);
                    setFilters({
                      mainCategory: category.level === 0 ? category.id : undefined,
                      subcategory: category.level === 1 ? category.id : undefined,
                      type: category.level === 2 ? category.id : undefined,
                    });
                  } else {
                    setSelectedCategory(null);
                    setFilters({});
                  }
                }}
              />
            </div>

            {/* Filters */}
            <div className="mt-6 bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 min-h-fit overflow-visible">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('filters')}
              </h3>
              <CategoryFilter
                onFilterChange={handleFilterChange}
                currentFilter={filters}
                showApplyButton={true}
                selectedCategory={selectedCategory}
                selectedSubcategory={filters.subcategory}
                selectedType={filters.type}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
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
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
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
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
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
                      className={`group premium-product-card glass-morphism-strong rounded-3xl ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm">
                          <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} relative`}>
                            <ProductImage
                              src={item.images}
                              alt={item.name || item.title || 'Product'}
                              className="object-cover"
                              fallbackText={t("noImage")}
                            />
                          </div>

                        {/* Enhanced Eco Badge */}
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-white tracking-wide">
                              {t("ecoChoice")}
                            </span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart functionality here
                            }}
                            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-xl hover:bg-white/90 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-700 hover:text-slate-900 border border-white/40 shadow-2xl"
                            title={t("addToCart")}
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Luxury Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100"></div>

                        {/* Subtle Border Glow */}
                        <div className="absolute inset-0 rounded-t-3xl border border-white/20 opacity-0 group-hover:opacity-100"></div>
                      </div>

                      <div className={`space-y-2 sm:space-y-3 ${
                        viewMode === 'list' ? 'flex-1 p-4' : 'p-3 sm:p-4 lg:p-5'
                      }`}>
                        <div className="space-y-2 sm:space-y-3">
                          <h3 className="font-black text-gray-900 line-clamp-2 group-hover:text-emerald-500 leading-tight tracking-tight text-base sm:text-lg">
                            {(() => {
                              const title = item.name || item.title || 'Untitled Product';
                              // Basic validation to clean up gibberish titles
                              if (title.length < 3 || /^[^a-zA-Z0-9\s]+$/.test(title) || title.match(/[a-z]{10,}/)) {
                                return 'Product';
                              }
                              return title;
                            })()}
                          </h3>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-relaxed font-light">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Condition and Size Tags */}
                        <div className="flex flex-wrap gap-2">
                          <div className="inline-flex items-center bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-lg font-semibold text-emerald-700 shadow-sm px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                            <span className="tracking-wide">{t("condition")}: {item.condition || t("excellent")}</span>
                          </div>
                          {item.size && (
                            <div className="inline-flex items-center bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/60 rounded-lg font-semibold text-blue-700 shadow-sm px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                              <span className="tracking-wide">{t("size")}: {item.size}</span>
                            </div>
                          )}
                          {item.brand && (
                            <div className="inline-flex items-center bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/60 rounded-lg font-semibold text-purple-700 shadow-sm px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                              <span className="tracking-wide">{item.brand}</span>
                            </div>
                          )}
                        </div>

                        {/* Price Section */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-2 sm:pt-3">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-900 tracking-tight text-lg sm:text-xl">
                              {item.price} {t("currency")}
                            </span>
                            {item.old_price && (
                              <span className="text-gray-400 line-through text-sm">
                                {item.old_price} {t("currency")}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
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
                      className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-2 border rounded-md ${
                          pagination.page === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

export default function CategoryPage() {
  return (
    <CategoryProvider>
      <CatalogStateProvider>
        <CategoryPageContent />
      </CatalogStateProvider>
    </CategoryProvider>
  );
}
