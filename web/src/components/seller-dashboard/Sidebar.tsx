'use client';

import React from 'react';
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
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { logout } = useAuth();
  const { t } = useDashboardLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = getNavigationItems(t);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label={isMobileMenuOpen ? t('closeMenu') : t('mobileMenu')}
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
        transform transition-transform duration-300 ease-in-out z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
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
