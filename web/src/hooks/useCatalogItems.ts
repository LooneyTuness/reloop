'use client';

import { useQuery } from '@tanstack/react-query';
import { CategoryFilter as CategoryFilterType } from '@/types/category';

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
  } | null;
  old_price?: number;
  is_eco?: boolean;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CatalogResponse {
  items: CatalogItem[];
  pagination: PaginationState;
}

interface UseCatalogItemsParams {
  selectedCategory?: string | null;
  filters?: CategoryFilterType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  enabled?: boolean;
}

async function fetchCatalogItems(params: UseCatalogItemsParams): Promise<CatalogResponse> {
  const {
    selectedCategory,
    filters = {},
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  } = params;

  let response;
  
  if (selectedCategory) {
    // Use the category service for specific category items
    const { CategoryService } = await import('@/lib/services/categoryService');
    response = await CategoryService.getItemsByCategory(selectedCategory, {
      page,
      limit,
      sortBy,
      sortOrder,
      brand: filters.brand,
    });
  } else {
    // Use the general items API
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
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

  return response;
}

export function useCatalogItems({
  selectedCategory,
  filters = {},
  sortBy = 'created_at',
  sortOrder = 'desc',
  page = 1,
  limit = 20,
  enabled = true,
}: UseCatalogItemsParams) {
  return useQuery({
    queryKey: [
      'catalog-items',
      selectedCategory,
      filters,
      sortBy,
      sortOrder,
      page,
      limit,
    ],
    queryFn: () => fetchCatalogItems({
      selectedCategory,
      filters,
      sortBy,
      sortOrder,
      page,
      limit,
    }),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for prefetching catalog items (useful for optimistic updates)
export function usePrefetchCatalogItems() {
  const queryClient = useQueryClient();
  
  return (params: UseCatalogItemsParams) => {
    queryClient.prefetchQuery({
      queryKey: [
        'catalog-items',
        params.selectedCategory,
        params.filters,
        params.sortBy,
        params.sortOrder,
        params.page,
        params.limit,
      ],
      queryFn: () => fetchCatalogItems(params),
      staleTime: 2 * 60 * 1000,
    });
  };
}

// Import useQueryClient for the prefetch hook
import { useQueryClient } from '@tanstack/react-query';
