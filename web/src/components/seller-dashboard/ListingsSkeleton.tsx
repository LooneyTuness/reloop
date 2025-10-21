'use client';

import React from 'react';

export default function ListingsSkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>

        {/* Search and filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Product image */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              
              {/* Product info */}
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                
                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>

                {/* Status */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3"></div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center mt-8 space-x-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
}
