'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

interface BrandDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

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
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestedBrand, setRequestedBrand] = useState('');

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

  const handleBrandSelect = (brand: string) => {
    onChange(brand);
    setIsOpen(false);
  };

  const handleRequestBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedBrand.trim()) return;

    try {
      // Here you would typically send a request to add the brand
      // For now, we'll just add it to the local list
      const newBrand = requestedBrand.trim();
      if (!brands.includes(newBrand)) {
        setBrands(prev => [...prev, newBrand].sort());
        onChange(newBrand);
      }
      setRequestedBrand('');
      setShowRequestForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error requesting brand:', error);
    }
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
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              Loading brands...
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === brand ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {brand}
                </button>
              ))}
              
              {/* Request new brand option */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                {!showRequestForm ? (
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(true)}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                  >
                    <Plus size={14} />
                    {t('requestNewBrand') || 'Request new brand'}
                  </button>
                ) : (
                  <form onSubmit={handleRequestBrand} className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <input
                      type="text"
                      value={requestedBrand}
                      onChange={(e) => setRequestedBrand(e.target.value)}
                      placeholder={t('enterBrandName') || 'Enter brand name'}
                      className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {t('request') || 'Request'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowRequestForm(false);
                          setRequestedBrand('');
                        }}
                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        {t('cancel') || 'Cancel'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
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
