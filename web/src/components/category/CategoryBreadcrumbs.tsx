'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { CategoryBreadcrumb } from '@/types/category';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryBreadcrumbsProps {
  breadcrumbs: CategoryBreadcrumb[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
}

export default function CategoryBreadcrumbs({
  breadcrumbs,
  className = '',
  showHome = true,
  homeHref = '/',
}: CategoryBreadcrumbsProps) {
  const { translateCategory } = useLanguage();
  
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            href={homeHref}
            className="text-gray-500 hover:text-gray-700text-gray-400hover:text-gray-200 transition-colors"
          >
            <Home size={16} />
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
        </>
      )}
      
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const href = `/catalog/${breadcrumb.slug}`;

        return (
          <React.Fragment key={breadcrumb.id}>
            {isLast ? (
              <span className="text-gray-900text-white font-medium">
                {translateCategory(breadcrumb.name)}
              </span>
            ) : (
              <Link
                href={href}
                className="text-gray-500 hover:text-gray-700text-gray-400hover:text-gray-200 transition-colors"
              >
                {translateCategory(breadcrumb.name)}
              </Link>
            )}
            
            {!isLast && (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Compact version for mobile
export function CategoryBreadcrumbsCompact({
  breadcrumbs,
  className = '',
  showHome = true,
  homeHref = '/',
}: CategoryBreadcrumbsProps) {
  const { translateCategory } = useLanguage();
  
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  // Show only the last 2 items on mobile
  const displayBreadcrumbs = breadcrumbs.length > 2 
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;

  return (
    <nav className={`flex items-center space-x-1 text-xs ${className}`} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            href={homeHref}
            className="text-gray-500 hover:text-gray-700text-gray-400hover:text-gray-200 transition-colors"
          >
            <Home size={14} />
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
        </>
      )}
      
      {breadcrumbs.length > 2 && (
        <>
          <span className="text-gray-500">...</span>
          <ChevronRight size={14} className="text-gray-400" />
        </>
      )}
      
      {displayBreadcrumbs.map((breadcrumb, index) => {
        const isLast = index === displayBreadcrumbs.length - 1;
        const href = `/catalog/${breadcrumb.slug}`;

        return (
          <React.Fragment key={breadcrumb.id}>
            {isLast ? (
              <span className="text-gray-900text-white font-medium">
                {translateCategory(breadcrumb.name)}
              </span>
            ) : (
              <Link
                href={href}
                className="text-gray-500 hover:text-gray-700text-gray-400hover:text-gray-200 transition-colors"
              >
                {translateCategory(breadcrumb.name)}
              </Link>
            )}
            
            {!isLast && (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Simple text version without links
export function CategoryBreadcrumbsText({
  breadcrumbs,
  className = '',
  separator = ' > ',
}: {
  breadcrumbs: CategoryBreadcrumb[];
  className?: string;
  separator?: string;
}) {
  const { translateCategory } = useLanguage();
  
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className={`text-sm text-gray-600text-gray-400 ${className}`}>
      {breadcrumbs.map(breadcrumb => translateCategory(breadcrumb.name)).join(separator)}
    </div>
  );
}
