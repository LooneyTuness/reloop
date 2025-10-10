"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  async function handleSignIn(e) {
    e.preventDefault();

    if (formData.email === "" || formData.password === "") {
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
      }
    } catch (error) {
      setMessage(t("errorOccurred"));
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full space-y-12">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-4 group mb-12"
          >
            <div className="w-10 h-10 bg-black transition-transform duration-300 group-hover:scale-110"></div>
            <div className="text-left">
              <span className="text-xl font-light text-black transition-colors duration-300 group-hover:text-gray-600 block">
                vtoraraka
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-widest -mt-1 font-light">
                {t("circularFashion")}
              </span>
            </div>
          </Link>

          <h2 className="text-3xl font-light text-black mb-4 tracking-wide">
            {t("loginTitle")}
          </h2>
          <p className="text-gray-600 font-light">{t("loginSubtitle")}</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 p-8">
          <form onSubmit={handleSignIn} className="space-y-8">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-3">
                {t("email")}
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t("enterEmail")}
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-3">
                {t("password")}
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={t("enterPassword")}
              />
            </div>

            {message && (
              <div
                className={`p-4 text-sm font-light ${
                  message.includes("Welcome") ||
                  message.includes("successfully") ||
                  message.includes("Добредојде")
                    ? "bg-gray-50 text-black border border-gray-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 px-6 font-light hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-light">
              {t("dontHaveAccount")}{" "}
              <Link
                href="/"
                className="text-black hover:text-gray-600 font-light transition-colors"
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
