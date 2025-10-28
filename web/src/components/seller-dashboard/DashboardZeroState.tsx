import React from 'react';
import { Package, ShoppingBag, Plus } from 'lucide-react';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

interface DashboardZeroStateProps {
  onAddProduct: () => void;
}

export default function DashboardZeroState({ onAddProduct }: DashboardZeroStateProps) {
  const { t } = useDashboardLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-6 text-center">
      {/* Illustration */}
      <div className="mb-6 sm:mb-8">
        <div className="relative">
          {/* Main illustration container */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl flex items-center justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-xl shadow-sm flex items-center justify-center">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-900/20 rounded-full flex items-center justify-center">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          </div>
          <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-5 h-5 sm:w-6 sm:h-6 bg-orange-900/20 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm sm:max-w-lg mx-auto mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          {t('welcomeToSellerDashboard')}
        </h2>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          {t('readyToStart')}
        </p>
      </div>

      {/* Quick Start Steps */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8">
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-left">
            {t('quickStartChecklist')}
          </h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <span className="text-xs sm:text-sm">{t('addFirstProduct')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
              <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-xs font-semibold text-gray-400">2</span>
              </div>
              <span className="text-xs sm:text-sm">{t('promoteYourStore')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-md">
        <button
          onClick={onAddProduct}
          className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">{t('addYourFirstProduct')}</span>
        </button>
        

      </div>
    </div>
  );
}
