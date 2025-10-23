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
            <main className="absolute left-0 lg:left-64 top-16 sm:top-20 right-0 bottom-0 z-10">
              <div className="w-full h-full overflow-y-auto overflow-x-hidden transition-opacity duration-200 ease-in-out mobile-scrollbar-hide">
                {children}
              </div>
            </main>
          </div>
        </SellerVerification>
      </GlobalDashboardProvider>
    </SellerProfileProvider>
  );
}
