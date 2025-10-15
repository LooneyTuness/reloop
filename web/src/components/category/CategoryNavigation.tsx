'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCategory } from '@/contexts/CategoryContext';
import { useDropdownState } from '@/contexts/DropdownStateContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryWithChildren } from '@/types/category';

interface CategoryNavigationProps {
  className?: string;
  onCategorySelect?: (category: CategoryWithChildren | null) => void;
  showAllCategories?: boolean;
}

export default function CategoryNavigation({
  className = '',
  onCategorySelect,
  showAllCategories = true,
}: CategoryNavigationProps) {
  const { categoryTree, loading, error } = useCategory();
  const { t, translateCategory } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (category: CategoryWithChildren, event?: React.MouseEvent) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }

    // Call the callback first
    if (onCategorySelect) {
      onCategorySelect(category);
    }

    // Update URL based on current page
    if (pathname === '/catalog') {
      // If we're on the main catalog page, update query parameters
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', category.slug);
      router.push(`/catalog?${params.toString()}`);
    } else {
      // If we're on a different page, navigate to the category page
      router.push(`/catalog/${category.slug}`);
    }
  };

  const handleAllCategoriesClick = (event?: React.MouseEvent) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }

    // Call the callback first
    if (onCategorySelect) {
      onCategorySelect(null);
    }

    // Navigate to main catalog page
    router.push('/catalog');
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        Error loading categories: {error}
      </div>
    );
  }

  if (!categoryTree) {
    return null;
  }

  const renderCategoryItem = (category: CategoryWithChildren, level: number = 0) => {
    const hasChildren = categoryTree.subcategories[category.id]?.length > 0 || 
                       categoryTree.types[category.id]?.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const indentClass = level > 0 ? `ml-${level * 4}` : '';

    return (
      <div key={category.id} className={`${indentClass}`}>
        <div className="flex items-center">
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <Link
            href={`/catalog/${category.slug}`}
            onClick={(e) => handleCategoryClick(category, e)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
              level === 0 
                ? 'text-gray-900 font-semibold' 
                : 'text-gray-700'
            }`}
          >
            {translateCategory(category.name)}
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {/* Render subcategories */}
            {categoryTree.subcategories[category.id]?.map(subcategory =>
              renderCategoryItem(subcategory, level + 1)
            )}
            
            {/* Render types */}
            {categoryTree.types[category.id]?.map(type =>
              renderCategoryItem(type, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {showAllCategories && (
        <Link
          href="/catalog"
          onClick={(e) => handleAllCategoriesClick(e)}
          className="block py-2 px-3 rounded-md text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
        >
          {t("allCategories")}
        </Link>
      )}
      
      {categoryTree.mainCategories.map(category =>
        renderCategoryItem(category, 0)
      )}
    </nav>
  );
}

// Compact version for mobile/sidebar
export function CategoryNavigationCompact({
  className = '',
  onCategorySelect,
}: Omit<CategoryNavigationProps, 'showAllCategories'>) {
  const { categoryTree, loading, error } = useCategory();
  const { translateCategory } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: CategoryWithChildren, event?: React.MouseEvent) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }

    // Call the callback first
    if (onCategorySelect) {
      onCategorySelect(category);
    }

    // Update URL based on current page
    if (pathname === '/catalog') {
      // If we're on the main catalog page, update query parameters
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', category.slug);
      router.push(`/catalog?${params.toString()}`);
    } else {
      // If we're on a different page, navigate to the category page
      router.push(`/catalog/${category.slug}`);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-1 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error || !categoryTree) {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {categoryTree.mainCategories.map(category => (
        <Link
          key={category.id}
          href={`/catalog/${category.slug}`}
          onClick={(e) => handleCategoryClick(category, e)}
          className="block py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {translateCategory(category.name)}
        </Link>
      ))}
    </div>
  );
}

// Dropdown version for header navigation
export function CategoryDropdown({
  className = '',
  onCategorySelect,
}: Omit<CategoryNavigationProps, 'showAllCategories'>) {
  const { categoryTree, loading, error } = useCategory();
  const { t, translateCategory } = useLanguage();
  const { isNavbarCategoryOpen, toggleNavbarCategory, closeNavbarDropdown } = useDropdownState();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: CategoryWithChildren, event?: React.MouseEvent) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }

    // Call the callback first
    if (onCategorySelect) {
      onCategorySelect(category);
    }

    // Update URL based on current page
    if (pathname === '/catalog') {
      // If we're on the main catalog page, update query parameters
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', category.slug);
      router.push(`/catalog?${params.toString()}`);
    } else {
      // If we're on a different page, navigate to the category page
      router.push(`/catalog/${category.slug}`);
    }

    // Close dropdown
    closeNavbarDropdown();
  };

  const handleAllCategoriesClick = (event?: React.MouseEvent) => {
    // Prevent default link behavior
    if (event) {
      event.preventDefault();
    }

    // Call the callback first
    if (onCategorySelect) {
      onCategorySelect(null);
    }

    // Navigate to main catalog page
    router.push('/catalog');

    // Close dropdown
    closeNavbarDropdown();
  };

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.category-dropdown-container')) {
        closeNavbarDropdown();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNavbarDropdown();
      }
    };

    if (isNavbarCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isNavbarCategoryOpen, closeNavbarDropdown]);

  if (loading || error || !categoryTree) {
    return null;
  }

  return (
    <div className={`relative category-dropdown-container ${className}`}>
      <button
        onClick={toggleNavbarCategory}
        className="flex items-center space-x-1 py-2 px-3 text-sm font-medium text-gray-800 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-white/30 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
      >
        {/* Hamburger icon for mobile, text for desktop */}
        <div className="md:hidden">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <span>{t("categories")}</span>
          <ChevronDown size={16} className={`transition-transform ${isNavbarCategoryOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isNavbarCategoryOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/30 dark:border-gray-700 z-50">
          <div className="py-2">
            <Link
              href="/catalog"
              onClick={(e) => handleAllCategoriesClick(e)}
              className="block py-2 px-4 text-sm font-semibold text-gray-900 hover:bg-white/20 transition-colors"
            >
              {t("allCategories")}
            </Link>
            
            {categoryTree.mainCategories.map(category => (
              <Link
                key={category.id}
                href={`/catalog/${category.slug}`}
                onClick={(e) => handleCategoryClick(category, e)}
                className="block py-2 px-4 text-sm text-gray-700 hover:bg-white/20 transition-colors"
              >
                {translateCategory(category.name)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
