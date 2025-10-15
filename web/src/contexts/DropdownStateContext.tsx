'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DropdownState {
  // Dropdown open/close states
  isMainCategoryOpen: boolean;
  isSubcategoryOpen: boolean;
  isTypeOpen: boolean;
  isBrandOpen: boolean;
  
  // Navbar-specific dropdown state
  isNavbarCategoryOpen: boolean;
  
  // Actions
  setIsMainCategoryOpen: (open: boolean) => void;
  setIsSubcategoryOpen: (open: boolean) => void;
  setIsTypeOpen: (open: boolean) => void;
  setIsBrandOpen: (open: boolean) => void;
  setIsNavbarCategoryOpen: (open: boolean) => void;
  closeAllDropdowns: () => void;
  closeNavbarDropdown: () => void;
  toggleMainCategory: () => void;
  toggleSubcategory: () => void;
  toggleType: () => void;
  toggleBrand: () => void;
  toggleNavbarCategory: () => void;
}

const DropdownStateContext = createContext<DropdownState | undefined>(undefined);

export function useDropdownState() {
  const context = useContext(DropdownStateContext);
  if (context === undefined) {
    throw new Error('useDropdownState must be used within a DropdownStateProvider');
  }
  return context;
}

interface DropdownStateProviderProps {
  children: ReactNode;
}

export function DropdownStateProvider({ children }: DropdownStateProviderProps) {
  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dropdown-state');
        const parsed = saved ? JSON.parse(saved) : {};
        console.log('Restoring dropdown state from localStorage:', parsed);
        return parsed.isMainCategoryOpen || false;
      } catch (error) {
        console.warn('Failed to restore dropdown state from localStorage:', error);
        return false;
      }
    }
    return false;
  });
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isNavbarCategoryOpen, setIsNavbarCategoryOpen] = useState(false);

  // Save dropdown state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const state = {
          isMainCategoryOpen,
          isSubcategoryOpen,
          isTypeOpen,
          isBrandOpen,
        };
        console.log('Saving dropdown state to localStorage:', state);
        localStorage.setItem('dropdown-state', JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save dropdown state to localStorage:', error);
      }
    }
  }, [isMainCategoryOpen, isSubcategoryOpen, isTypeOpen, isBrandOpen]);


  const closeAllDropdowns = () => {
    setIsMainCategoryOpen(false);
    setIsSubcategoryOpen(false);
    setIsTypeOpen(false);
    setIsBrandOpen(false);
    
    // Clear localStorage when all dropdowns are closed
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('dropdown-state');
      } catch (error) {
        console.warn('Failed to clear dropdown state from localStorage:', error);
      }
    }
  };

  const closeNavbarDropdown = () => {
    setIsNavbarCategoryOpen(false);
  };

  const toggleMainCategory = () => {
    setIsMainCategoryOpen((prev: boolean) => !prev);
    // Close other dropdowns when opening this one
    if (!isMainCategoryOpen) {
      setIsSubcategoryOpen(false);
      setIsTypeOpen(false);
      setIsBrandOpen(false);
    }
  };

  const toggleSubcategory = () => {
    setIsSubcategoryOpen((prev: boolean) => !prev);
    // Close other dropdowns when opening this one
    if (!isSubcategoryOpen) {
      setIsMainCategoryOpen(false);
      setIsTypeOpen(false);
      setIsBrandOpen(false);
    }
  };

  const toggleType = () => {
    setIsTypeOpen((prev: boolean) => !prev);
    // Close other dropdowns when opening this one
    if (!isTypeOpen) {
      setIsMainCategoryOpen(false);
      setIsSubcategoryOpen(false);
      setIsBrandOpen(false);
    }
  };

  const toggleBrand = () => {
    setIsBrandOpen((prev: boolean) => !prev);
    // Close other dropdowns when opening this one
    if (!isBrandOpen) {
      setIsMainCategoryOpen(false);
      setIsSubcategoryOpen(false);
      setIsTypeOpen(false);
    }
  };

  const toggleNavbarCategory = () => {
    setIsNavbarCategoryOpen((prev: boolean) => !prev);
  };

  const value: DropdownState = {
    isMainCategoryOpen,
    isSubcategoryOpen,
    isTypeOpen,
    isBrandOpen,
    isNavbarCategoryOpen,
    setIsMainCategoryOpen,
    setIsSubcategoryOpen,
    setIsTypeOpen,
    setIsBrandOpen,
    setIsNavbarCategoryOpen,
    closeAllDropdowns,
    closeNavbarDropdown,
    toggleMainCategory,
    toggleSubcategory,
    toggleType,
    toggleBrand,
    toggleNavbarCategory,
  };

  return (
    <DropdownStateContext.Provider value={value}>
      {children}
    </DropdownStateContext.Provider>
  );
}
