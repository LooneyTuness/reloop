'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, User, X, Eye, EyeOff, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useSellerProfile } from '@/contexts/SellerProfileContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useSearch } from '@/contexts/SearchContext';
import { useDashboardTheme } from '@/contexts/DashboardThemeContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';
import Notifications from './Notifications';

export default function TopBar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile: sellerProfile, loading: profileLoading } = useSellerProfile();
  const { notifications, unreadCount, markAsRead, dismissAllNotifications } = useNotifications();
  const { searchQuery, setSearchQuery, performSearch, clearSearch, isSearching } = useSearch();
  const { isDarkMode, toggleDarkMode } = useDashboardTheme();
  const { t } = useDashboardLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  // Close search results and profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
      if (!target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
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

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Reset avatar loaded state when avatar URL changes
  useEffect(() => {
    if (sellerProfile?.avatar_url) {
      setAvatarLoaded(false);
    }
  }, [sellerProfile?.avatar_url]);

  // Get user display name and avatar
  const getUserDisplayName = () => {
    if (sellerProfile?.full_name) {
      return sellerProfile.full_name.split(' ')[0];
    }
    if (sellerProfile?.business_name) {
      return sellerProfile.business_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserAvatar = () => {
    if (sellerProfile?.avatar_url) {
      return sellerProfile.avatar_url;
    }
    return null;
  };

  const showAvatarGradient = !profileLoading && !getUserAvatar();

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 h-16 sm:h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 shadow-md">
      <div className="flex items-center justify-between h-full px-2 sm:px-8 gap-1 sm:gap-4">
        {/* Search */}
        <div className="flex-1 max-w-[120px] sm:max-w-lg relative search-container ml-12 lg:ml-0">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="w-full pl-7 sm:pl-12 pr-7 sm:pr-12 py-1.5 sm:py-3 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-base"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  clearSearch();
                  setShowSearchResults(false);
                }}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={12} />
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
                        <span>{t('searchInProducts')}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSearchResultClick({ url: `/seller-dashboard/orders?search=${encodeURIComponent(searchQuery)}` })}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Search size={14} className="text-gray-400" />
                        <span>{t('searchInOrders')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            {isDarkMode ? (
              <Eye className="text-gray-600 dark:text-gray-400" size={14} />
            ) : (
              <EyeOff className="text-gray-600 dark:text-gray-400" size={14} />
            )}
          </button>

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-1 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            <Bell className="text-gray-600 dark:text-gray-400" size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-3 w-3 sm:h-5 sm:w-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="relative flex items-center flex-shrink-0 profile-dropdown-container">
            <button
              onClick={handleProfileClick}
              className={`h-7 w-7 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                showAvatarGradient ? 'bg-gradient-to-br from-blue-500 to-orange-600' : 'bg-gray-100 dark:bg-gray-800'
              } ${
                showProfileDropdown 
                  ? 'ring-2 ring-blue-200' 
                  : 'hover:ring-2 hover:ring-gray-200'
              }`}
              title={`${getUserDisplayName()} - Click to open profile menu`}
            >
              {getUserAvatar() ? (
                <>
                  <Image
                    key={getUserAvatar()}
                    src={getUserAvatar() as string}
                    alt="Profile"
                    width={40}
                    height={40}
                    unoptimized={true}
                    onLoad={() => setAvatarLoaded(true)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      setAvatarLoaded(false);
                    }}
                    className="w-full h-full object-cover rounded-full"
                    priority
                  />
                  {!avatarLoaded && (
                    <User className="text-gray-400 dark:text-gray-600" size={16} style={{ position: 'absolute' }} />
                  )}
                </>
              ) : showAvatarGradient ? (
                <User className="text-white" size={16} />
              ) : (
                <User className="text-gray-400 dark:text-gray-600" size={16} />
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center overflow-hidden relative ${
                      showAvatarGradient ? 'bg-gradient-to-br from-blue-500 to-orange-600' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {getUserAvatar() ? (
                        <>
                          <Image
                            key={`${getUserAvatar()}-dropdown`}
                            src={getUserAvatar() as string}
                            alt="Profile"
                            width={40}
                            height={40}
                            unoptimized={true}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                            className="w-full h-full object-cover rounded-full"
                          />
                          {!avatarLoaded && (
                            <User className="text-gray-400 dark:text-gray-600" size={20} style={{ position: 'absolute' }} />
                          )}
                        </>
                      ) : showAvatarGradient ? (
                        <User className="text-white" size={20} />
                      ) : (
                        <User className="text-gray-400 dark:text-gray-600" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {sellerProfile?.email || user?.email}
                      </p>
                      {sellerProfile?.role && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                          {sellerProfile.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      router.push('/seller-dashboard/settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
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
