'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
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
  const [inputValue, setInputValue] = useState(value);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter brands based on input value
  const filteredBrands = brands.filter(brand =>
    brand.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setValidationError('');
    
    // Update parent component immediately for real-time validation
    onChange(newValue);
    
    // Show dropdown if there are matching brands or if user is typing
    if (newValue.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle brand selection from dropdown
  const handleBrandSelect = (brand: string) => {
    const formattedBrand = formatBrandName(brand);
    setInputValue(formattedBrand);
    onChange(formattedBrand);
    setIsOpen(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (inputValue.length > 0 || brands.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle input blur with delay to allow clicking on dropdown items
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Handle key down for better UX
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && filteredBrands.length === 1) {
      // Auto-select if only one match
      handleBrandSelect(filteredBrands[0]);
    }
  };

  // Format input value on blur
  const handleInputBlurFormat = () => {
    if (inputValue.trim()) {
      const formatted = formatBrandName(inputValue);
      setInputValue(formatted);
      onChange(formatted);
    }
  };

  // Clear input
  const clearInput = () => {
    setInputValue('');
    onChange('');
    setValidationError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onBlurCapture={handleInputBlurFormat}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 pr-10 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            validationError 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-200 dark:border-gray-700'
          }`}
        />
        
        {/* Clear button */}
        {inputValue && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
        
        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Validation Error */}
      {validationError && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {validationError}
        </p>
      )}

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              {t('loading') || 'Loading brands...'}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                      inputValue === brand 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {inputValue === brand && <Check size={14} className="text-blue-600" />}
                    {brand}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {inputValue.length > 0 
                    ? t('noBrandsFound') || 'No brands found - you can type a custom brand name'
                    : t('noBrandsAvailable') || 'No brands available'
                  }
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
