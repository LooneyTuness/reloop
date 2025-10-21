'use client';

import React, { ReactNode } from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { DashboardThemeProvider } from '@/contexts/DashboardThemeContext';
import DashboardLanguageProvider from '@/contexts/DashboardLanguageContext';
import { CategoryProvider } from '@/contexts/CategoryContext';

interface GlobalDashboardProviderProps {
  children: ReactNode;
}

// Global provider that wraps all dashboard pages to prevent re-initialization
export default function GlobalDashboardProvider({ children }: GlobalDashboardProviderProps) {
  return (
    <DashboardLanguageProvider>
      <DashboardThemeProvider>
        <DashboardProvider>
          <ProfileProvider>
            <SearchProvider>
              <CategoryProvider>
                {children}
              </CategoryProvider>
            </SearchProvider>
          </ProfileProvider>
        </DashboardProvider>
      </DashboardThemeProvider>
    </DashboardLanguageProvider>
  );
}
