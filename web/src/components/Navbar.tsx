"use client";

import { useState } from "react";
import Link from "next/link";
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
  const { language, toggleLanguage, t } = useLanguage();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function fetchSuggestions(term: string) {
    if (!term) {
      setSuggestions([]);
      return;
    }
    const like = `%${term}%`;
    const { data } = await (
      supabase as unknown as {
        from: (table: string) => {
          select: (cols: string) => {
            or: (expr: string) => {
              order: (
                col: string,
                opts: { ascending: boolean }
              ) => {
                limit: (n: number) => Promise<{ data: Suggestion[] | null }>;
              };
            };
          };
        };
      }
    )
      .from("items")
      .select("id,title,description,photos")
      .or(`title.ilike.${like},description.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(6);
    setSuggestions(data || []);
  }


  // categories removed (unused)

  return (
    <div>
      {/* Promo Bar */}
      <div className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span>♻️</span>
            <span className="opacity-90 text-xs sm:text-sm">
              Колекција есен - зима 2025 година
            </span>
          </div>
          <Link href="/sign-up" className="underline underline-offset-4 text-xs sm:text-sm">
            Продај парчиња
          </Link>
        </div>
      </div>

      <header className="sticky top-0 sm:top-16 z-50 border border-gray-200 shadow-lg max-w-7xl mx-2 sm:mx-4 lg:mx-auto rounded-xl px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex items-center justify-between backdrop-blur-sm mt-2 sm:mt-8 bg-white/70">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-black tracking-tight">
            vtoraraka.mk
          </h3>
        </Link>

        {/* Mobile Search Button */}

        {/* Desktop search + trust links */}
        <div className="hidden lg:flex items-center gap-3 flex-1 justify-center">
          <div className="w-full max-w-sm relative">
            <input
              type="text"
              placeholder="Пребарај..."
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-sm"
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
                  if (term)
                    window.location.href = `/products?search=${encodeURIComponent(
                      term
                    )}`;
                }
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </span>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {suggestions.map((s) => {
                  const img = Array.isArray(s.photos) ? s.photos[0] : s.photos;
                  return (
                    <a
                      key={s.id}
                      href={`/products/${s.id}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                    >
                      <img
                        src={img || "/placeholder.jpg"}
                        alt={s.title}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {s.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {s.description}
                        </div>
                      </div>
                    </a>
                  );
                })}
                <button
                  className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:text-black"
                  onClick={() => setShowSuggestions(false)}
                >
                  Затвори
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => {
                window.location.href = "/cart";
              }}
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
            </button>
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 rounded-full bg-primary text-primary-foreground text-[8px] sm:text-[10px] flex items-center justify-center font-bold shadow-lg">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </div>
            )}
          </div>

          {/* Language Switcher - Hidden on mobile */}
          <button
            onClick={toggleLanguage}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-md text-black cursor-pointer"
          >
            {language === "mk" ? "EN" : "МК"}
          </button>

          {/* User Actions - Desktop */}
          {user ? (
            <button
              onClick={signOut}
              className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-white border border-gray-200 rounded-md text-black cursor-pointer"
            >
              {t("signOut")}
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative group">
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-white border border-gray-200 rounded-md text-black cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                  {t("signUpOrLogin")}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/sign-up"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-md"
                  >
                    {t("join")}
                  </Link>
                  <Link
                    href="/sign-in"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-md"
                  >
                    {t("signIn")}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* User Actions - Mobile */}
          {user ? (
            <button
              onClick={signOut}
              className="sm:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title={t("signOut")}
            >
              <svg
                className="w-4 h-4 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          ) : (
            <div className="sm:hidden relative group">
              <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1" title={t("signUpOrLogin")}>
                <svg
                  className="w-4 h-4 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  href="/sign-up"
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-t-md"
                >
                  {t("join")}
                </Link>
                <Link
                  href="/sign-in"
                  className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-b-md"
                >
                  {t("signIn")}
                </Link>
              </div>
            </div>
          )}

          {/* Start Free Now - Simplified for mobile */}
          <Link
            href="/sell"
            className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            <span className="hidden sm:inline">{t("Sell")}</span>
            <span className="sm:hidden">{t("Sell")}</span>
          </Link>
        </div>
      </header>

    </div>
  );
}