'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, User, X, Package, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useSearch } from '@/contexts/SearchContext';
import { useDashboardTheme } from '@/contexts/DashboardThemeContext';
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';

export default function TopBar() {
  const router = useRouter();
  const { } = useAuth();
  const { notifications, unreadCount, markAsRead, dismissAllNotifications } = useNotifications();
  const { avatarUrl } = useProfile();
  const { searchQuery, setSearchQuery, performSearch, clearSearch, isSearching } = useSearch();
  const { isDarkMode, toggleDarkMode } = useDashboardTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await performSearch(searchQuery.trim());
      setShowSearchResults(true);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      clearSearch();
    }
  };

  const handleSearchResultClick = (result: { url: string }) => {
    router.push(result.url);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleProfileClick = () => {
    console.log('Profile button clicked! Opening dropdown...');
    setShowProfileDropdown(true);
  };

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 h-16 sm:h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30 shadow-sm">
      <div className="flex items-center justify-between h-full px-3 sm:px-8">
        {/* Search */}
        <div className="flex-1 max-w-xs sm:max-w-lg mr-2 sm:mr-0 lg:ml-0 ml-12 relative search-container">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="w-full pl-9 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  clearSearch();
                  setShowSearchResults(false);
                }}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                </div>
              ) : (
                <div className="p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    Search results for &quot;{searchQuery}&quot;
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSearchResultClick({ url: `/seller-dashboard/listings?search=${encodeURIComponent(searchQuery)}` })}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Search size={14} className="text-gray-400" />
                        <span>Search in Products</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSearchResultClick({ url: `/seller-dashboard/orders?search=${encodeURIComponent(searchQuery)}` })}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Search size={14} className="text-gray-400" />
                        <span>Search in Orders</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            {isDarkMode ? (
              <Package className="text-gray-600 dark:text-gray-400" size={18} />
            ) : (
              <ShoppingBag className="text-gray-600 dark:text-gray-400" size={18} />
            )}
          </button>

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <Bell className="text-gray-600 dark:text-gray-400" size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="relative flex items-center flex-shrink-0">
            <button
              onClick={handleProfileClick}
              className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                showProfileDropdown 
                  ? 'ring-2 ring-blue-200' 
                  : 'hover:ring-2 hover:ring-gray-200'
              } ${avatarUrl ? 'bg-white' : 'bg-gradient-to-br from-blue-500 to-orange-600'}`}
              title="Click to open profile menu"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white" size={16} />
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <ProfileDropdown
                onClose={() => setShowProfileDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <Notifications
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={() => notifications.forEach(n => markAsRead(n.id))}
          onClearAll={dismissAllNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
