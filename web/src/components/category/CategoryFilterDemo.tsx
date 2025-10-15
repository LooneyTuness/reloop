'use client';

import React, { useState, useEffect } from 'react';
import CategoryFilter from './CategoryFilter';
import { CategoryFilter as CategoryFilterType } from '@/types/category';

// Demo component showing how to use CategoryFilter with brand filtering
export default function CategoryFilterDemo() {
  const [filter, setFilter] = useState<CategoryFilterType>({});
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Simulate fetching brands based on selected category
  useEffect(() => {
    // This would typically fetch brands from your API based on the selected category
    if (filter.mainCategory) {
      // Simulate different brands for different categories
      const brandsByCategory: { [key: string]: string[] } = {
        'women': ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo'],
        'men': ['Nike', 'Adidas', 'Levi\'s', 'Tommy Hilfiger', 'Calvin Klein'],
        'accessories': ['Ray-Ban', 'Gucci', 'Prada', 'Coach', 'Michael Kors'],
      };
      
      setAvailableBrands(brandsByCategory[filter.mainCategory] || []);
    } else {
      setAvailableBrands([]);
    }
  }, [filter.mainCategory]);

  const handleFilterChange = (newFilter: CategoryFilterType) => {
    setFilter(newFilter);
    console.log('Filter changed:', newFilter);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Category Filter Demo
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Current Filter:
        </h3>
        <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-gray-800 dark:text-gray-200">
          {JSON.stringify(filter, null, 2)}
        </pre>
      </div>

      <CategoryFilter
        onFilterChange={handleFilterChange}
        currentFilter={filter}
        showBrandFilter={true}
        className="max-w-md"
      />
    </div>
  );
}
