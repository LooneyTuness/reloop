'use client';

import React from 'react';
import Sidebar from '@/components/seller-dashboard/Sidebar';
import TopBar from '@/components/seller-dashboard/TopBar';
import SellerVerification from '@/components/seller-dashboard/SellerVerification';
import GlobalDashboardProvider from '@/components/seller-dashboard/GlobalDashboardProvider';
import { SellerProfileProvider } from '@/contexts/SellerProfileContext';
import '@/app/dashboard.css';

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  return (
    <SellerProfileProvider>
      <GlobalDashboardProvider>
        <SellerVerification>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative font-poppins overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Top Bar */}
            <TopBar />
            
            {/* Main Content */}
            <main className="lg:ml-64 pt-16 sm:pt-20">
              <div className="w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden transition-opacity duration-200 ease-in-out mobile-scrollbar-hide">
                <div className="min-h-full bg-gray-50 dark:bg-gray-900">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </SellerVerification>
      </GlobalDashboardProvider>
    </SellerProfileProvider>
  );
}
