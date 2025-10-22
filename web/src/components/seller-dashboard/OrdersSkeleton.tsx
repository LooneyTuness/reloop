'use client';

import React from 'react';
import BackButton from './BackButton';

export default function OrdersSkeleton() {
  return (
    <div className="w-full py-4 sm:py-8 max-w-none">
      {/* Header */}
      <div className="px-3 sm:px-6 mb-8">
        <BackButton className="mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
      </div>

      {/* Filters and Search */}
      <div className="px-3 sm:px-6 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Orders Table Skeleton */}
      <div className="w-full bg-white dark:bg-gray-800 shadow-sm border-t border-b border-gray-200 dark:border-gray-700 overflow-hidden -mx-3 sm:-mx-6 lg:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                </th>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                </th>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                </th>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                </th>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                </th>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                </th>
                <th className="pl-6 pr-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  <td className="pl-6 pr-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                  </td>
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    </div>
                  </td>
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="pl-6 pr-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}