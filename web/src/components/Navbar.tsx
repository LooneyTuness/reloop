"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ShoppingBag, LogOut, Globe, Package } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCart } from "@/contexts/CartContext";

import { supabase } from "@/lib/supabase";
import { CategoryDropdown } from "./category/CategoryNavigation";

type Suggestion = {
  id: string | number;
  title: string;
  description: string | null;
  photos: string | string[] | null;
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileMenu && !target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  async function fetchSuggestions(term: string) {
    if (!term) {
      setSuggestions([]);
      return;
    }
    const like = `%${term}%`;
    const { data } = await supabase
      .from("items")
      .select("id,title,description,photos")
      .eq("is_active", true)
      .or(`title.ilike.${like},description.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(6);
    setSuggestions(data || []);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Promo Bar */}
      {/* <div className="bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 backdrop-blur-xl border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2 sm:py-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50/80 backdrop-blur-sm rounded-full border border-green-200/50">
                <span className="text-green-600">♻️</span>
                <span className="hidden sm:inline text-green-700 font-medium">{t("collection2025")}</span>
                <span className="sm:hidden text-green-700 font-medium">{t("collection2025Short")}</span>
              </div>
            </div>
            <Link 
              href={user ? "/seller-dashboard" : "/sign-up?redirect=/seller-dashboard"} 
              className="px-3 py-1.5 bg-gradient-to-r from-gray-100/80 to-gray-200/80 hover:from-gray-200/90 hover:to-gray-300/90 backdrop-blur-sm rounded-full border border-gray-300/50 text-gray-700 hover:text-gray-900 transition-all duration-200 text-xs font-medium shadow-sm hover:shadow-md"
            >
              <span className="hidden sm:inline">{t("sellItems")}</span>
              <span className="sm:hidden">{t("sell")}</span>
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <header className="bg-white border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between h-16 gap-1 sm:gap-2 md:gap-4">
            
            {/* Enhanced Logo */}
            <Link href="/" className="flex-shrink-0 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  vtoraraka.mk
                </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">
                    Втора рака. Прв избор.
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <CategoryDropdown />
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-6 lg:mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t("searchItems")}
                  className="w-full pl-9 pr-3 py-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => {
                    const term = e.target.value;
                    setSearchTerm(term);
                    setShowSuggestions(true);
                    fetchSuggestions(term);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const term = (e.target as HTMLInputElement).value.trim();
                      if (term) {
                        window.location.href = `/products?search=${encodeURIComponent(term)}`;
                      }
                    }
                  }}
                />
                
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                    {suggestions.map((s) => {
                      const img = Array.isArray(s.photos) ? s.photos[0] : s.photos;
                      return (
                        <Link
                          key={s.id}
                          href={`/products/${s.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={s.title}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {s.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {s.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              

              {/* Cart */}
              <button
                onClick={() => window.location.href = "/cart"}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs flex items-center justify-center font-bold shadow-lg">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                {language === "mk" ? "МК" : "EN"}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                      <Link
                        href="/products"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        {t("myOrders")}
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {t("signOut")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50 border border-gray-200"
                >
                  {t("signUp")}
                </Link>
              )}
            </div>

            {/* Mobile Actions - Only Cart and Menu */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Cart - Always visible on mobile */}
              <button
                onClick={() => window.location.href = "/cart"}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs flex items-center justify-center font-bold shadow-lg">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Enhanced Hamburger Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="relative p-3 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-2xl hover:bg-gray-50 group"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      showMobileMenu ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      showMobileMenu ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                    }`}
                  />
                </div>
                {/* Ripple effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-green-600/20 transition-all duration-300 ${
                  showMobileMenu ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="mobile-menu-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden">
            <div className="flex flex-col h-full">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">V</span>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-xl blur-sm opacity-30 -z-10"></div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{t("menu")}</h2>
                    <p className="text-xs text-gray-500 font-medium leading-tight">vtoraraka.mk</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder={t("searchItems")}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const term = (e.target as HTMLInputElement).value.trim();
                        if (term) {
                          window.location.href = `/products?search=${encodeURIComponent(term)}`;
                          setShowMobileMenu(false);
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {/* Quick Actions */}
                <div className="space-y-1 mb-6">
                  <Link
                    href="/catalog"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ShoppingBag size={20} className="text-green-600" />
                    <span className="font-medium">{t("browseItems")}</span>
                  </Link>
                  
                  <Link
                    href="/seller-application"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ShoppingBag size={20} className="text-green-600" />
                    <span className="font-medium">{t("startSelling")}</span>
                  </Link>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t("categories")}
                  </h3>
                  <div className="space-y-1">
                    <Link
                      href="/catalog?category=women"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <ShoppingBag size={20} className="text-pink-600" />
                      <span>{t("womensfashion")}</span>
                    </Link>
                    
                    <Link
                      href="/catalog?category=men"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <ShoppingBag size={20} className="text-blue-600" />
                      <span>{t("mensfashion")}</span>
                    </Link>
                    
                    <Link
                      href="/catalog?category=accessories"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <ShoppingBag size={20} className="text-purple-600" />
                      <span>{t("accessories")}</span>
                    </Link>
                    
                    <Link
                      href="/catalog?category=shoes"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <ShoppingBag size={20} className="text-emerald-600" />
                      <span>{t("shoes")}</span>
                    </Link>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t("settings")}
                  </h3>
                  
                  

                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Globe size={20} className="text-green-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{t("language")}</span>
                    </div>
              <button
                onClick={toggleLanguage}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {language === "mk" ? "МК" : "EN"}
              </button>
            </div>
                </div>
            </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
            {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                        <p className="text-xs text-gray-500">{t("loggedInUser")}</p>
                  </div>
                </div>
                    
                <div className="space-y-2">
                  <Link
                    href="/products"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                        <Package size={20} />
                        <span>{t("myOrders")}</span>
                  </Link>
                      
                  <button
                    onClick={() => {
                      signOut();
                      setShowMobileMenu(false);
                    }}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 w-full"
                  >
                        <LogOut size={20} />
                        <span>{t("signOut")}</span>
                  </button>
                </div>
              </div>
            ) : (
                  <div className="space-y-3">
                <Link
                  href="/sign-up"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t("signUp")}
                </Link>
                    
                    <Link
                      href="/sign-in"
                      className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t("signIn")}
                </Link>
              </div>
            )}
          </div>
        </div>
          </div>
        </>
      )}
    </div>
  );
}