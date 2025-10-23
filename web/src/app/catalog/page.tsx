'use client';

import React, { useEffect, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryProvider, useCategory } from '@/contexts/CategoryContext';
import { CatalogStateProvider, useCatalogState } from '@/contexts/CatalogStateContext';
import { useDropdownState } from '@/contexts/DropdownStateContext';
import CategoryNavigation from '@/components/category/CategoryNavigation';
import CategoryFilter from '@/components/category/CategoryFilter';
import CategoryBreadcrumbs from '@/components/category/CategoryBreadcrumbs';
import { CategoryWithChildren, CategoryFilter as CategoryFilterType } from '@/types/category';
import { ChevronLeft, ChevronRight, Grid, Layout, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from '@/components/ProductImage';
import { useCatalogItems, usePrefetchCatalogItems } from '@/hooks/useCatalogItems';

function CatalogContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { categories, buildCategoryPath, getCategoryBySlug, getCategoryById } = useCategory();
  const { t, translateCategory } = useLanguage();
  const {
    pagination,
    filters,
    sortBy,
    sortOrder,
    viewMode,
    selectedCategory,
    setPagination,
    setFilters,
    setSortBy,
    setSortOrder,
    setViewMode,
    setSelectedCategory,
    updatePagination
  } = useCatalogState();
  const { setIsMainCategoryOpen } = useDropdownState();
  const prefetchCatalogItems = usePrefetchCatalogItems();

  // Get category from URL
  const categorySlug = searchParams.get('category');

  // Use React Query for data fetching
  const {
    data: catalogData,
    isLoading: loading,
    error,
    isFetching,
  } = useCatalogItems({
    selectedCategory,
    filters,
    sortBy,
    sortOrder,
    page: pagination.page,
    limit: pagination.limit,
  });

  // Extract data from React Query response
  const items = catalogData?.items || [];
  const paginationData = catalogData?.pagination || pagination;

  // Auto-open dropdown when navigating to category pages
  useEffect(() => {
    if (pathname.startsWith('/catalog/') && pathname !== '/catalog') {
      console.log('Navigating to category page, opening dropdown');
      // Small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setIsMainCategoryOpen(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, setIsMainCategoryOpen]);

  useEffect(() => {
    console.log('Category useEffect running:', { categorySlug, categoriesLength: categories.length });
    if (categorySlug && categories.length > 0) {
      // First try to find by slug
      let category = getCategoryBySlug(categorySlug);
      
      // If not found by slug, try to find by name
      if (!category) {
        category = categories.find(c => 
          c.name.toLowerCase() === categorySlug.toLowerCase() ||
          c.name.toLowerCase().includes(categorySlug.toLowerCase())
        );
      }
      
      setSelectedCategory(category?.id || null);
      if (category) {
        // Check if there are saved filters in localStorage
        let newFilters: CategoryFilterType = {};
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('catalog-filters');
            if (saved) {
              const savedFilters = JSON.parse(saved);
              if (Object.keys(savedFilters).length > 0) {
                console.log('Restoring saved filters from localStorage');
                newFilters = savedFilters;
              }
            }
          } catch (error) {
            console.warn('Failed to restore filters from localStorage:', error);
          }
        }
        
        // If no saved filters, set the category-based filters
        if (Object.keys(newFilters).length === 0) {
          console.log('Setting category-based filters');
          newFilters = {
            mainCategory: category.level === 0 ? category.id : undefined,
            subcategory: category.level === 1 ? category.id : undefined,
            type: category.level === 2 ? category.id : undefined,
          };
        }
        
        setFilters(newFilters);
      }
    } else {
      setSelectedCategory(null);
      // Only reset filters if we're not on a specific category page
      if (!categorySlug) {
        console.log('Resetting filters - no category slug');
        setFilters({});
      }
    }
  }, [categorySlug, categories, getCategoryBySlug, setSelectedCategory, setFilters]);

  // Update pagination when React Query data changes
  useEffect(() => {
    if (catalogData?.pagination) {
      setPagination(catalogData.pagination);
    }
  }, [catalogData?.pagination, setPagination]);

  // Debug: Track when filters change
  useEffect(() => {
    console.log('Filters changed:', filters);
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: CategoryFilterType) => {
    console.log('Filter changed in catalog page:', newFilters);
    setFilters(newFilters);
    updatePagination({ page: 1 });
  }, [setFilters, updatePagination]);

  // Handle immediate selection changes (for seamless UX)
  const handleImmediateFilterChange = useCallback((newFilters: CategoryFilterType) => {
    setFilters(newFilters);
    updatePagination({ page: 1 });
    
    // Prefetch the next likely filter combination for better UX
    if (newFilters.mainCategory && !newFilters.subcategory) {
      // Prefetch subcategories for the selected main category
      prefetchCatalogItems({
        selectedCategory: newFilters.mainCategory,
        filters: newFilters,
        sortBy,
        sortOrder,
        page: 1,
        limit: pagination.limit,
      });
    }
  }, [setFilters, updatePagination, prefetchCatalogItems, sortBy, sortOrder, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    updatePagination({ page: newPage });
  };

  // Removed unused handleSortChange function

  const breadcrumbs = selectedCategory ? buildCategoryPath(selectedCategory) : [];


  return (
    <div className="min-h-screen bg-white overflow-x-hidden scrollbar-hide">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-x-hidden min-h-screen">
        {/* Breadcrumbs in main content area */}
        {breadcrumbs.length > 0 && (
          <div className="mb-6 relative z-10">
            <CategoryBreadcrumbs 
              breadcrumbs={breadcrumbs} 
              variant="default"
            />
          </div>
        )}
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedCategory ? translateCategory(getCategoryById(selectedCategory)?.name || selectedCategory) : t('allProducts')}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0 relative overflow-visible scrollbar-hide mb-6 lg:sticky lg:top-4">
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-4 mb-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                {t('categories')}
              </h2>
              <CategoryNavigation
                onCategorySelect={useCallback((category: CategoryWithChildren | null) => {
                  console.log('CategoryNavigation onCategorySelect called:', category);
                  console.trace('CategoryNavigation call stack');
                  if (category) {
                    setSelectedCategory(category.id);
                    console.log('CategoryNavigation setting filters, current filters:', filters);
                    // If there are already manual filters applied, don't override them
                    if (filters.brand || Object.keys(filters).length > 0) {
                      console.log('CategoryNavigation keeping existing filters');
                    } else {
                      // Otherwise, set the category-based filters
                      console.log('CategoryNavigation setting category-based filters');
                      setFilters({
                        mainCategory: category.level === 0 ? category.id : undefined,
                        subcategory: category.level === 1 ? category.id : undefined,
                        type: category.level === 2 ? category.id : undefined,
                      });
                    }
                  } else {
                    setSelectedCategory(null);
                    // Only reset filters if we're not on a specific category page
                    if (!categorySlug) {
                      console.log('CategoryNavigation resetting filters - no category');
                      setFilters({});
                    }
                  }
                }, [categorySlug, setSelectedCategory, setFilters, filters])}
              />
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-4 relative overflow-visible pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                {t('filters')}
              </h3>
              <CategoryFilter
                onFilterChange={handleFilterChange}
                onSelectionChange={handleImmediateFilterChange}
                currentFilter={filters}
                showApplyButton={true}
                keepDropdownsOpen={true}
                selectedCategory={selectedCategory}
                selectedSubcategory={filters.subcategory}
                selectedType={filters.type}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-x-hidden relative pl-0 lg:pl-4 pr-4 scrollbar-hide">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {paginationData.total} products found
                  {isFetching && !loading && (
                    <span className="ml-2 text-orange-500">(updating...)</span>
                  )}
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
                  className="px-3 py-2 border border-gray-100 rounded-md bg-gray-50 text-sm"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-100 rounded-md bg-gray-50">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
                <p className="text-red-500 mb-4">{error.message || 'Failed to fetch items'}</p>
                <button
                  onClick={() => window.location.reload()}
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
                {/* Background loading indicator */}
                {isFetching && !loading && (
                  <div className="absolute top-0 right-0 z-10 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                    Updating...
                  </div>
                )}
                
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className="relative overflow-hidden">
                        <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} relative`}>
                          {/* Image */}
                          <ProductImage
                            src={item.images}
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/products/${item.id}`);
                              }}
                              className="w-10 h-10 bg-white/90/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-lg"
                              title={t("viewProduct")}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
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
                            {t("condition")}: {t(item.condition) || t("Used")}
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            item.size 
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : "bg-gray-50 dark:bg-gray-800/20 text-gray-500 dark:text-gray-400"
                          }`}>
                            {t("size")}: {item.size || t("notSpecified")}
                          </div>
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
                {paginationData.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => handlePageChange(paginationData.page - 1)}
                      disabled={!paginationData.hasPrev}
                      className="px-3 py-2 border border-gray-100 rounded-xl bg-gray-50 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {[...Array(paginationData.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-2 border rounded-xl ${
                          paginationData.page === i + 1
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'border-gray-100 bg-gray-50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(paginationData.page + 1)}
                      disabled={!paginationData.hasNext}
                      className="px-3 py-2 border border-gray-100 rounded-xl bg-gray-50 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <CatalogStateProvider>
        <CatalogContent />
      </CatalogStateProvider>
    </CategoryProvider>
  );
}
