"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";

export default function Products({
  items: initialItems = [],
  limit,
  showViewAllTile = false,
  searchTerm = "",
  showViewAllButton = true,
  compact = false,
}) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState("");
  const { t, language } = useLanguage();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error:", err);
      setError("Error loading items: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialItems.length === 0) fetchItems();
  }, [initialItems.length]);

  if (loading) {
    return (
      <div className="relative">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-teal-200/8 to-blue-200/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-gradient-to-br from-slate-200/6 to-gray-200/4 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-200/5 to-teal-200/4 rounded-full blur-md animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-gradient-to-br from-teal-200/4 to-blue-200/3 rounded-full blur-sm animate-pulse delay-3000"></div>
        </div>

        <div className="relative z-10">
          {/* Enhanced Tagline Skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gray-200/50 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
              <div className="w-32 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Enhanced Product Grid Skeleton */}
          <div
            className={`grid gap-4 sm:gap-6 lg:gap-8 ${
              compact
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {Array.from({ length: limit || 8 }).map((_, i) => (
              <div
                key={i}
                className="group overflow-hidden bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/30 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Image Skeleton */}
                <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* ECO Badge Skeleton */}
                  <div className="absolute top-2 left-2">
                    <div className="w-12 h-6 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-3 p-4 sm:p-5">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-16 h-5 bg-gray-200 rounded"></div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Message */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
              <span className="text-sm font-medium">
                {language === "mk"
                  ? "Се вчитуваат продукти..."
                  : "Loading products..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-red-200/10 to-orange-200/8 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-red-200/8 to-orange-200/6 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center py-16">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
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
          <div className="space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === "mk"
                ? "Не можам да ги вчитам продуктите"
                : "Unable to load products"}
            </h3>
            <p className="text-gray-600 text-sm">
              {language === "mk"
                ? "Има проблем со вчитувањето на продуктите. Ве молиме обидете се повторно."
                : "There's an issue loading the products. Please try again."}
            </p>

            {/* Retry Button */}
            <button
              onClick={() => {
                setError("");
                setLoading(true);
                fetchItems();
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {language === "mk" ? "Обиди се повторно" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayedItems = (limit ? items.slice(0, limit) : items).filter(
    (i) => i?.is_active !== false
  );

  return (
    <div className="relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-teal-200/8 to-blue-200/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-gradient-to-br from-slate-200/6 to-gray-200/4 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-200/5 to-teal-200/4 rounded-full blur-md animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-gradient-to-br from-teal-200/4 to-blue-200/3 rounded-full blur-sm animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10">
        {/* Premium Tagline */}
        <div className="text-center mb-12">
          <div className="premium-tagline text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full shadow-sm animate-pulse"></div>
              <span className="tracking-wide italic">
                "One person's 'meh' could be your new favorite outfit"
              </span>
            </div>
          </div>
        </div>

        {/* Premium Product Grid */}
        <div
          className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            compact
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {displayedItems.map((item, index) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="group animate-fade-in-up premium-product-card glass-morphism-strong"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm">
                <div className="aspect-square relative">
                  {/* Loading Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Actual Image */}
                  <img
                    src={
                      (Array.isArray(item.photos)
                        ? item.photos[0]
                        : item.photos) || "/placeholder.jpg"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 opacity-0"
                    loading="lazy"
                    onLoad={(e) => {
                      e.target.style.opacity = "1";
                      e.target.previousElementSibling.style.opacity = "0";
                    }}
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                      e.target.style.opacity = "1";
                      e.target.previousElementSibling.style.opacity = "0";
                    }}
                  />
                </div>

                {/* Enhanced Eco Badge */}
                <div
                  className={`absolute ${
                    compact
                      ? "top-1 sm:top-2 left-1 sm:left-2"
                      : "top-2 sm:top-3 left-2 sm:left-3"
                  }`}
                >
                  <div
                    className={`inline-flex items-center bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-sm rounded-lg font-bold text-white shadow-lg border border-emerald-400/30 ${
                      compact
                        ? "px-2 py-1 text-xs"
                        : "px-2 sm:px-3 py-1 sm:py-1.5 text-xs"
                    }`}
                  >
                    <span
                      className={`mr-1 ${
                        compact ? "text-xs" : "text-xs sm:text-sm"
                      }`}
                    >
                      ♻
                    </span>
                    <span className="tracking-wide">ECO</span>
                  </div>
                </div>

                {/* Luxury Quick Add to Cart Button */}
                <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Add to cart:", item.id);
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/80 backdrop-blur-xl hover:bg-white/90 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all duration-500 border border-white/40 shadow-2xl hover:shadow-3xl hover:scale-110 hover:rotate-6 hover:bg-gradient-to-br hover:from-white/90 hover:to-white/70 btn-touch-friendly"
                    title="Add to cart"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
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
                </div>

                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Subtle Border Glow */}
                <div className="absolute inset-0 rounded-t-3xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div
                className={`space-y-2 sm:space-y-3 ${
                  compact ? "p-2 sm:p-3" : "p-3 sm:p-4 lg:p-5"
                }`}
              >
                <div
                  className={`${
                    compact
                      ? "space-y-1 sm:space-y-2"
                      : "space-y-2 sm:space-y-3"
                  }`}
                >
                  <h3
                    className={`font-black text-gray-900 line-clamp-2 group-hover:text-emerald-500 transition-colors duration-500 leading-tight tracking-tight ${
                      compact ? "text-sm sm:text-base" : "text-base sm:text-lg"
                    }`}
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {item.title}
                  </h3>
                  {!compact && item.description && (
                    <p
                      className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-relaxed font-light"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>

                {item.size && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-lg font-semibold text-emerald-700 shadow-sm ${
                        compact
                          ? "px-2 py-1 text-xs"
                          : "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm"
                      }`}
                    >
                      <span className="tracking-wide">Size: {item.size}</span>
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center justify-between border-t border-gray-100 ${
                    compact ? "pt-1 sm:pt-2" : "pt-2 sm:pt-3"
                  }`}
                >
                  <span
                    className={`font-black text-gray-900 tracking-tight ${
                      compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                    }`}
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {item.price} ден
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Premium View All Section */}
        {showViewAllButton && (
          <div className="text-center mt-16 sm:mt-20">
            <div className="inline-flex flex-col items-center space-y-4">
              <Link
                href="/products"
                className="premium-view-all-button group inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-semibold rounded-2xl btn-touch-friendly"
              >
                <span className="tracking-wide text-base">
                  {language === "mk"
                    ? "Прегледај ги сите парчиња"
                    : "View All Items"}
                </span>
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
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
              </Link>

              <div className="premium-divider">
                <div className="premium-divider-line"></div>
                <p
                  className="premium-divider-text"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {language === "mk"
                    ? "Откриј ја целата колекција"
                    : "Discover our complete collection"}
                </p>
                <div className="premium-divider-line"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
