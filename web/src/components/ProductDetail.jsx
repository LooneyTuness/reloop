"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useProductView } from "../hooks/useProductView";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Star,
  Shield,
  Truck,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  // Track product views
  useProductView({
    productId: String(id),
    enabled: !!id && !!product,
  });

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("id", id)
          .eq("is_active", true)
          .single();

        if (error) {
          console.error(t("errorLoadingProduct"), error.message);
          setProduct(null);
          return;
        }

        // Get seller profile for the product
        let sellerProfile = null;
        if (data.user_id) {
          const { data: profile, error: profileError } = await supabase
            .from("seller_profiles")
            .select("user_id, business_name, full_name")
            .eq("user_id", data.user_id)
            .single();

          if (!profileError && profile) {
            sellerProfile = {
              business_name: profile.business_name || null,
              full_name: profile.full_name || null,
            };
          }
        }

        // Merge seller profile data with product
        const productWithSellerInfo = {
          ...data,
          seller_profiles: sellerProfile,
        };

        setProduct(productWithSellerInfo);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6">
              <div className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 space-y-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t("productNotFound")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t("productNotFoundDesc")}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t("browseProducts")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({
        id: product.id,
        name: product.name || product.title,
        price: product.price,
        image_url: product.images,
        quantity: 1,
      });
      toast.success(t("addedToCart"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.message === "Item already in cart") {
        toast.error(t("alreadyInCart"));
      } else {
        toast.error(t("errorAddingToCart"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden aspect-[4/5]">
              <img
                src={
                  (Array.isArray(product.images)
                    ? product.images[currentIndex]
                    : product.images) || "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />

              {/* Navigation arrows */}
              {Array.isArray(product.images) && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const total = Array.isArray(product.images)
                        ? product.images.length
                        : 1;
                      setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90/90 backdrop-blur-sm text-gray-900 dark:text-white p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const total = Array.isArray(product.images)
                        ? product.images.length
                        : 1;
                      setCurrentIndex((i) => (i === total - 1 ? 0 : i + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90/90 backdrop-blur-sm text-gray-900 dark:text-white p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Eco badge */}
              {product.is_eco && (
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <span>♻</span>
                    <span>{t("ecoChoice")}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg">
                  <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 bg-white/90/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg">
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Thumbnail gallery */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      idx === currentIndex
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name || product.title || "Product"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.price} {t("currency")}
                </span>
                {product.old_price && (
                  <span className="text-gray-400 line-through text-xl">
                    {product.old_price} {t("currency")}
                  </span>
                )}
              </div>
            </div>

            {/* Attributes */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-xl text-sm font-semibold">
                  {t("condition")}: {product.condition || t("Used")}
                </div>
                {product.size && (
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-2 rounded-xl text-sm font-semibold">
                    {t("size")}: {product.size}
                  </div>
                )}
                {product.brand && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-2 rounded-xl text-sm font-semibold">
                    {product.brand}
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t("seller")}:
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {product.seller_profiles?.business_name ||
                  product.seller_profiles?.full_name ||
                  product.seller ||
                  t("anonymousSeller")}
              </p>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-8">
              {isInCart(product.id) ? (
                <button
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed"
                  disabled
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{t("alreadyInCart")}</span>
                </button>
              ) : (
                <button
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t("addToCart")}</span>
                </button>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("whyChooseThisItem")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("resourceSavings")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("verifiedQuality")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("fastSecureDelivery")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
