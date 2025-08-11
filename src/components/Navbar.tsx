import { Link } from "react-router-dom";
import { useState } from "react";
import SignUpForm from "./SignUp.tsx";
import React from "react";
import LoginModal from "./LoginModal.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { user, signOut } = useAuth();

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const navigate = useNavigate();

  const categories = [
    { name: "Women", path: "/products?category=women" },
    { name: "Men", path: "/products?category=men" },
    { name: "Kids", path: "/products?category=toys" },
    { name: "Home", path: "/products?category=home" },
    { name: "Electronics", path: "/products?category=electronics" },
    { name: "Books", path: "/products?category=books" },
    { name: "Sustainability", path: "/products?tag=eco" },
    { name: "About", path: "/about" },
  ];
  return (
    <div>
      {/* Header */}
      <header className="glass-header sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center space-x-4 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 brand-gradient rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black transition-colors duration-300 group-hover:text-brand-600 font-display">
                  Reloop
                </h3>
                <div className="text-[9px] text-gray-500 uppercase tracking-wider -mt-0.5 hidden lg:block">
                  Circular Fashion
                </div>
              </div>
            </div>

            <div className="hidden xl:flex items-center text-xs text-brand-700 bg-brand-50/80 backdrop-blur-sm border border-brand-200/60 px-4 py-2 rounded-full">
              <span className="font-medium">
                Save the Nature: Choose Pre‑Loved
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/60 focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400/30 transition-all duration-300 max-w-xs">
              <svg
                className="w-4 h-4 text-gray-400"
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
                placeholder="Search finds..."
                className="bg-transparent border-none focus:outline-none text-sm w-32 placeholder-gray-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              {/* Icons */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-brand-600 transition-colors duration-300 relative rounded-lg hover:bg-brand-50/50">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v10.5"
                      />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      3
                    </div>
                  </button>
                </div>

                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-brand-600 transition-colors duration-300 relative rounded-lg hover:bg-brand-50/50">
                    <svg
                      className="w-5 h-5"
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
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-blue text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      2
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="hidden md:block text-right">
                      <div className="text-xs text-gray-500">Welcome back,</div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="px-3 py-2 text-brand-700 hover:text-brand-800 hover:bg-brand-50/50 transition-all duration-300 text-sm font-medium rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="hidden md:block px-3 py-2 text-brand-700 hover:text-brand-800 hover:bg-brand-50/50 transition-all duration-300 text-sm font-medium rounded-lg"
                  >
                    Join
                  </button>
                )}

                <button
                  onClick={() => navigate("/sell")}
                  className="px-4 py-2 brand-gradient text-white text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300"
                >
                  Sell Free Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Status Bar */}
        <div className="bg-gradient-to-r from-brand-50/60 to-accent-blue/10 border-b border-brand-100/30 py-1.5">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
            <div className="flex items-center space-x-6 text-xs text-brand-700">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">2,847 items saved today</span>
              </div>
              <div className="h-3 w-px bg-brand-200/50"></div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-accent-teal"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free shipping</span>
              </div>
              <div className="h-3 w-px bg-brand-200/50"></div>
              <div className="flex items-center space-x-1">
                <span className="text-accent-blue font-medium">89kg</span>
                <span>CO₂ saved/hour</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <Link
                  to={category.path}
                  key={category.name}
                  className="text-sm"
                >
                  <span className="font-sm text-gray-600 hover:text-brand-600">
                    {category.name}
                  </span>
                </Link>
              ))}
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
