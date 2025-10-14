'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { CategoryFilter as CategoryFilterType, getBrandsForCategoryHierarchy } from '@/types/category';
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
}

export default function CategoryFilter({
  onFilterChange,
  currentFilter = {},
  className = '',
  showSubcategories = true,
  showTypes = true,
  showBrandFilter = true,
  showApplyButton = false,
}: CategoryFilterProps) {
  const { categoryTree, loading } = useCategory();
  const { t, translateCategory } = useLanguage();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(
    currentFilter.mainCategory || null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    currentFilter.subcategory || null
  );
  const [selectedType, setSelectedType] = useState<string | null>(
    currentFilter.type || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    currentFilter.brand || null
  );
  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  
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
  
  // Use ref to avoid infinite loop
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // Sync pending state with currentFilter when it changes
  useEffect(() => {
    setPendingMainCategory(currentFilter.mainCategory || null);
    setPendingSubcategory(currentFilter.subcategory || null);
    setPendingType(currentFilter.type || null);
    setPendingBrand(currentFilter.brand || null);
  }, [currentFilter]);

  // Sync selected state with currentFilter when it changes (for non-Apply button mode)
  useEffect(() => {
    if (!showApplyButton) {
      setSelectedMainCategory(currentFilter.mainCategory || null);
      setSelectedSubcategory(currentFilter.subcategory || null);
      setSelectedType(currentFilter.type || null);
      setSelectedBrand(currentFilter.brand || null);
    }
  }, [currentFilter, showApplyButton]);

  // Handle click outside and escape key to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsMainCategoryOpen(false);
        setIsSubcategoryOpen(false);
        setIsTypeOpen(false);
        setIsBrandOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMainCategoryOpen(false);
        setIsSubcategoryOpen(false);
        setIsTypeOpen(false);
        setIsBrandOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Update filter when selections change (only if not using Apply button)
  useEffect(() => {
    if (!showApplyButton) {
      const filter: CategoryFilterType = {};
      
      if (selectedMainCategory) {
        filter.mainCategory = selectedMainCategory;
      }
      if (selectedSubcategory) {
        filter.subcategory = selectedSubcategory;
      }
      if (selectedType) {
        filter.type = selectedType;
      }
      if (selectedBrand) {
        filter.brand = selectedBrand;
      }

      onFilterChangeRef.current(filter);
    }
  }, [selectedMainCategory, selectedSubcategory, selectedType, selectedBrand, showApplyButton]);

  // Reset subcategory when main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      setSelectedSubcategory(null);
      setSelectedType(null);
    }
  }, [selectedMainCategory]);

  // Reset type when subcategory changes
  useEffect(() => {
    if (selectedSubcategory) {
      setSelectedType(null);
    }
  }, [selectedSubcategory]);

  const handleMainCategorySelect = (categoryId: string) => {
    if (showApplyButton) {
      setPendingMainCategory(categoryId);
    } else {
      setSelectedMainCategory(categoryId);
    }
    closeAllDropdowns();
  };

  const handleSubcategorySelect = (categoryId: string) => {
    if (showApplyButton) {
      setPendingSubcategory(categoryId);
    } else {
      setSelectedSubcategory(categoryId);
    }
    closeAllDropdowns();
  };

  const handleTypeSelect = (categoryId: string) => {
    if (showApplyButton) {
      setPendingType(categoryId);
    } else {
      setSelectedType(categoryId);
    }
    closeAllDropdowns();
  };

  const handleBrandSelect = (brand: string) => {
    if (showApplyButton) {
      setPendingBrand(brand);
    } else {
      setSelectedBrand(brand);
    }
    closeAllDropdowns();
  };

  const closeAllDropdowns = () => {
    setIsMainCategoryOpen(false);
    setIsSubcategoryOpen(false);
    setIsTypeOpen(false);
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
    const currentSubcategory = showApplyButton ? pendingSubcategory : selectedSubcategory;
    const currentMainCategory = showApplyButton ? pendingMainCategory : selectedMainCategory;
    if (!currentSubcategory || !categoryTree) return null;
    return categoryTree.subcategories[currentMainCategory || '']?.find(c => c.id === currentSubcategory);
  };

  const getSelectedType = () => {
    const currentType = showApplyButton ? pendingType : selectedType;
    const currentSubcategory = showApplyButton ? pendingSubcategory : selectedSubcategory;
    if (!currentType || !categoryTree) return null;
    return categoryTree.types[currentSubcategory || '']?.find(c => c.id === currentType);
  };

  const getAvailableSubcategories = () => {
    const currentMainCategory = showApplyButton ? pendingMainCategory : selectedMainCategory;
    if (!currentMainCategory || !categoryTree) return [];
    return categoryTree.subcategories[currentMainCategory] || [];
  };

  const getAvailableTypes = () => {
    const currentSubcategory = showApplyButton ? pendingSubcategory : selectedSubcategory;
    if (!currentSubcategory || !categoryTree) return [];
    return categoryTree.types[currentSubcategory] || [];
  };

  const getAvailableBrands = () => {
    if (!categoryTree) return [];
    
    // Get the selected category slugs for brand lookup
    const currentMainCategory = showApplyButton ? pendingMainCategory : selectedMainCategory;
    const currentSubcategory = showApplyButton ? pendingSubcategory : selectedSubcategory;
    const currentType = showApplyButton ? pendingType : selectedType;
    
    const mainCategorySlug = currentMainCategory ? categoryTree.mainCategories.find(c => c.id === currentMainCategory)?.slug : undefined;
    const subcategorySlug = currentSubcategory ? getAvailableSubcategories().find(c => c.id === currentSubcategory)?.slug : undefined;
    const typeSlug = currentType ? getAvailableTypes().find(c => c.id === currentType)?.slug : undefined;
    
    return getBrandsForCategoryHierarchy(mainCategorySlug, subcategorySlug, typeSlug);
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
    : (selectedMainCategory || selectedSubcategory || selectedType || selectedBrand);

  // Debug logging
  console.log('CategoryFilter render:', {
    showApplyButton,
    currentFilter,
    pendingMainCategory,
    pendingSubcategory,
    pendingType,
    pendingBrand,
    selectedMainCategory,
    selectedSubcategory,
    selectedType,
    selectedBrand,
    hasActiveFilter
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Category Filter */}
      <div className="relative dropdown-container">
        <button
          onClick={() => setIsMainCategoryOpen(!isMainCategoryOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md bg-white text-left text-sm"
        >
          <span className={selectedMainCategory ? 'text-gray-900' : 'text-gray-500'}>
            {getSelectedMainCategory() ? translateCategory(getSelectedMainCategory()?.name) : t('selectCategory')}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isMainCategoryOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMainCategoryOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[99999] w-full">
            <div className="py-2 max-h-60 overflow-y-auto">
              {categoryTree.mainCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleMainCategorySelect(category.id)}
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
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md bg-white text-left text-sm"
          >
            <span className={selectedSubcategory ? 'text-gray-900' : 'text-gray-500'}>
              {getSelectedSubcategory() ? translateCategory(getSelectedSubcategory()?.name) : t('selectSubcategory')}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isSubcategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSubcategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[99999] w-full">
              <div className="py-2 max-h-60 overflow-y-auto">
                {getAvailableSubcategories().map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleSubcategorySelect(category.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSubcategory === category.id
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
      {showTypes && (showApplyButton ? pendingSubcategory : selectedSubcategory) && getAvailableTypes().length > 0 && (
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md bg-white text-left text-sm"
          >
            <span className={selectedType ? 'text-gray-900' : 'text-gray-500'}>
              {getSelectedType() ? translateCategory(getSelectedType()?.name) : t('selectType')}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTypeOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[99999] w-full">
              <div className="py-2 max-h-60 overflow-y-auto">
                {getAvailableTypes().map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleTypeSelect(category.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedType === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700'
                    }`}
                    title={category.name}
                  >
                    <span className="truncate block">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Brand Filter */}
      {showBrandFilter && getAvailableBrands().length > 0 && (
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md bg-white text-left text-sm"
          >
            <span className={showApplyButton ? (pendingBrand ? 'text-gray-900' : 'text-gray-500') : (selectedBrand ? 'text-gray-900' : 'text-gray-500')}>
              {showApplyButton ? (pendingBrand || t('selectBrand')) : (selectedBrand || t('selectBrand'))}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
          </button>

          {isBrandOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl z-[99999] w-full max-w-xs">
              <div className="py-2 max-h-60 overflow-y-auto">
                {getAvailableBrands().map(brand => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    currentFilter.mainCategory || currentFilter.subcategory || currentFilter.type || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    currentFilter.brand || null
  );
  
  // Use ref to avoid infinite loop
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

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

  // Get available brands for the selected category
  const getAvailableBrands = () => {
    if (!categoryTree || !selectedCategory) return [];
    
    const category = categoryTree.mainCategories.find(c => c.id === selectedCategory) ||
                   Object.values(categoryTree.subcategories || {}).flat().find(c => c.id === selectedCategory) ||
                   Object.values(categoryTree.types || {}).flat().find(c => c.id === selectedCategory);
    
    if (!category) return [];
    
    return getBrandsForCategoryHierarchy(
      category.level === 0 ? category.slug : undefined,
      category.level === 1 ? category.slug : undefined,
      category.level === 2 ? category.slug : undefined
    );
  };

  const availableBrands = getAvailableBrands();

  return (
    <div className={`space-y-2 ${className}`}>
      <select
        value={selectedCategory || ''}
        onChange={(e) => setSelectedCategory(e.target.value || null)}
        className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-sm"
      >
        <option value="">All Categories</option>
        {allCategories.map(category => (
          <option key={category.id} value={category.id}>
            {'  '.repeat(category.level)}{category.name}
          </option>
        ))}
      </select>
      
      {availableBrands.length > 0 && (
        <select
          value={selectedBrand || ''}
          onChange={(e) => setSelectedBrand(e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-sm"
        >
          <option value="">All Brands</option>
          {availableBrands.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
