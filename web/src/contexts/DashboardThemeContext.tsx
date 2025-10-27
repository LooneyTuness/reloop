"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface DashboardThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextType | undefined>(undefined);

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with localStorage value immediately to prevent flash
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dashboard-theme');
      return savedTheme === 'dark';
    }
    return false;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('dashboard-theme');
    
    // Immediately set the initial theme to avoid flash
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // Default to light mode if no preference is saved or if preference is light
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    
    setIsLoaded(true);
  }, []);

  // Add a useEffect that runs on every render to ensure theme is applied
  useEffect(() => {
    // Ensure the theme class is applied immediately
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dashboard-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dashboard-theme', 'light');
    }
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dashboard-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dashboard-theme', 'light');
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
    <DashboardThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);
  if (context === undefined) {
    throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
  }
  return context;
}
