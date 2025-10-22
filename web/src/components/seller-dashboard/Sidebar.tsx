'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  Plus, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSellerProfile } from '@/contexts/SellerProfileContext';
import { useDashboardLanguage } from '@/contexts/DashboardLanguageContext';

const getNavigationItems = (t: (key: string) => string) => [
  { name: t('dashboard'), href: '/seller-dashboard', icon: BarChart3 },
  { name: t('myListings'), href: '/seller-dashboard/listings', icon: Package },
  { name: t('addProduct'), href: '/seller-dashboard/add-product', icon: Plus },
  { name: t('orders'), href: '/seller-dashboard/orders', icon: ShoppingBag },
  { name: t('payouts'), href: '/seller-dashboard/payouts', icon: CreditCard },
  { name: t('settings'), href: '/seller-dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile: sellerProfile } = useSellerProfile();
  const { t } = useDashboardLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = getNavigationItems(t);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (sellerProfile?.full_name) {
      return sellerProfile.full_name.split(' ')[0];
    }
    if (sellerProfile?.business_name) {
      return sellerProfile.business_name;
    }
    return 'Seller';
  };

  const getUserAvatar = () => {
    if (sellerProfile?.avatar_url) {
      return sellerProfile.avatar_url;
    }
    return null;
  };


  // Debug avatar URL and profile data
  React.useEffect(() => {
    console.log('Sidebar - Full profile data:', sellerProfile);
    if (sellerProfile?.avatar_url) {
      console.log('Sidebar - Avatar URL:', sellerProfile.avatar_url);
    } else {
      console.log('Sidebar - No avatar URL found');
    }
  }, [sellerProfile]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-2 z-[60] p-2 rounded-lg bg-white dark:bg-gray-800 shadow-xl border-2 border-gray-300 dark:border-gray-600 hover:shadow-2xl transition-all duration-200"
        aria-label={t('mobileMenu')}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[55]"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0 z-[58]' : '-translate-x-full z-30'}
        lg:translate-x-0 lg:z-30
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-5 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative">
                <div className="h-9 w-9 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-bold text-base">V</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  vtoraraka.mk
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
                  {t('sellerDashboard')}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-0.5">
            <div className="px-3 mb-3">
              <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t('navigation')}
              </h3>
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={18} className="mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 px-3 py-3 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center relative flex-shrink-0 ${
                getUserAvatar() ? 'bg-gray-100 dark:bg-gray-800 overflow-hidden' : 'bg-gradient-to-br from-blue-500 to-orange-600'
              }`}>
                {getUserAvatar() ? (
                  <Image
                    key={getUserAvatar()}
                    src={getUserAvatar() as string}
                    alt="Profile"
                    width={40}
                    height={40}
                    unoptimized
                    className="w-full h-full object-cover rounded-full"
                    onError={() => {
                      console.error('Error loading avatar in sidebar:', getUserAvatar());
                    }}
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate leading-tight">
                  {getUserDisplayName()}
                </p>
                {sellerProfile?.email && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {sellerProfile.email}
                  </p>
                )}
                {sellerProfile?.role && (
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {t(sellerProfile.role)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="px-3 mb-2">
              <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t('account')}
              </h3>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <LogOut size={18} className="mr-3 flex-shrink-0" />
              <span className="truncate">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
