"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  // Check if current page is a dashboard page
  const isDashboardPage = pathname?.startsWith('/seller-dashboard') || pathname?.startsWith('/admin');

  useEffect(() => {
    // Always use light mode for non-dashboard pages
    // For dashboard pages, the DashboardThemeProvider handles the theme
    if (isDashboardPage) {
      // Don't manage theme for dashboard pages, let DashboardThemeProvider handle it
      setIsLoaded(true);
      return;
    }

    // For non-dashboard pages, always use light mode
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    setIsLoaded(true);
  }, [isDashboardPage]);

  const toggleDarkMode = () => {
    // Don't manage theme for dashboard pages, let DashboardThemeProvider handle it
    if (isDashboardPage) return;
    
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const setDarkMode = (isDark: boolean) => {
    // Don't manage theme for dashboard pages, let DashboardThemeProvider handle it
    if (isDashboardPage) return;
    
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Don't render children until theme is loaded to prevent flash
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
