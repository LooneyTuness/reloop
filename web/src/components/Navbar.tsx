"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignUpForm from "./SignUp.tsx";
import React from "react";
import LoginModal from "./LoginModal.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import HeaderCatalog from "./HeaderCatalog.jsx";

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

  const router = useRouter();

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
      {/* Header - Massimo Dutti Style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-4 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-white text-lg font-light">R</span>
              </div>
              <div>
                <h3 className="text-xl font-light text-left text-black transition-colors duration-300 group-hover:text-gray-600">
                  Reloop
                </h3>
                <div className="text-xs text-gray-500 uppercase tracking-widest -mt-1 hidden lg:block font-light">
                  Circular Fashion
                </div>
              </div>
            </Link>

            {/* Search Bar - Massimo Dutti Style */}
            <div className="hidden lg:flex items-center space-x-3 bg-gray-50 px-6 py-3 border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black/20 transition-all duration-300 max-w-md">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm placeholder-gray-400 font-light flex-1"
              />
            </div>

            <div className="flex items-center space-x-6">
              {/* Cart Icon - Massimo Dutti Style */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-black transition-colors duration-300 relative hover:bg-gray-50">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                      />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-light">
                      2
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Switcher - Massimo Dutti Style */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 text-xs font-light text-gray-500 hover:text-black border border-gray-200 hover:border-black transition-all duration-300"
                title={`Switch to ${
                  language === "mk" ? "English" : "Македонски"
                }`}
              >
                {language === "mk" ? "EN" : "МК"}
              </button>

              {/* Action Buttons - Massimo Dutti Style */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block text-right">
                      <div className="text-xs text-gray-500 font-light">
                        {t("welcomeBack")},
                      </div>
                      <div className="text-sm font-light text-black">
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="px-6 py-3 text-gray-600 hover:text-black border border-gray-200 hover:border-black transition-all duration-300 text-sm font-light"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="hidden md:block px-6 py-3 text-gray-600 hover:text-black border border-gray-200 hover:border-black transition-all duration-300 text-sm font-light"
                  >
                    {t("join")}
                  </button>
                )}

                <Link
                  href="/sell"
                  className="px-6 py-3 bg-black text-white text-sm font-light hover:bg-gray-900 transition-colors duration-300"
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
        onOpenChange={(isOpen) => setShowSignUp(isOpen)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <LoginModal
        open={showLogin}
        onOpenChange={(isOpen) => setShowLogin(isOpen)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    </div>
  );
}
