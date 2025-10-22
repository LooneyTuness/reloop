'use client';

import React, { useState } from 'react';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';
import BackButton from '@/components/seller-dashboard/BackButton';
import { User } from 'lucide-react';
import SellerProfileManager from '@/components/seller-dashboard/SellerProfileManager';

function SettingsContent() {
  const { } = useDashboard();
  const { t } = useDashboardLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: t('settings'), icon: User }
  ];


  const renderProfileTab = () => (
    <SellerProfileManager />
  );


  return (
    <div className="px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('manageSellerProfile')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
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
      <DashboardProvider>
        <DashboardLanguageProvider>
          <SettingsContent />
        </DashboardLanguageProvider>
      </DashboardProvider>
    </SellerDashboardLayout>
  );
}
