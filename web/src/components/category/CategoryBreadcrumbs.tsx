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
  variant?: 'default' | 'minimal' | 'compact';
}

export default function CategoryBreadcrumbs({
  breadcrumbs,
  className = '',
  showHome = true,
  homeHref = '/',
  variant = 'default',
}: CategoryBreadcrumbsProps) {
  const { translateCategory } = useLanguage();
  
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  // Get level-based styling for each breadcrumb
  const getBreadcrumbStyle = (breadcrumb: CategoryBreadcrumb, isLast: boolean) => {
    const baseClasses = "transition-colors duration-200";
    
    if (isLast) {
      return `${baseClasses} text-gray-900 dark:text-white font-semibold`;
    }
    
    // Level-based styling for better hierarchy
    switch (breadcrumb.level) {
      case 0: // Main category
        return `${baseClasses} text-gray-600 dark:text-gray-300 font-medium hover:text-gray-800 dark:hover:text-gray-100`;
      case 1: // Subcategory
        return `${baseClasses} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200`;
      case 2: // Type
        return `${baseClasses} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300`;
      default:
        return `${baseClasses} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200`;
    }
  };

  // Get separator style based on variant
  const getSeparatorStyle = () => {
    switch (variant) {
      case 'minimal':
        return "text-gray-300 dark:text-gray-600";
      case 'compact':
        return "text-gray-300 dark:text-gray-600";
      default:
        return "text-gray-400 dark:text-gray-500";
    }
  };

  // Get icon size based on variant
  const getIconSize = () => {
    switch (variant) {
      case 'minimal':
        return 14;
      case 'compact':
        return 12;
      default:
        return 16;
    }
  };

  const iconSize = getIconSize();
  const separatorStyle = getSeparatorStyle();

  return (
    <nav className={`flex items-center ${variant === 'compact' ? 'space-x-0.5' : 'space-x-1'} ${variant === 'minimal' ? 'text-xs' : 'text-sm'} ${className}`} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            href={homeHref}
            className={`${variant === 'minimal' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-700'} dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
            title="Home"
          >
            <Home size={iconSize} />
          </Link>
          <ChevronRight size={iconSize} className={separatorStyle} />
        </>
      )}
      
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const href = `/catalog/${breadcrumb.slug}`;
        const translatedName = translateCategory(breadcrumb.name);
        const breadcrumbStyle = getBreadcrumbStyle(breadcrumb, isLast);

        return (
          <React.Fragment key={breadcrumb.id}>
            {isLast ? (
              <span className={breadcrumbStyle} title={translatedName}>
                {translatedName}
              </span>
            ) : (
              <Link
                href={href}
                className={breadcrumbStyle}
                title={translatedName}
              >
                {translatedName}
              </Link>
            )}
            
            {!isLast && (
              <ChevronRight size={iconSize} className={separatorStyle} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Compact version for mobile - now uses the enhanced design
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

  // Show only the last 2 items on mobile for better space usage
  const displayBreadcrumbs = breadcrumbs.length > 2 
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;

  return (
    <nav className={`flex items-center space-x-0.5 text-xs ${className}`} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            href={homeHref}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            title="Home"
          >
            <Home size={12} />
          </Link>
          <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
        </>
      )}
      
      {breadcrumbs.length > 2 && (
        <>
          <span className="text-gray-400 dark:text-gray-500">...</span>
          <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
        </>
      )}
      
      {displayBreadcrumbs.map((breadcrumb, index) => {
        const isLast = index === displayBreadcrumbs.length - 1;
        const href = `/catalog/${breadcrumb.slug}`;
        const translatedName = translateCategory(breadcrumb.name);

        // Level-based styling for compact view
        const getBreadcrumbStyle = () => {
          const baseClasses = "transition-colors duration-200";
          
          if (isLast) {
            return `${baseClasses} text-gray-900 dark:text-white font-semibold`;
          }
          
          switch (breadcrumb.level) {
            case 0: // Main category
              return `${baseClasses} text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200`;
            case 1: // Subcategory
              return `${baseClasses} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300`;
            case 2: // Type
              return `${baseClasses} text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400`;
            default:
              return `${baseClasses} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300`;
          }
        };

        return (
          <React.Fragment key={breadcrumb.id}>
            {isLast ? (
              <span className={getBreadcrumbStyle()} title={translatedName}>
                {translatedName}
              </span>
            ) : (
              <Link
                href={href}
                className={getBreadcrumbStyle()}
                title={translatedName}
              >
                {translatedName}
              </Link>
            )}
            
            {!isLast && (
              <ChevronRight size={12} className="text-gray-300 dark:text-gray-600" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Simple text version without links - enhanced with level-based styling
export function CategoryBreadcrumbsText({
  breadcrumbs,
  className = '',
  separator = ' > ',
  showLevels = true,
}: {
  breadcrumbs: CategoryBreadcrumb[];
  className?: string;
  separator?: string;
  showLevels?: boolean;
}) {
  const { translateCategory } = useLanguage();
  
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  if (!showLevels) {
    return (
      <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
        {breadcrumbs.map(breadcrumb => translateCategory(breadcrumb.name)).join(separator)}
      </div>
    );
  }

  return (
    <div className={`text-sm ${className}`}>
      {breadcrumbs.map((breadcrumb, index) => {
        const translatedName = translateCategory(breadcrumb.name);
        const isLast = index === breadcrumbs.length - 1;
        
        // Level-based styling for text version
        const getTextStyle = () => {
          if (isLast) {
            return "text-gray-900 dark:text-white font-semibold";
          }
          
          switch (breadcrumb.level) {
            case 0: // Main category
              return "text-gray-600 dark:text-gray-300 font-medium";
            case 1: // Subcategory
              return "text-gray-500 dark:text-gray-400";
            case 2: // Type
              return "text-gray-400 dark:text-gray-500";
            default:
              return "text-gray-500 dark:text-gray-400";
          }
        };

        return (
          <span key={breadcrumb.id} className={getTextStyle()}>
            {translatedName}
            {!isLast && <span className="text-gray-300 dark:text-gray-600">{separator}</span>}
          </span>
        );
      })}
    </div>
  );
}
