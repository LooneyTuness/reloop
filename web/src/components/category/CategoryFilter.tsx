'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCategory } from '@/contexts/CategoryContext';
import { useDropdownState } from '@/contexts/DropdownStateContext';
import { CategoryFilter as CategoryFilterType } from '@/types/category';
import { useBrands } from '@/hooks/useBrands';
import { ChevronDown, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryFilterProps {
  onFilterChange: (filter: CategoryFilterType) => void;
  currentFilter?: CategoryFilterType;
  className?: string;
  showSubcategories?: boolean;
  showTypes?: boolean;
  showBrandFilter?: boolean;
  showApplyButton?: boolean;
  keepDropdownsOpen?: boolean; // New prop to control dropdown behavior
  onSelectionChange?: (filter: CategoryFilterType) => void; // Callback for immediate selection changes
  // New props for category context
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  selectedType?: string | null;
}

export default function CategoryFilter({
  onFilterChange,
  currentFilter = {},
  className = '',
  showSubcategories = true,
  showTypes = true,
  showBrandFilter = true,
  showApplyButton = false,
  keepDropdownsOpen = false,
  onSelectionChange,
  selectedCategory = null,
  selectedSubcategory: selectedSubcategoryProp = null,
  selectedType: selectedTypeProp = null,
}: CategoryFilterProps) {
  const { categoryTree, loading } = useCategory();
  const { t, translateCategory } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    isMainCategoryOpen, 
    isSubcategoryOpen, 
    isTypeOpen, 
    isBrandOpen,
    setIsMainCategoryOpen,
    setIsSubcategoryOpen,
    setIsTypeOpen,
    setIsBrandOpen,
    closeAllDropdowns
  } = useDropdownState();
  
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(
    currentFilter.mainCategory || null
  );
  const [internalSelectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    currentFilter.subcategory || null
  );
  const [internalSelectedType, setSelectedType] = useState<string | null>(
    currentFilter.type || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    currentFilter.brand || null
  );
  
  // Pending filter state for Apply button functionality
  const [pendingMainCategory, setPendingMainCategory] = useState<string | null>(
    currentFilter.mainCategory || null
  );
  const [pendingSubcategory, setPendingSubcategory] = useState<string | null>(
    currentFilter.subcategory || null
  );
  const [pendingType, setPendingType] = useState<string | null>(
    currentFilter.type || null
  );
  const [pendingBrand, setPendingBrand] = useState<string | null>(
    currentFilter.brand || null
  );

  // Ref for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use ref to avoid infinite loop
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;
  
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  // Helper function to create filter object
  const createFilter = (mainCategory?: string | null, subcategory?: string | null, type?: string | null, brand?: string | null): CategoryFilterType => {
    const filter: CategoryFilterType = {};
    
    if (mainCategory) {
      filter.mainCategory = mainCategory;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }
    if (type) {
      filter.type = type;
    }
    if (brand) {
      filter.brand = brand;
    }
    
    return filter;
  };

  // Helper function to update URL with category selection
  const updateURLWithCategory = (categoryId: string | null) => {
    if (pathname === '/catalog') {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryId) {
        // Find the category by ID to get its slug
        const category = categoryTree?.mainCategories.find(c => c.id === categoryId) ||
                        Object.values(categoryTree?.subcategories || {}).flat().find(c => c.id === categoryId) ||
                        Object.values(categoryTree?.types || {}).flat().find(c => c.id === categoryId);
        
        if (category) {
          params.set('category', category.slug);
        }
      } else {
        params.delete('category');
      }
      
      const newURL = params.toString() ? `/catalog?${params.toString()}` : '/catalog';
      router.push(newURL);
    }
  };

  // Sync pending state with currentFilter when it changes
  useEffect(() => {
    setPendingMainCategory(currentFilter.mainCategory || null);
    setPendingSubcategory(currentFilter.subcategory || null);
    setPendingType(currentFilter.type || null);
    setPendingBrand(currentFilter.brand || null);
  }, [currentFilter]);

  // Sync selected state with currentFilter when it changes
  useEffect(() => {
    setSelectedMainCategory(currentFilter.mainCategory || null);
    setSelectedSubcategory(currentFilter.subcategory || null);
    setSelectedType(currentFilter.type || null);
    setSelectedBrand(currentFilter.brand || null);
  }, [currentFilter]);


  // Handle click outside and escape key to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside dropdown container AND not on a dropdown option
      if (!target.closest('.dropdown-container') && !target.closest('[data-dropdown-option]')) {
        // Also check if click is outside the main filter container
        const isOutsideMainContainer = dropdownRef.current && !dropdownRef.current.contains(target as Node);
        
        if (isOutsideMainContainer) {
          // On mobile (below lg breakpoint), always close dropdowns on outside click
          // On desktop, only close if not keeping them open
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            closeAllDropdowns();
          } else if (!keepDropdownsOpen) {
            closeAllDropdowns();
          }
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeAllDropdowns, keepDropdownsOpen]);

  // Update filter when selections change (only if not using Apply button)
  useEffect(() => {
    if (!showApplyButton) {
      const filter: CategoryFilterType = {};
      
      if (selectedMainCategory) {
        filter.mainCategory = selectedMainCategory;
      }
      if (internalSelectedSubcategory) {
        filter.subcategory = internalSelectedSubcategory;
      }
      if (internalSelectedType) {
        filter.type = internalSelectedType;
      }
      if (selectedBrand) {
        filter.brand = selectedBrand;
      }

      onFilterChangeRef.current(filter);
    }
  }, [selectedMainCategory, internalSelectedSubcategory, internalSelectedType, selectedBrand, showApplyButton]);

  // Reset subcategory when main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      setSelectedSubcategory(null);
      setSelectedType(null);
      setSelectedBrand(null); // Reset brand when main category changes
      setPendingSubcategory(null);
      setPendingType(null);
      setPendingBrand(null); // Reset pending brand when main category changes
    }
  }, [selectedMainCategory]);

  // Reset type when subcategory changes
  useEffect(() => {
    if (internalSelectedSubcategory) {
      setSelectedType(null);
      setSelectedBrand(null); // Reset brand when subcategory changes
      setPendingType(null);
      setPendingBrand(null); // Reset pending brand when subcategory changes
    }
  }, [internalSelectedSubcategory]);

  const handleMainCategorySelect = (categoryId: string) => {
    if (showApplyButton) {
      setPendingMainCategory(categoryId);
    } else {
      setSelectedMainCategory(categoryId);
    }
    
    // Update URL with the selected category
    updateURLWithCategory(categoryId);
    
    // Call immediate selection change callback if provided
    if (onSelectionChangeRef.current) {
      const newFilter = createFilter(
        categoryId,
        null, // Reset subcategory when main category changes
        null, // Reset type when main category changes
        showApplyButton ? pendingBrand : selectedBrand
      );
      onSelectionChangeRef.current(newFilter);
    }
    
    // Close dropdown after selection
    setIsMainCategoryOpen(false);
  };

  const handleSubcategorySelect = (categoryId: string) => {
    if (showApplyButton) {
      setPendingSubcategory(categoryId);
    } else {
      setSelectedSubcategory(categoryId);
    }
    
    // Call immediate selection change callback if provided
    if (onSelectionChangeRef.current) {
      const newFilter = createFilter(
        showApplyButton ? pendingMainCategory : selectedMainCategory,
        categoryId,
        null, // Reset type when subcategory changes
        showApplyButton ? pendingBrand : selectedBrand
      );
      onSelectionChangeRef.current(newFilter);
    }
    
    // Close dropdown after selection
    setIsSubcategoryOpen(false);
  };

  const handleTypeSelect = (categoryId: string) => {
    if (showApplyButton) {
      setPendingType(categoryId);
    } else {
      setSelectedType(categoryId);
    }
    
    // Call immediate selection change callback if provided
    if (onSelectionChangeRef.current) {
      const newFilter = createFilter(
        showApplyButton ? pendingMainCategory : selectedMainCategory,
        showApplyButton ? pendingSubcategory : internalSelectedSubcategory,
        categoryId,
        showApplyButton ? pendingBrand : selectedBrand
      );
      onSelectionChangeRef.current(newFilter);
    }
    
    // Close dropdown after selection
    setIsTypeOpen(false);
  };

  const handleBrandSelect = (brand: string) => {
    if (showApplyButton) {
      setPendingBrand(brand);
    } else {
      setSelectedBrand(brand);
    }
    
    // Call immediate selection change callback if provided
    if (onSelectionChangeRef.current) {
      const newFilter = createFilter(
        showApplyButton ? pendingMainCategory : selectedMainCategory,
        showApplyButton ? pendingSubcategory : internalSelectedSubcategory,
        showApplyButton ? pendingType : internalSelectedType,
        brand
      );
      onSelectionChangeRef.current(newFilter);
    }
    
    // Close dropdown after selection
    setIsBrandOpen(false);
  };


  const clearFilter = () => {
    setSelectedMainCategory(null);
    setSelectedSubcategory(null);
    setSelectedType(null);
    setSelectedBrand(null);
    setPendingMainCategory(null);
    setPendingSubcategory(null);
    setPendingType(null);
    setPendingBrand(null);
    
    // Clear URL category parameter
    updateURLWithCategory(null);
    
    closeAllDropdowns();
  };

  const applyFilters = () => {
    console.log('Apply filters clicked!', {
      pendingMainCategory,
      pendingSubcategory,
      pendingType,
      pendingBrand
    });
    
    setSelectedMainCategory(pendingMainCategory);
    setSelectedSubcategory(pendingSubcategory);
    setSelectedType(pendingType);
    setSelectedBrand(pendingBrand);
    
    // Update URL with the selected main category
    updateURLWithCategory(pendingMainCategory);
    
    const filter: CategoryFilterType = {};
    
    if (pendingMainCategory) {
      filter.mainCategory = pendingMainCategory;
    }
    if (pendingSubcategory) {
      filter.subcategory = pendingSubcategory;
    }
    if (pendingType) {
      filter.type = pendingType;
    }
    if (pendingBrand) {
      filter.brand = pendingBrand;
    }

    console.log('Applying filter:', filter);
    onFilterChangeRef.current(filter);
    closeAllDropdowns();
  };

  const getSelectedMainCategory = () => {
    const currentCategory = showApplyButton ? pendingMainCategory : selectedMainCategory;
    if (!currentCategory || !categoryTree) return null;
    return categoryTree.mainCategories.find(c => c.id === currentCategory);
  };

  const getSelectedSubcategory = () => {
    const currentSubcategory = showApplyButton ? pendingSubcategory : internalSelectedSubcategory;
    const currentMainCategory = showApplyButton ? pendingMainCategory : selectedMainCategory;
    if (!currentSubcategory || !categoryTree) return null;
    return categoryTree.subcategories[currentMainCategory || '']?.find(c => c.id === currentSubcategory);
  };

  const getSelectedType = () => {
    const currentType = showApplyButton ? pendingType : internalSelectedType;
    const currentSubcategory = showApplyButton ? pendingSubcategory : internalSelectedSubcategory;
    if (!currentType || !categoryTree) return null;
    return categoryTree.types[currentSubcategory || '']?.find(c => c.id === currentType);
  };

  const getAvailableSubcategories = () => {
    const currentMainCategory = showApplyButton ? pendingMainCategory : selectedMainCategory;
    if (!currentMainCategory || !categoryTree) return [];
    return categoryTree.subcategories[currentMainCategory] || [];
  };

  const getAvailableTypes = () => {
    const currentSubcategory = showApplyButton ? pendingSubcategory : internalSelectedSubcategory;
    if (!currentSubcategory || !categoryTree) return [];
    return categoryTree.types[currentSubcategory] || [];
  };

  // Use the passed category context or fall back to internal state
  const currentMainCategory = selectedCategory || (showApplyButton ? pendingMainCategory : selectedMainCategory);
  const currentSubcategory = selectedSubcategoryProp || (showApplyButton ? pendingSubcategory : internalSelectedSubcategory);
  const currentType = selectedTypeProp || (showApplyButton ? pendingType : internalSelectedType);

  // Fetch brands from API
  const { data: brandsData, isLoading: brandsLoading } = useBrands({
    mainCategory: currentMainCategory || undefined,
    subcategory: currentSubcategory || undefined,
    type: currentType || undefined,
    enabled: !!categoryTree
  });

  const getAvailableBrands = () => {
    return (brandsData as { brands?: string[] })?.brands || [];
  };

  if (loading || !categoryTree) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  const hasActiveFilter = showApplyButton 
    ? (pendingMainCategory || pendingSubcategory || pendingType || pendingBrand)
    : (selectedMainCategory || internalSelectedSubcategory || internalSelectedType || selectedBrand);

  // Debug logging (can be removed in production)
  // console.log('CategoryFilter render:', {
  //   showApplyButton,
  //   keepDropdownsOpen,
  //   currentFilter,
  //   pendingMainCategory,
  //   pendingSubcategory,
  //   pendingType,
  //   pendingBrand,
  //   selectedMainCategory,
  //   internalSelectedSubcategory,
  //   internalSelectedType,
  //   selectedBrand,
  //   hasActiveFilter
  // });

  // If we have category context, only show brand filter
  if (selectedCategory || selectedSubcategoryProp || selectedTypeProp) {
    const availableBrands = getAvailableBrands();
    
    if (brandsLoading) {
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="text-sm text-gray-500 text-center py-4">
            Loading brands...
          </div>
        </div>
      );
    }
    
    if (availableBrands.length === 0) {
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="text-sm text-gray-500 text-center py-4">
            No brands available for this category
          </div>
        </div>
      );
    }

    return (
      <div ref={dropdownRef} className={`space-y-4 ${className}`}>
        {/* Brand Filter Only */}
        <div 
          className="relative dropdown-container"
          onMouseEnter={() => {
            setIsBrandOpen(true);
            setIsMainCategoryOpen(false);
            setIsSubcategoryOpen(false);
            setIsTypeOpen(false);
          }}
          onMouseLeave={() => setIsBrandOpen(false)}
        >
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-left text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className={showApplyButton ? (pendingBrand ? 'text-gray-900' : 'text-gray-500') : (selectedBrand ? 'text-gray-900' : 'text-gray-500')}>
              {showApplyButton ? (pendingBrand || t('selectBrand')) : (selectedBrand || t('selectBrand'))}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
          </button>

          {isBrandOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[9999] w-full">
              <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                {availableBrands.map((brand: string) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    data-dropdown-option
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      (showApplyButton ? pendingBrand : selectedBrand) === brand
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    }`}
                    title={brand}
                  >
                    <span className="truncate block">{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If no category context, show message
  if (!selectedCategory && !selectedSubcategoryProp && !selectedTypeProp) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-sm text-gray-500 text-center py-4">
          Select a category to filter by brand
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`space-y-4 ${className}`}>
      {/* Main Category Filter */}
      <div 
        className="relative dropdown-container"
        onMouseEnter={() => {
          setIsMainCategoryOpen(true);
          setIsSubcategoryOpen(false);
          setIsTypeOpen(false);
          setIsBrandOpen(false);
        }}
        onMouseLeave={() => setIsMainCategoryOpen(false)}
      >
        <button
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-left text-sm"
        >
          <span className={selectedMainCategory ? 'text-gray-900' : 'text-gray-500'}>
            {getSelectedMainCategory() ? translateCategory(getSelectedMainCategory()?.name) : t('selectCategory')}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isMainCategoryOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMainCategoryOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[9999] w-full">
            <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
              {categoryTree.mainCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleMainCategorySelect(category.id)}
                  data-dropdown-option
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedMainCategory === category.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700'
                  }`}
                  title={translateCategory(category.name)}
                >
                  <span className="truncate block">{translateCategory(category.name)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subcategory Filter */}
      {showSubcategories && (showApplyButton ? pendingMainCategory : selectedMainCategory) && getAvailableSubcategories().length > 0 && (
        <div 
          className="relative dropdown-container"
          onMouseEnter={() => {
            setIsSubcategoryOpen(true);
            setIsMainCategoryOpen(false);
            setIsTypeOpen(false);
            setIsBrandOpen(false);
          }}
          onMouseLeave={() => setIsSubcategoryOpen(false)}
        >
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-left text-sm"
          >
            <span className={internalSelectedSubcategory ? 'text-gray-900' : 'text-gray-500'}>
              {getSelectedSubcategory() ? translateCategory(getSelectedSubcategory()?.name) : t('selectSubcategory')}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isSubcategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSubcategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[9999] w-full">
              <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                {getAvailableSubcategories().map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleSubcategorySelect(category.id)}
                    data-dropdown-option
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      internalSelectedSubcategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    }`}
                    title={translateCategory(category.name)}
                  >
                    <span className="truncate block">{translateCategory(category.name)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Type Filter */}
      {showTypes && (showApplyButton ? pendingSubcategory : internalSelectedSubcategory) && getAvailableTypes().length > 0 && (
        <div 
          className="relative dropdown-container"
          onMouseEnter={() => {
            setIsTypeOpen(true);
            setIsMainCategoryOpen(false);
            setIsSubcategoryOpen(false);
            setIsBrandOpen(false);
          }}
          onMouseLeave={() => setIsTypeOpen(false)}
        >
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-left text-sm"
          >
            <span className={internalSelectedType ? 'text-gray-900' : 'text-gray-500'}>
              {getSelectedType() ? translateCategory(getSelectedType()?.name) : t('selectType')}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTypeOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[9999] w-full">
              <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                {getAvailableTypes().map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleTypeSelect(category.id)}
                    data-dropdown-option
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      internalSelectedType === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    }`}
                    title={translateCategory(category.name)}
                  >
                    <span className="truncate block">{translateCategory(category.name)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brand Filter */}
      {showBrandFilter && getAvailableBrands().length > 0 && (
        <div 
          className="relative dropdown-container"
          onMouseEnter={() => {
            setIsBrandOpen(true);
            setIsMainCategoryOpen(false);
            setIsSubcategoryOpen(false);
            setIsTypeOpen(false);
          }}
          onMouseLeave={() => setIsBrandOpen(false)}
        >
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-left text-sm"
          >
            <span className={showApplyButton ? (pendingBrand ? 'text-gray-900' : 'text-gray-500') : (selectedBrand ? 'text-gray-900' : 'text-gray-500')}>
              {showApplyButton ? (pendingBrand || t('selectBrand')) : (selectedBrand || t('selectBrand'))}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
          </button>

          {isBrandOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[9999] w-full min-w-full">
              <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                {getAvailableBrands().map((brand: string) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    data-dropdown-option
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      (showApplyButton ? pendingBrand : selectedBrand) === brand
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    }`}
                    title={brand}
                  >
                    <span className="truncate block">{brand}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply Filter Button */}
      {showApplyButton && (
        <div className="mt-4">
          <button
            onClick={applyFilters}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-center shadow-md"
            style={{ minHeight: '48px' }}
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Clear Filter Button */}
      {hasActiveFilter && (
        <button
          onClick={clearFilter}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X size={16} />
          <span>Clear Filters</span>
        </button>
      )}

    </div>
  );
}

// Compact version for mobile
export function CategoryFilterCompact({
  onFilterChange,
  currentFilter = {},
  className = '',
}: Omit<CategoryFilterProps, 'showSubcategories' | 'showTypes'>) {
  const { categoryTree, loading } = useCategory();
  const { translateCategory } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    currentFilter.mainCategory || currentFilter.subcategory || currentFilter.type || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    currentFilter.brand || null
  );
  
  // Use ref to avoid infinite loop
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // Fetch brands from API - moved outside conditional
  const { data: brandsData, isLoading: brandsLoading } = useBrands({
    categoryId: selectedCategory || undefined,
    enabled: !!categoryTree && !!selectedCategory
  });

  useEffect(() => {
    const filter: CategoryFilterType = {};
    
    if (selectedCategory) {
      // Determine the level of the selected category
      const category = categoryTree?.mainCategories.find(c => c.id === selectedCategory) ||
                     Object.values(categoryTree?.subcategories || {}).flat().find(c => c.id === selectedCategory) ||
                     Object.values(categoryTree?.types || {}).flat().find(c => c.id === selectedCategory);
      
      if (category) {
        if (category.level === 0) {
          filter.mainCategory = selectedCategory;
        } else if (category.level === 1) {
          filter.subcategory = selectedCategory;
        } else if (category.level === 2) {
          filter.type = selectedCategory;
        }
      }
    }

    if (selectedBrand) {
      filter.brand = selectedBrand;
    }

    onFilterChangeRef.current(filter);
  }, [selectedCategory, selectedBrand, categoryTree]);

  if (loading || !categoryTree) {
    return (
      <div className={`h-10 bg-gray-200 rounded animate-pulse ${className}`}></div>
    );
  }

  // Flatten all categories for mobile selection
  const allCategories = [
    ...categoryTree.mainCategories,
    ...Object.values(categoryTree.subcategories).flat(),
    ...Object.values(categoryTree.types).flat(),
  ];

  const availableBrands = (brandsData as { brands?: string[] })?.brands || [];

  return (
    <div className={`space-y-2 ${className}`}>
      <select
        value={selectedCategory || ''}
        onChange={(e) => setSelectedCategory(e.target.value || null)}
        className="w-full px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-sm scrollbar-hide"
      >
        <option value="">All Categories</option>
        {allCategories.map(category => (
          <option key={category.id} value={category.id}>
            {'  '.repeat(category.level)}{translateCategory(category.name)}
          </option>
        ))}
      </select>
      
      {brandsLoading ? (
        <div className="w-full px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-sm text-gray-500">
          Loading brands...
        </div>
      ) : availableBrands.length > 0 ? (
        <select
          value={selectedBrand || ''}
          onChange={(e) => setSelectedBrand(e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-100 rounded-md bg-gray-50 text-sm scrollbar-hide"
        >
          <option value="">All Brands</option>
          {availableBrands.map((brand: string) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
