'use client';

import React, { useState } from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import BackButton from '@/components/seller-dashboard/BackButton';
import { User } from 'lucide-react';
import SellerProfileManager from '@/components/seller-dashboard/SellerProfileManager';

function SettingsContent() {
  const { } = useDashboard();
  const { t } = useDashboardLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: t('sellerProfile'), icon: User }
  ];


  const renderProfileTab = () => (
    <SellerProfileManager />
  );


  return (
    <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('manageYourStore')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:w-72">
          <nav className="space-y-1">
            <div className="px-3 mb-3">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t('settings')}
              </h3>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} className="mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'profile' && renderProfileTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SellerDashboardLayout>
      <SettingsContent />
    </SellerDashboardLayout>
  );
}
