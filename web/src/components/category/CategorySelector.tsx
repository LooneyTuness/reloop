'use client';

import React, { useState, useEffect } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import { CategoryHierarchy, CategoryWithChildren } from '@/types/category';
import { ChevronDown, X } from 'lucide-react';

interface CategorySelectorProps {
  onCategorySelect: (category: CategoryWithChildren | null) => void;
  selectedCategory?: CategoryWithChildren | null;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export default function CategorySelector({
  onCategorySelect,
  selectedCategory = null,
  className = '',
  placeholder = 'Select a category',
  required = false,
}: CategorySelectorProps) {
  const { categoryTree, loading } = useCategory();
  const { t, translateCategory } = useDashboardLanguage();
  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<CategoryWithChildren | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryWithChildren | null>(null);
  const [selectedType, setSelectedType] = useState<CategoryWithChildren | null>(null);

  // Initialize selections based on selectedCategory
  useEffect(() => {
    if (selectedCategory) {
      if (selectedCategory.level === 0) {
        setSelectedMainCategory(selectedCategory);
        setSelectedSubcategory(null);
        setSelectedType(null);
      } else if (selectedCategory.level === 1) {
        // Find the parent main category
        const parent = categoryTree?.mainCategories.find(mc => 
          categoryTree.subcategories[mc.id]?.some(sc => sc.id === selectedCategory.id)
        );
        if (parent) {
          setSelectedMainCategory(parent);
          setSelectedSubcategory(selectedCategory);
          setSelectedType(null);
        }
      } else if (selectedCategory.level === 2) {
        // Find the parent subcategory and main category
        const parentSubcategory = Object.values(categoryTree?.subcategories || {}).flat()
          .find(sc => categoryTree?.types[sc.id]?.some(t => t.id === selectedCategory.id));
        const parentMain = parentSubcategory ? 
          categoryTree?.mainCategories.find(mc => 
            categoryTree?.subcategories[mc.id]?.some(sc => sc.id === parentSubcategory.id)
          ) : null;
        
        if (parentMain && parentSubcategory) {
          setSelectedMainCategory(parentMain);
          setSelectedSubcategory(parentSubcategory);
          setSelectedType(selectedCategory);
        }
      }
    } else {
      setSelectedMainCategory(null);
      setSelectedSubcategory(null);
      setSelectedType(null);
    }
  }, [selectedCategory, categoryTree]);

  // Get available subcategories for selected main category
  const getAvailableSubcategories = () => {
    if (!selectedMainCategory || !categoryTree) return [];
    return categoryTree.subcategories[selectedMainCategory.id] || [];
  };

  // Get available types for selected subcategory
  const getAvailableTypes = () => {
    if (!selectedSubcategory || !categoryTree) return [];
    return categoryTree.types[selectedSubcategory.id] || [];
  };

  const handleMainCategorySelect = (category: CategoryWithChildren) => {
    setSelectedMainCategory(category);
    setSelectedSubcategory(null);
    setSelectedType(null);
    setIsMainCategoryOpen(false);
    onCategorySelect(category);
  };

  const handleSubcategorySelect = (category: CategoryWithChildren) => {
    setSelectedSubcategory(category);
    setSelectedType(null);
    setIsSubcategoryOpen(false);
    onCategorySelect(category);
  };

  const handleTypeSelect = (category: CategoryWithChildren) => {
    setSelectedType(category);
    setIsTypeOpen(false);
    onCategorySelect(category);
  };

  const clearSelection = () => {
    setSelectedMainCategory(null);
    setSelectedSubcategory(null);
    setSelectedType(null);
    onCategorySelect(null);
  };

  const getDisplayText = () => {
    if (selectedType) {
      return `${selectedMainCategory?.name} > ${selectedSubcategory?.name} > ${selectedType.name}`;
    }
    if (selectedSubcategory) {
      return `${selectedMainCategory?.name} > ${selectedSubcategory.name}`;
    }
    if (selectedMainCategory) {
      return selectedMainCategory.name;
    }
    return placeholder;
  };

  if (loading || !categoryTree) {
    return (
      <div className={`h-10 bg-gray-200 rounded animate-pulse ${className}`}></div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Category */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('mainCategory')} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsMainCategoryOpen(!isMainCategoryOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className={selectedMainCategory ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {selectedMainCategory?.name || t('selectMainCategory')}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isMainCategoryOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMainCategoryOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div className="py-2 max-h-60 overflow-y-auto">
              {categoryTree.mainCategories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleMainCategorySelect(category)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedMainCategory?.id === category.id
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subcategory */}
      {selectedMainCategory && getAvailableSubcategories().length > 0 && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('subcategory')}
          </label>
          <button
            type="button"
            onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className={selectedSubcategory ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
              {selectedSubcategory?.name || t('selectSubcategory')}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isSubcategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSubcategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <div className="py-2 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSubcategorySelect(null as any)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('none')}
                </button>
                {getAvailableSubcategories().map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSubcategorySelect(category)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSubcategory?.id === category.id
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Type */}
      {selectedSubcategory && getAvailableTypes().length > 0 && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('type')}
          </label>
          <button
            type="button"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className={selectedType ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
              {selectedType?.name || t('selectType')}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTypeOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <div className="py-2 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleTypeSelect(null as any)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('none')}
                </button>
                {getAvailableTypes().map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleTypeSelect(category)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType?.id === category.id
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {translateCategory(category.name)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Category Display */}
      {selectedMainCategory && (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="text-sm">
            <span className="font-medium text-gray-900 dark:text-white">{t('selected')}:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{getDisplayText()}</span>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
