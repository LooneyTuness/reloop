"use client";

import { useState } from "react";
import Link from "next/link";
import SignUpForm from "./SignUp";
import React from "react";
import LoginModal from "./LoginModal.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
// import HeaderCatalog from "./HeaderCatalog.jsx";

export default function Navbar() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  // const router = useRouter();

  // const categories = [
  //   { name: "Women", path: "/products?category=women" },
  //   { name: "Men", path: "/products?category=men" },
  //   { name: "Kids", path: "/products?category=toys" },
  //   { name: "Home", path: "/products?category=home" },
  //   { name: "Electronics", path: "/products?category=electronics" },
  //   { name: "Books", path: "/products?category=books" },
  //   { name: "Sustainability", path: "/products?tag=eco" },
  //   { name: "About", path: "/about" },
  // ];
  return (
    <div>
      {/* Header - Modern Gen Z Style */}
      <header className="glass-header sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo - Modern Style */}
            <Link
              href="/"
              className="flex items-center space-x-4 group cursor-pointer flex-shrink-0"
            >
              <div className="space-y-1">
                <h3 className="text-2xl lg:text-3xl font-black text-black transition-all duration-300 group-hover:scale-105 tracking-tight">
                  Swish
                </h3>
                <div className="text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold opacity-80">
                  Second-hand. First rate.
                </div>
              </div>
            </Link>

            {/* Search Bar - Modern Glass Style */}
            <div className="hidden lg:flex items-center space-x-3 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-lg transition-all duration-300 max-w-md hover:bg-white/80 focus-within:bg-white/90 focus-within:shadow-xl">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search for second-hand treasures..."
                className="bg-transparent border-none focus:outline-none text-sm placeholder-gray-400 font-semibold flex-1"
              />
            </div>

            <div className="flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
              {/* Cart Icon - Modern Style */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button className="p-3 text-gray-700 transition-all duration-300 relative hover:bg-white/60 hover:backdrop-blur-md rounded-2xl hover:shadow-lg hover:scale-105">
                    <svg
                      className="w-6 h-6"
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
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse"
                      style={{ backgroundColor: "#00C853" }}
                    >
                      2
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Switcher - Modern Glass Style */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2.5 text-sm font-bold bg-white/60 backdrop-blur-md border border-white/20 transition-all duration-300 rounded-xl hover:bg-white/80 hover:shadow-lg hover:scale-105"
                style={{ color: "#00C853" }}
                title={`Switch to ${
                  language === "mk" ? "English" : "Македонски"
                }`}
              >
                {language === "mk" ? "EN" : "МК"}
              </button>

              {/* Action Buttons - Modern Style */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="hidden md:block text-right">
                      <div className="text-xs text-gray-500 font-semibold">
                        {t("welcomeBack")},
                      </div>
                      <div className="text-sm font-bold text-black">
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="px-5 lg:px-6 py-2.5 lg:py-3 bg-white/60 backdrop-blur-md border border-white/20 transition-all duration-300 text-sm font-bold rounded-xl hover:bg-white/80 hover:shadow-lg hover:scale-105"
                      style={{ color: "#00C853" }}
                    >
                      {t("signOut")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="hidden md:block px-5 lg:px-6 py-2.5 lg:py-3 bg-white/60 backdrop-blur-md border border-white/20 transition-all duration-300 text-sm font-bold rounded-xl hover:bg-white/80 hover:shadow-lg hover:scale-105"
                    style={{ color: "#00C853" }}
                  >
                    {t("join")}
                  </button>
                )}

                <Link
                  href="/sell"
                  className="px-5 lg:px-6 py-2.5 lg:py-3 text-white text-sm font-bold transition-all duration-300 rounded-xl hover:shadow-lg hover:scale-105"
                  style={{ backgroundColor: "#00C853" }}
                >
                  {t("startFreeNow")}
                </Link>
              </div>
            </div>
          </div>
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
