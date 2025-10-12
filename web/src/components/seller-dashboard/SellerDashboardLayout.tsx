'use client';

import React from 'react';
import Sidebar from '@/components/seller-dashboard/Sidebar';
import TopBar from '@/components/seller-dashboard/TopBar';
import { ProfileProvider } from '@/contexts/ProfileContext';

interface SellerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
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
    </ProfileProvider>
  );
}
