"use client";

import { useState } from "react";
import Link from "next/link";
import SignUpForm from "./SignUp";
import LoginModal from "./LoginModal.jsx";
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
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  // categories removed (unused)

  return (
    <div>
      {/* Promo Bar */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-1 flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <span>♻️</span>
            <span className="opacity-90">
              Колекција есен - зима 2025 година
            </span>
          </div>
          <Link href="/sell" className="underline underline-offset-4">
            Продај парчиња
          </Link>
        </div>
      </div>

      <header className="sticky top-16 z-50 border border-gray-200 shadow-lg max-w-7xl mx-4 sm:mx-6 lg:mx-auto rounded-xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between backdrop-blur-sm mt-8 bg-white/70">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 flex-shrink-0">
          <h3 className="text-2xl font-black text-black tracking-tight">
            vtoraraka.mk
          </h3>
        </Link>

        {/* Center search + trust links */}
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
        <div className="flex items-center gap-3">
          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => {
                window.location.href = "/cart";
              }}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-gray-900"
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
              <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shadow-lg">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-md text-black cursor-pointer"
          >
            {language === "mk" ? "EN" : "МК"}
          </button>

          {/* User Actions */}
          {user ? (
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-md text-black cursor-pointer"
            >
              {t("signOut")}
            </button>
          ) : (
            <button
              onClick={() => setShowSignUp(true)}
              className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 rounded-md text-black cursor-pointer"
            >
              {t("join")}
            </button>
          )}

          {/* Start Free Now */}
          <Link
            href="/sell"
            className="px-4 py-2 text-sm font-bold rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            {t("startFreeNow")}
          </Link>
        </div>
      </header>

      <SignUpForm
        open={showSignUp}
        onOpenChange={(isOpen: boolean) => setShowSignUp(isOpen)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <LoginModal
        open={showLogin}
        onOpenChange={(isOpen: boolean) => setShowLogin(isOpen)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    </div>
  );
}