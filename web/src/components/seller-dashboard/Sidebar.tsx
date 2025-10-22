'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  Plus, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X
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
  const { profile: sellerProfile, loading: profileLoading } = useSellerProfile();
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

  const showAvatarGradient = !profileLoading && sellerProfile;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-2 z-[60] p-2 rounded-lg bg-white dark:bg-gray-800 shadow-xl border-2 border-gray-300 dark:border-gray-600 hover:shadow-2xl transition-all duration-200"
        aria-label={isMobileMenuOpen ? t('closeMenu') : t('mobileMenu')}
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
          <div className="flex items-left justify-left h-20 px-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/seller-dashboard" className="flex items-center space-x-3 hover:scale-105 transition-all duration-300 group" onClick={() => console.log('Sidebar logo clicked, navigating to dashboard')}>
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  vtoraraka.mk
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">
                  {t('sellerDashboard')}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                showAvatarGradient ? 'bg-gradient-to-br from-blue-500 to-orange-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <span className={`text-sm font-medium ${
                  showAvatarGradient ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getUserDisplayName()}
                </p>
                {sellerProfile?.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {sellerProfile.email}
                  </p>
                )}
                {sellerProfile?.role && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                    {sellerProfile.role}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('account')}
              </h3>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-[1.02]"
            >
              <LogOut size={20} className="mr-3" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
