'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CategoryFilter as CategoryFilterType } from '@/types/category';

interface CatalogItem {
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
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CatalogState {
  // Data state
  items: CatalogItem[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  
  // Filter state
  filters: CategoryFilterType;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  selectedCategory: string | null;
  
  // Actions
  setItems: (items: CatalogItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: PaginationState) => void;
  setFilters: (filters: CategoryFilterType) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setViewMode: (viewMode: 'grid' | 'list') => void;
  setSelectedCategory: (categoryId: string | null) => void;
  clearFilters: () => void;
  updatePagination: (updates: Partial<PaginationState>) => void;
}

const CatalogStateContext = createContext<CatalogState | undefined>(undefined);

export function useCatalogState() {
  const context = useContext(CatalogStateContext);
  if (context === undefined) {
    throw new Error('useCatalogState must be used within a CatalogStateProvider');
  }
  return context;
}

interface CatalogStateProviderProps {
  children: ReactNode;
  initialFilters?: CategoryFilterType;
  initialCategory?: string | null;
}

export function CatalogStateProvider({ 
  children, 
  initialFilters = {},
  initialCategory = null 
}: CatalogStateProviderProps) {
  // Data state
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Filter state
  const [filters, setFilters] = useState<CategoryFilterType>(() => {
    // Try to restore filters from localStorage on initial load
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('catalog-filters');
        return saved ? JSON.parse(saved) : initialFilters;
      } catch {
        return initialFilters;
      }
    }
    return initialFilters;
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

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

  const updatePagination = useCallback((updates: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('catalog-filters');
    }
  }, []);

  const value: CatalogState = {
    // Data state
    items,
    loading,
    error,
    pagination,
    
    // Filter state
    filters,
    sortBy,
    sortOrder,
    viewMode,
    selectedCategory,
    
    // Actions
    setItems,
    setLoading,
    setError,
    setPagination,
    setFilters,
    setSortBy,
    setSortOrder,
    setViewMode,
    setSelectedCategory,
    clearFilters,
    updatePagination,
  };

  return (
    <CatalogStateContext.Provider value={value}>
      {children}
    </CatalogStateContext.Provider>
  );
}
