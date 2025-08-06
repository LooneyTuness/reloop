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
    { name: "Hobbies & Collectibles", path: "/products?category=hobbies" },
    { name: "Sports", path: "/products?category=sports" },
    { name: "About", path: "/about" },
  ];
  return (
    <div>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full transition-transform duration-300 group-hover:scale-110"></div>
              <span
                className="text-xl font-light text-black transition-colors duration-300 group-hover:text-purple-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Reloop
              </span>
            </div>

            <div className="flex-1 max-w-sm mx-12">
              <input
                type="search"
                placeholder="Search for items"
                className="w-full px-0 py-3 border-0 border-b border-gray-200 focus:outline-none focus:border-purple-300 bg-transparent text-sm transition-colors duration-300"
              />
            </div>

            <div className="flex items-center space-x-8">
              {user ? (
                <>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-300 transform hover:scale-105"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="bg-white text-gray-800 px-6 py-2 text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 border border-purple-300 rounded-lg"
                  >
                    Sign Up | Login
                  </button>
                </>
              )}

              <button
                className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-6 py-2 text-sm hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg"
                onClick={() => navigate("/sell")}
              >
                Sell Now Free
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <Link
                  to={category.path}
                  key={category.name}
                  className="text-sm"
                >
                  <span className="font-sm text-gray-600">{category.name}</span>
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
