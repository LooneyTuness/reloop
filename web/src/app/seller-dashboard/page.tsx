"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import SellerDashboardLayout from '@/components/seller-dashboard/SellerDashboardLayout';
import RecentOrders from '@/components/seller-dashboard/RecentOrders';
import DashboardZeroState from '@/components/seller-dashboard/DashboardZeroState';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import { useSellerProfile } from '@/contexts/SellerProfileContext';
import { OptimizedButton } from '@/components/seller-dashboard/OptimizedLink';
import { Plus, ShoppingBag, Package } from 'lucide-react';

const DashboardContent = React.memo(function DashboardContent() {
  const router = useRouter();
  const { products, isLoading, error } = useDashboard();
  const { t } = useDashboardLanguage();
  const { profile: sellerProfile } = useSellerProfile();

  // Personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  // Get user's name from profile or fallback to email
  const getUserName = () => {
    if (sellerProfile?.full_name) {
      return sellerProfile.full_name.split(' ')[0]; // Get first name
    }
    if (sellerProfile?.business_name) {
      return sellerProfile.business_name;
    }
    if (sellerProfile?.email) {
      return sellerProfile.email.split('@')[0]; // Use email prefix as fallback
    }
    return 'Seller'; // Generic fallback
  };



  // Show loading state only on initial load
  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show zero state if no products are listed
  if (products.length === 0) {
    return (
      <div className="px-6 py-8">
        <DashboardZeroState
          onAddProduct={() => router.push('/seller-dashboard/add-product')}
                 />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-4 sm:py-8">
      {/* Dashboard Instructions Section */}
      <div className="mb-6 sm:mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 sm:p-8 lg:p-10 text-white mb-6 sm:mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl flex-shrink-0 mt-1 ring-2 ring-white/20">
                  <svg className="h-7 w-7 sm:h-9 sm:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-rounded leading-tight">
                        {getGreeting()}
                        {getUserName() && (
                          <>
                            {' '}<span className="inline-flex items-baseline gap-2">
                              {getUserName()}!
                              <span className="text-3xl sm:text-4xl lg:text-5xl leading-none animate-pulse">👋</span>
                            </span>
                          </>
                        )}
                        {!getUserName() && '!'}
                      </h1>
                    </div>
                  </div>
                  <p className="text-blue-100 text-lg sm:text-xl font-medium leading-relaxed">
                    {t('welcomeBack')}! {t('followTheseSteps')}
                  </p>
                </div>
              </div>
              
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 sm:mt-8">
              <OptimizedButton 
                onClick={() => router.push('/seller-dashboard/add-product')}
                prefetchHref="/seller-dashboard/add-product"
                className="flex items-center space-x-3 bg-white/25 backdrop-blur-md rounded-full px-4 py-3 shadow-lg hover:bg-white/30 transition-all duration-200"
              >
                <div className="h-6 w-6 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="text-green-300 w-4 h-4" />
                </div>
                <span className="font-semibold text-sm truncate">{t('addNewProduct')}</span>
              </OptimizedButton>
              <OptimizedButton 
                onClick={() => router.push('/seller-dashboard/orders')}
                prefetchHref="/seller-dashboard/orders"
                className="flex items-center space-x-3 bg-white/25 backdrop-blur-md rounded-full px-4 py-3 shadow-lg hover:bg-white/30 transition-all duration-200"
              >
                <div className="h-6 w-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="text-yellow-300 w-4 h-4" />
                </div>
                <span className="font-semibold text-sm truncate">{t('manageOrders')}</span>
              </OptimizedButton>
              <OptimizedButton 
                onClick={() => router.push('/seller-dashboard/listings')}
                prefetchHref="/seller-dashboard/listings"
                className="flex items-center space-x-3 bg-white/25 backdrop-blur-md rounded-full px-4 py-3 shadow-lg hover:bg-white/30 transition-all duration-200 sm:col-span-2 lg:col-span-1"
              >
                <div className="h-6 w-6 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="text-emerald-300 w-4 h-4" />
                </div>
                <span className="font-semibold text-sm truncate">{t('manageListings')}</span>
              </OptimizedButton>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <RecentOrders />
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Често поставувани прашања</h2>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Како можам да додадам нов производ?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Кликнете на копчето &ldquo;Додај нов производ&rdquo; во горниот дел од таблата или од менито за да започнете процесот на додавање на вашиот производ.</p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Како можам да ги следам моите нарачки?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Сите ваши нарачки се прикажани во делот &ldquo;Нарачки&rdquo; каде што можете да ги видите деталите и статусот на секоја нарачка.</p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Кога се одвива плаќањето за моите продажби?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Плаќањата се процесираат на месечна основа. Ќе добиете известување кога ќе се одвива исплатата.</p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Како можам да го уредам мојот профил?</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Одете во делот &ldquo;Поставки&rdquo; за да ги уредите вашите лични информации, бизнис детали и преференци.</p>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Потребна ви е помош?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="tel:075251009" 
              className="flex items-center gap-3 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">+ 389 75 251 009</span>
            </a>
            <a 
              href="https://instagram.com/vtorarakamk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="font-medium">Instagram</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
});

export default function SellerDashboard() {
  return (
    <SellerDashboardLayout>
      <DashboardContent />
    </SellerDashboardLayout>
  );
}