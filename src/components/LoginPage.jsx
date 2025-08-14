import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSignIn(e) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage(t("fillAllFields"));
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        setMessage(t("welcomeBackUser"));
        // Navigation will happen automatically due to auth state change
      }
    } catch (error) {
      setMessage(t("errorOccurred"));
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-3 group mb-8"
          >
            <div className="w-8 h-8 brand-gradient rounded-xl transition-transform duration-300 group-hover:scale-110"></div>
            <span className="text-2xl font-light text-black transition-colors duration-300 group-hover:text-brand-600 font-display">
              Reloop
            </span>
          </Link>
          <h2 className="text-3xl font-light text-gray-900 mb-2 font-display">
            {t("loginTitle")}
          </h2>
          <p className="text-gray-600">{t("loginSubtitle")}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t("enterEmail")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("password")}
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={t("enterPassword")}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes("Welcome") ||
                  message.includes("successfully")
                    ? "bg-brand-50 text-brand-700 border border-brand-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brand-gradient text-white py-3 px-6 rounded-full transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("dontHaveAccount")}{" "}
              <Link
                to="/"
                className="text-brand-600 hover:text-brand-800 font-medium transition-colors"
              >
                {t("signUpHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
