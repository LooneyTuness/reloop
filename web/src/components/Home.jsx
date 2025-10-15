"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import FastFashionHero from "./FastFashionHero";
import Footer from "./Footer";
import ProductImage from "./ProductImage";
import { supabase } from "../lib/supabase";
import {
  ShoppingBag,
  Users,
  Plus,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  Award,
  Grid,
  CheckCircle,
  Sparkles,
  Search,
  CreditCard,
  Package,
  UserCheck,
  Upload,
  DollarSign,
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching featured products from API...");

        // Use API endpoint instead of direct Supabase query to avoid RLS issues
        const response = await fetch("/api/featured-products?limit=4");

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error loading featured products:", errorData);
          setFeaturedProducts([]);
          return;
        }

        const data = await response.json();
        console.log(
          "✅ Featured products loaded:",
          data.items?.length || 0,
          "items"
        );

        if (data.items && data.items.length > 0) {
          console.log("First featured product:", data.items[0]);
        }

        setFeaturedProducts(data.items || []);
      } catch (err) {
        console.error("Error loading featured products:", err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div
      className={`min-h-screen font-poppins ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-green-50 via-white to-green-50"
      }`}
    >
      {/* Fast Fashion Hero Section */}
      <FastFashionHero />

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white -mt-2">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">
                {t("featuredItems")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-6">
              <span className="text-green-600">
                {t("discoverUniqueFinds").split(" ")[0]}
              </span>{" "}
              {t("discoverUniqueFinds").split(" ").slice(1).join(" ")}
            </h2>
            <p className="text-lg font-medium text-gray-600 max-w-2xl mx-auto">
              {t("handpickedSustainable")}
            </p>
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="relative aspect-square bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <ProductImage
                      src={product.images}
                      alt={product.name || product.title || "Product"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      fallbackText={t("noImage")}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        {t("sustainable")}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to favorites logic here
                        }}
                      >
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-gray-900 mb-2 truncate">
                      {product.name || product.title || t("unnamedProduct")}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-4 line-clamp-2">
                      {product.description || t("noDescription")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price || "0"} MKD
                      </span>
                      {product.original_price &&
                        product.original_price > product.price && (
                          <span className="text-sm text-green-600 font-medium">
                            -
                            {Math.round(
                              ((product.original_price - product.price) /
                                product.original_price) *
                                100
                            )}
                            % {t("offRetail")}
                          </span>
                        )}
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        {t("seller")}:{" "}
                        {product.seller_profiles?.business_name ||
                          product.seller_profiles?.full_name ||
                          product.seller ||
                          "Store Name"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // No products message
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg font-medium">
                  {t("noFeaturedProducts")}
                </p>
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/catalog"
              className="inline-flex items-center px-8 py-4 sm:px-12 sm:py-5 lg:px-16 lg:py-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-gray-900 font-medium rounded-lg border border-gray-200 hover:border-green-500/40 transition-all duration-300 text-base sm:text-lg lg:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>{t("viewAllProducts")}</span>
              <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
