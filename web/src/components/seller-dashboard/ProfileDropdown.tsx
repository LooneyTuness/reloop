'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileDropdownProps {
  onClose: () => void;
}

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-top-2 duration-200"
    >
      {/* Arrow pointing up */}
      <div className="absolute -top-1 right-4 w-2 h-2 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45"></div>
      {/* User Info Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <User className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.user_metadata?.full_name || user?.email || 'Seller'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => {
            // Navigate to settings page
            window.location.href = '/seller-dashboard/settings';
            onClose();
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4 mr-3 text-gray-500" />
          Settings
        </button>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
