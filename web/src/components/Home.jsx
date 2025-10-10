"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Products from "./Products";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [pullToRefresh, setPullToRefresh] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Pull-to-refresh functionality
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;

      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 0 && window.scrollY === 0) {
        e.preventDefault();
        if (pullDistance > 80) {
          setPullToRefresh(true);
        }
      }
    };

    const handleTouchEnd = () => {
      if (isPulling && pullToRefresh) {
        setIsRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
          setIsRefreshing(false);
          setPullToRefresh(false);
          // Trigger a page refresh or data reload
          window.location.reload();
        }, 1500);
      }
      isPulling = false;
      setPullToRefresh(false);
    };

    // Only add touch events on mobile
    if (window.innerWidth <= 768) {
      document.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullToRefresh]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!error) setItems((data || []).filter((i) => i?.is_active !== false));
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen relative w-full">
      {/* Pull-to-refresh indicator */}
      <div className={`pull-to-refresh ${pullToRefresh ? "show" : ""}`}>
        <span
          className={`pull-to-refresh-icon ${isRefreshing ? "refreshing" : ""}`}
        >
          {isRefreshing ? "⟳" : "↓"}
        </span>
        {isRefreshing
          ? language === "mk"
            ? "Се освежува..."
            : "Refreshing..."
          : language === "mk"
          ? "Повлечете за освежување"
          : "Pull to refresh"}
      </div>
      {/* Hero Section */}
      <section
        className={`relative w-full hero-section-height hero-gradient pt-20 overflow-hidden ${
          videoLoaded ? "hero-video-loaded" : ""
        }`}
      >
        {/* Background video */}
        <video
          src="/images/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover hero-video z-0"
          aria-label={
            language === "mk"
              ? "Позадинско видео за модна платформа"
              : "Background video for fashion platform"
          }
          onLoadStart={() => console.log("Video loading started")}
          onCanPlay={() => {
            console.log("Video can play");
            setVideoLoaded(true);
          }}
          onError={() => {
            console.log("Video error");
            setVideoError(true);
          }}
        />

        {/* Enhanced Video Loading Fallback */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hero-video-loading z-0">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              {/* Animated Loading Spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-emerald-400/40 rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>

              {/* Loading Text with Animation */}
              <div className="text-center space-y-2">
                <div className="text-white/80 text-sm font-medium animate-pulse">
                  {language === "mk" ? "Се вчитува..." : "Loading..."}
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Video Error Fallback */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <div className="text-center space-y-2">
                <div className="text-white/80 text-sm font-medium">
                  {language === "mk" ? "Видео недостижно" : "Video unavailable"}
                </div>
                <div className="text-white/60 text-xs">
                  {language === "mk"
                    ? "Продолжете со преглед на содржината"
                    : "Continue browsing our content"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Content */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 z-20">
          {/* Left: text/buttons */}
          <div className="max-w-5xl mx-auto w-full lg:w-2/3 space-y-5 sm:space-y-6 text-left hero-content">
            {/* Hero Badge - Subtle Entry */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/25 rounded-full text-xs text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full shadow-sm animate-pulse"></div>
                <span className="tracking-wide">{t("newArrivals")}</span>
              </div>
            </div>

            {/* Main Headline - Refined Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.0] tracking-tight mb-4 hero-headline drop-shadow-2xl">
              <span className="block mb-1 bg-gradient-to-r from-white via-white to-white/95 bg-clip-text text-transparent drop-shadow-lg">
                {t("secondHand")}
              </span>
              <span className="block bg-gradient-to-r from-white via-white to-white/95 bg-clip-text text-transparent drop-shadow-lg">
                {t("firstPick")}
              </span>
            </h1>

            {/* Description - Refined Copy */}
            <p className="text-base sm:text-lg lg:text-xl max-w-xl font-medium text-white/95 leading-relaxed mb-8 hero-description tracking-wide drop-shadow-lg">
              {t("whyPayMore")}
            </p>

            {/* CTA Section - Enhanced Layout */}
            <div className="space-y-4 mb-8">
              {/* Primary Action Row */}
              <div className="hero-button-group">
                {/* Primary CTA - Enhanced */}
                <Link
                  href="/products"
                  className="hero-primary-button text-center flex items-center justify-center gap-2 group btn-touch-friendly"
                  aria-label={t("startShoppingLabel")}
                >
                  <span className="tracking-wide">{t("startShopping")}</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                {/* Secondary CTA - Enhanced */}
                <Link
                  href={user ? "/dashboard" : "/sign-up?redirect=/dashboard"}
                  className="hero-secondary-button flex items-center justify-center gap-2 group btn-touch-friendly"
                  aria-label={t("addStoryLabel")}
                >
                  <span className="tracking-wide">{t("addYourStory")}</span>
                  <svg
                    className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Link>
              </div>

              {/* Trust Indicators - Enhanced Layout */}
              <div className="hero-trust-indicators">
                <div className="hero-trust-badge btn-touch-friendly">
                  <div className="hero-trust-icon">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.5L19.5 7v5.5c0 4.2-2.9 8.1-7.5 9.5-4.6-1.4-7.5-5.3-7.5-9.5V7L12 3.5z" />
                      <path d="M10.5 8.5L9 10l2.5 2.5L14 10l-1.5-1.5L12 8l-1.5.5z" />
                    </svg>
                  </div>
                  <span className="tracking-wide">{t("securePayments")}</span>
                </div>

                <div className="hero-trust-badge btn-touch-friendly">
                  <div className="hero-trust-icon">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <path d="M16.59 7.58L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                    </svg>
                  </div>
                  <span className="tracking-wide">{t("verifiedSellers")}</span>
                </div>

                <div className="hero-trust-badge btn-touch-friendly">
                  <div className="hero-trust-icon">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                      <path d="M12 6l-1.5 1.5L12 9l1.5-1.5L12 6z" />
                    </svg>
                  </div>
                  <span className="tracking-wide">{t("fastDelivery")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 sm:py-20 w-full relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/20"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-teal-100/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-100/15 to-slate-100/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-teal-100/10 to-emerald-100/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="premium-section-title text-3xl sm:text-4xl lg:text-5xl mb-4">
              {t("curatedCollection")}
            </h2>
            <p className="premium-section-subtitle text-lg sm:text-xl max-w-2xl mx-auto">
              {t("discoverUniquePieces")}
            </p>
          </div>
          <Products
            limit={4}
            showViewAllTile
            showViewAllButton={true}
            compact={true}
          />
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white/60 to-gray-100/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 via-transparent to-transparent"></div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-teal-200/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-slate-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-teal-200/10 to-emerald-200/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Glassmorphism Border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  {language === "mk" ? "vtoraraka.mk" : "vtoraraka.mk"}
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-sm">
                  {language === "mk"
                    ? "Прескокни ја маката од традиционална препродажба. Листај облека инстантно, откриј уникатни парчиња без проблем."
                    : "Skip the hassle of traditional resale. Browse clothing instantly, discover unique pieces without the trouble."}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    vtoraraka.mk
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-wide">
                {t("shop")}
              </h3>
              <div className="space-y-4">
                <Link
                  href="/products"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  {t("allProducts")}
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  {t("sellWithUs")}
                </Link>
                <Link
                  href="/cart"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  {t("shoppingCart")}
                </Link>
              </div>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-wide">
                {t("support")}
              </h3>
              <div className="space-y-4">
                <Link
                  href="#"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  {t("helpSupport")}
                </Link>
                <Link
                  href="#"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  {t("privacyPolicy")}
                </Link>
                <Link
                  href="#"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  {t("termsOfService")}
                </Link>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="border-t border-gray-200/50 pt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 tracking-wide">
                  {t("followUs")}
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  {t("followUsDescription")}
                </p>
              </div>

              {/* Instagram Link Only */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/relovedmk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 social-link btn-touch-friendly"
                  title="Follow us on Instagram"
                  aria-label="Follow relovedmk on Instagram"
                >
                  <svg
                    className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200/50 pt-8 mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">♻</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {t("sustainableFashion")}
                </p>
              </div>

              <p className="text-sm text-gray-500 text-center sm:text-right">
                © 2024 vtoraraka.mk.{" "}
                {language === "mk"
                  ? "Сите права се задржани."
                  : "All rights reserved."}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
