'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

// Loading skeleton component
const PageSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface LazyPageWrapperProps {
  pageComponent: ComponentType<any>;
  fallback?: React.ComponentType;
}

export default function LazyPageWrapper({ 
  pageComponent: PageComponent, 
  fallback: Fallback = PageSkeleton 
}: LazyPageWrapperProps) {
  return (
    <Suspense fallback={<Fallback />}>
      <PageComponent />
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
