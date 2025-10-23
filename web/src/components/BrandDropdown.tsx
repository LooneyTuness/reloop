'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Search, X, Check } from 'lucide-react';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

interface BrandDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Brand name formatting utility
const formatBrandName = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .map(word => {
      // Handle special cases for common brand patterns
      const lowerWord = word.toLowerCase();
      if (lowerWord === 'and') return '&';
      if (lowerWord === 'of' || lowerWord === 'the' || lowerWord === 'for') return lowerWord;
      if (lowerWord.startsWith('mc') || lowerWord.startsWith('mac')) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Brand name validation
const validateBrandName = (name: string): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Brand name is required' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Brand name must be at least 2 characters' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: 'Brand name must be less than 50 characters' };
  }
  
  // Check for valid characters (letters, numbers, spaces, hyphens, apostrophes, ampersands, periods)
  if (!/^[a-zA-Z0-9\s\-'&.]+$/.test(trimmed)) {
    return { isValid: false, error: 'Brand name contains invalid characters' };
  }
  
  return { isValid: true };
};

export default function BrandDropdown({ 
  value, 
  onChange, 
  placeholder = "Select brand",
  required = false,
  className = ""
}: BrandDropdownProps) {
  const { t } = useDashboardLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customBrand, setCustomBrand] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brands');
        const data = await response.json();
        
        if (data.brands) {
          // Filter out "Сите" (All) option and sort alphabetically
          const filteredBrands = data.brands
            .filter((brand: string) => brand !== 'Сите')
            .sort();
          setBrands(filteredBrands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand =>
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBrandSelect = (brand: string) => {
    onChange(brand);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCustomBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationError('');

    const validation = validateBrandName(customBrand);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid brand name');
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedBrand = formatBrandName(customBrand);
      
      // Check if brand already exists
      if (brands.includes(formattedBrand)) {
        setValidationError('This brand already exists');
        setIsSubmitting(false);
        return;
      }

      // Add the new brand to the list
      setBrands(prev => [...prev, formattedBrand].sort());
      onChange(formattedBrand);
      setCustomBrand('');
      setShowCustomForm(false);
      setIsOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding custom brand:', error);
      setValidationError('Failed to add brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCustomBrand(input);
    setValidationError('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const showCustomFormHandler = () => {
    setShowCustomForm(true);
    setSearchQuery('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          !value ? 'text-gray-500' : ''
        }`}
      >
        <span className="truncate">
          {value || placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              {t('loading') || 'Loading brands...'}
            </div>
          ) : (
            <div className="max-h-80 overflow-hidden">
              {/* Search Bar */}
              {!showCustomForm && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={t('searchBrands') || 'Search brands...'}
                      className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Brand Form */}
              {showCustomForm ? (
                <div className="p-3">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {t('addCustomBrand') || 'Add Custom Brand'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('brandNameRules') || 'Brand name will be automatically formatted with proper capitalization.'}
                    </p>
                  </div>
                  
                  <form onSubmit={handleCustomBrandSubmit}>
                    <div className="space-y-3">
                      <div>
                        <input
                          ref={inputRef}
                          type="text"
                          value={customBrand}
                          onChange={handleCustomBrandChange}
                          placeholder={t('enterBrandName') || 'Enter brand name (e.g., nike, calvin klein)'}
                          className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 ${
                            validationError 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                          }`}
                          disabled={isSubmitting}
                        />
                        {validationError && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {validationError}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isSubmitting || !customBrand.trim()}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              {t('adding') || 'Adding...'}
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              {t('addBrand') || 'Add Brand'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomForm(false);
                            setCustomBrand('');
                            setValidationError('');
                          }}
                          className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                          disabled={isSubmitting}
                        >
                          {t('cancel') || 'Cancel'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {/* Brand List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleBrandSelect(brand)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                            value === brand 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {value === brand && <Check size={14} className="text-blue-600" />}
                          {brand}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        {searchQuery ? t('noBrandsFound') || 'No brands found' : t('noBrandsAvailable') || 'No brands available'}
                      </div>
                    )}
                  </div>

                  {/* Add Custom Brand Button */}
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={showCustomFormHandler}
                      className="w-full text-left px-3 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                    >
                      <Plus size={14} />
                      {t('addCustomBrand') || 'Add Custom Brand'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setShowCustomForm(false);
            setSearchQuery('');
            setCustomBrand('');
            setValidationError('');
          }}
        />
      )}
    </div>
  );
}
