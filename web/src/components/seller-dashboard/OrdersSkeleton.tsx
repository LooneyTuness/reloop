'use client';

import React from 'react';

export default function OrdersSkeleton() {
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

        {/* Orders grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* Order header */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>

              {/* Product info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>

              {/* Order details */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
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
