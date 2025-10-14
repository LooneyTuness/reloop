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
    // For non-dashboard pages, always use light mode
    if (!isDashboardPage) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      setIsLoaded(true);
      return;
    }

    // For dashboard pages, check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark mode if no preference is saved or if preference is dark
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    setIsLoaded(true);
  }, [isDashboardPage]);

  const toggleDarkMode = () => {
    // Only allow theme toggle on dashboard pages
    if (!isDashboardPage) return;
    
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
    // Only allow theme changes on dashboard pages
    if (!isDashboardPage) return;
    
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
