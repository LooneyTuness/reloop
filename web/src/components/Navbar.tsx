"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";

type Suggestion = {
  id: string | number;
  title: string;
  description: string | null;
  photos: string | string[] | null;
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
                <span className="hidden sm:inline text-green-700 font-medium">Колекција есен - зима 2025</span>
                <span className="sm:hidden text-green-700 font-medium">Колекција 2025</span>
              </div>
            </div>
            <Link 
              href={user ? "/seller-dashboard" : "/sign-up?redirect=/seller-dashboard"} 
              className="px-3 py-1.5 bg-gradient-to-r from-gray-100/80 to-gray-200/80 hover:from-gray-200/90 hover:to-gray-300/90 backdrop-blur-sm rounded-full border border-gray-300/50 text-gray-700 hover:text-gray-900 transition-all duration-200 text-xs font-medium shadow-sm hover:shadow-md"
            >
              <span className="hidden sm:inline">Продај парчиња</span>
              <span className="sm:hidden">Продај</span>
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <header className="eco-glass-header">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-black text-sm">V</span>
                </div>
                <span className="text-lg font-black text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                  vtoraraka
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <Link 
                href="/products" 
                className="text-gray-800 hover:text-gray-900 transition-all duration-300 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/20 backdrop-blur-sm"
              >
                Продукти
              </Link>
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
                  placeholder="Пребарај парчиња..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm placeholder-gray-500 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg focus:shadow-xl focus:bg-white/30 transition-all duration-300 font-medium"
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
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {suggestions.map((s) => {
                      const img = Array.isArray(s.photos) ? s.photos[0] : s.photos;
                      return (
                        <Link
                          key={s.id}
                          href={`/products/${s.id}`}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <Image
                            src={img || "/placeholder.jpg"}
                            alt={s.title}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-cover rounded"
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

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              
              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  window.location.href = "/products";
                }}
                className="lg:hidden p-2 sm:p-2.5 text-gray-800 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-white/30 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={() => window.location.href = "/cart"}
                className="relative p-2 sm:p-2.5 text-gray-800 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-white/30 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
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
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:text-gray-900 border border-white/30 rounded-xl transition-all duration-300 hover:bg-white/30 backdrop-blur-xl hover:border-white/50 shadow-lg hover:shadow-xl"
              >
                {language === "mk" ? "EN" : "МК"}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-white/20 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                      <span className="text-sm font-medium text-gray-700">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg py-2 z-50 overflow-hidden">
                      <Link
                        href="/products"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-white/20 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Мои нарачки
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/20 transition-colors duration-200"
                      >
                        Одјави се
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/sign-up"
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-white/30 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl min-h-[36px] sm:min-h-[40px] flex items-center justify-center whitespace-nowrap"
                >
                  Регистрирај се
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}