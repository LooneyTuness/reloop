"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  performSearch: (query: string, type?: 'products' | 'orders' | 'all') => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string, type: 'products' | 'orders' | 'all' = 'all') => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      // Navigate to search page with query
      router.push(`/seller-dashboard/search?q=${encodeURIComponent(query.trim())}`);

      // Simulate search API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results - replace with actual search logic
      const mockResults = [
        {
          id: '1',
          type: 'product',
          title: 'Sample Product 1',
          description: 'This product matches your search query',
          url: '/seller-dashboard/listings',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'order',
          title: 'Order #12345',
          description: 'Recent order containing searched item',
          url: '/seller-dashboard/orders',
          timestamp: new Date().toISOString()
        }
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    
    // Remove search param from URL
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        performSearch,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
