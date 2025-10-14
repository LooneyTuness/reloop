'use client';

import React from 'react';
import Sidebar from '@/components/seller-dashboard/Sidebar';
import TopBar from '@/components/seller-dashboard/TopBar';
import SellerVerification from '@/components/seller-dashboard/SellerVerification';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { DashboardThemeProvider } from '@/contexts/DashboardThemeContext';
import '@/app/dashboard.css';

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  return (
    <SellerVerification>
      <DashboardThemeProvider>
        <DashboardProvider>
          <ProfileProvider>
            <SearchProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative font-poppins">
                {/* Sidebar */}
                <Sidebar />
                
                {/* Top Bar */}
                <TopBar />
                
                {/* Main Content */}
                <main className="absolute left-0 lg:left-64 top-16 sm:top-20 right-0 bottom-0">
                  <div className="w-full h-full overflow-auto transition-opacity duration-200 ease-in-out">
                    {children}
                  </div>
                </main>
              </div>
            </SearchProvider>
          </ProfileProvider>
        </DashboardProvider>
      </DashboardThemeProvider>
    </SellerVerification>
  );
}
