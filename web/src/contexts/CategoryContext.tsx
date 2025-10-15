'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, CategoryHierarchy, CategoryWithChildren, CategoryTree, CategoryBreadcrumb } from '@/types/category';
import { useLanguage } from './LanguageContext';

interface CategoryContextType {
  // State
  categories: CategoryHierarchy[];
  categoryTree: CategoryTree | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: string) => CategoryHierarchy | undefined;
  getCategoryBySlug: (slug: string) => CategoryHierarchy | undefined;
  getSubcategories: (parentId: string) => CategoryHierarchy[];
  getTypes: (parentId: string) => CategoryHierarchy[];
  buildCategoryPath: (categoryId: string) => CategoryBreadcrumb[];
  getCategoryDisplayName: (categoryId: string) => string;
  buildCategoryTree: () => CategoryTree;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<CategoryHierarchy[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
      
      // Build category tree
      const tree = buildCategoryTreeFromData(data.categories || []);
      setCategoryTree(tree);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTreeFromData = (categories: CategoryHierarchy[]): CategoryTree => {
    const mainCategories = categories.filter(c => c.level === 0) as CategoryWithChildren[];
    const subcategories: { [parentId: string]: CategoryWithChildren[] } = {};
    const types: { [parentId: string]: CategoryWithChildren[] } = {};

    // Group subcategories by parent
    categories.filter(c => c.level === 1).forEach(sub => {
      if (sub.parent_id) {
        if (!subcategories[sub.parent_id]) {
          subcategories[sub.parent_id] = [];
        }
        subcategories[sub.parent_id].push(sub as CategoryWithChildren);
      }
    });

    // Group types by parent
    categories.filter(c => c.level === 2).forEach(type => {
      if (type.parent_id) {
        if (!types[type.parent_id]) {
          types[type.parent_id] = [];
        }
        types[type.parent_id].push(type as CategoryWithChildren);
      }
    });

    return {
      mainCategories,
      subcategories,
      types,
    };
  };

  const getCategoryById = (id: string): CategoryHierarchy | undefined => {
    return categories.find(c => c.id === id);
  };

  const getCategoryBySlug = (slug: string): CategoryHierarchy | undefined => {
    return categories.find(c => c.slug === slug);
  };

  const getSubcategories = (parentId: string): CategoryHierarchy[] => {
    return categories.filter(c => c.parent_id === parentId && c.level === 1);
  };

  const getTypes = (parentId: string): CategoryHierarchy[] => {
    return categories.filter(c => c.parent_id === parentId && c.level === 2);
  };

  const buildCategoryPath = (categoryId: string): CategoryBreadcrumb[] => {
    const category = getCategoryById(categoryId);
    if (!category) {
      return [];
    }

    const path: CategoryBreadcrumb[] = [];
    let current: CategoryHierarchy | undefined = category;

    // Build path from bottom to top
    while (current) {
      path.unshift({
        id: current.id,
        name: current.name, // This will be translated by the component using translateCategory
        slug: current.slug,
        level: current.level,
      });

      // Find parent
      if (current.parent_id) {
        current = getCategoryById(current.parent_id);
      } else {
        current = undefined;
      }
    }

    return path;
  };

  const getCategoryDisplayName = (categoryId: string): string => {
    const path = buildCategoryPath(categoryId);
    return path.map(c => c.name).join(' > ');
  };

  const buildCategoryTree = (): CategoryTree => {
    return buildCategoryTreeFromData(categories);
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Refresh categories when language changes to ensure translations update
  useEffect(() => {
    if (categories.length > 0) {
      // Force re-render by updating the category tree
      const tree = buildCategoryTreeFromData(categories);
      setCategoryTree(tree);
    }
  }, [language, categories]);

  const value: CategoryContextType = {
    categories,
    categoryTree,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoryBySlug,
    getSubcategories,
    getTypes,
    buildCategoryPath,
    getCategoryDisplayName,
    buildCategoryTree,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}
