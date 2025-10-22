"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import { Search, Package, Eye } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'product' | 'activity';
  title: string;
  description?: string;
  url: string;
  date?: string;
  price?: string;
  status?: string;
  image?: string[] | null;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const { products, activities } = useDashboard();
  const { t } = useDashboardLanguage();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const query = searchParams.get('q') || '';

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Search in products
      const productResults = products
        .filter(product => 
          (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(product => ({
          id: product.id,
          type: 'product' as const,
          title: product.name || 'Untitled Product',
          description: product.description || 'No description available',
          price: product.price,
          status: product.status,
          image: product.images,
          url: `/seller-dashboard/listings`
        }));

      // Search in activities
      const activityResults = activities
        .filter(activity => 
          activity.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(activity => ({
          id: activity.id,
          type: 'activity' as const,
          title: activity.message,
          description: activity.timestamp,
          status: activity.status,
          url: `/seller-dashboard`
        }));

      setSearchResults([...productResults, ...activityResults]);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [products, activities]);

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query, handleSearch]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'activity':
        return <Eye className="h-5 w-5 text-green-600" />;
      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'activity':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {query ? `Results for "${query}"` : 'Enter a search term to find products and activities'}
        </p>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid gap-4">
            {searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className={`p-6 rounded-lg border ${getTypeColor(result.type)} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {result.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {result.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{result.type}</span>
                      {result.price && (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {result.price} {t("currency")}
                        </span>
                      )}
                      {result.status && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          result.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : result.status === 'sold'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {result.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try searching with different keywords or check your spelling.
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>Search tips:</p>
            <ul className="space-y-1">
              <li>• Use specific product names</li>
              <li>• Try partial words or phrases</li>
              <li>• Check for typos in your search</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start searching
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Use the search bar in the top navigation to find products and activities.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <SellerDashboardLayout>
      <DashboardProvider>
        <SearchContent />
      </DashboardProvider>
    </SellerDashboardLayout>
  );
}

