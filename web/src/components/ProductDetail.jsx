"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error(t("errorLoadingProduct"), error.message);
      } else {
        setProduct(data);
        setCurrentIndex(0);
      }

      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[4/5] professional-card animate-pulse" />
            <div className="professional-card p-8 space-y-6">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="professional-card p-12 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {t("productNotFound")}
            </h1>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/products"
              className="hero-primary-button inline-flex items-center justify-center gap-2"
            >
              <span className="tracking-wide">Browse Products</span>
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
        image_url: product.photos,
        quantity: 1,
      });
      toast.success(t("addedToCart"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("errorAddingToCart"));
    }
    // Stay on the product page after adding; user can open cart from navbar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 product-detail-container">
        <div className="grid md:grid-cols-2 gap-12 product-detail-grid">
          {/* Лева страна: галерија */}
          <div className="space-y-3 product-detail-image-section">
            <div className="relative rounded-2xl overflow-hidden shadow-luxury aspect-[4/5] bg-white product-detail-image-container">
              <img
                src={
                  (Array.isArray(product.photos)
                    ? product.photos[currentIndex]
                    : product.photos) || "/placeholder.jpg"
                }
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105 product-detail-image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
              {Array.isArray(product.photos) && product.photos.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={() => {
                      const total = Array.isArray(product.photos)
                        ? product.photos.length
                        : 1;
                      setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-black/80 transition-all duration-300"
                  >
                    ‹
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => {
                      const total = Array.isArray(product.photos)
                        ? product.photos.length
                        : 1;
                      setCurrentIndex((i) => (i === total - 1 ? 0 : i + 1));
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-black/80 transition-all duration-300"
                  >
                    ›
                  </button>
                </>
              )}
              {product.is_eco && (
                <div className="absolute top-4 left-4">
                  <div className="hero-trust-badge">
                    <div className="hero-trust-icon">
                      <span className="text-xs">♻</span>
                    </div>
                    <span className="tracking-wide">{t("ecoChoice")}</span>
                  </div>
                </div>
              )}
            </div>

            {Array.isArray(product.photos) && product.photos.length > 1 && (
              <div className="grid grid-cols-5 gap-2 w-full">
                {product.photos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-105 w-full ${
                      idx === currentIndex
                        ? "border-emerald-500 shadow-lg"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Десна страна: детали */}
          <div className="premium-product-detail-card product-detail-content-section">
            {/* Име и опис */}
            <div>
              <h1 className="premium-product-title product-detail-title">
                {product.name || product.title || "Product"}
              </h1>
              <p
                className="premium-product-description"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {product.description}
              </p>
            </div>

            {/* Цена */}
            <div className="premium-price flex items-center gap-4">
              <span
                className="text-2xl font-black text-gray-900 tracking-tight"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {product.price} {t("currency")}
              </span>
              {product.old_price && (
                <span className="text-gray-400 line-through text-lg">
                  {product.old_price} {t("currency")}
                </span>
              )}
            </div>

            {/* Состојба и големина */}
            <div className="flex flex-wrap gap-3">
              <div className="premium-attribute-tag">
                <span className="tracking-wide">
                  {t("condition")}: {product.condition || t("Used")}
                </span>
              </div>
              {product.size && (
                <div className="premium-attribute-tag">
                  <span className="tracking-wide">
                    {t("size")}: {product.size}
                  </span>
                </div>
              )}
            </div>

            {/* Доверба и добавувач */}
            <div className="premium-seller-box">
              <p className="text-sm text-gray-500 mb-2">{t("seller")}:</p>
              <p className="text-gray-900 font-semibold">
                {product.seller || t("anonymousSeller")}
              </p>
            </div>

            {/* Акција */}
            <div className="flex gap-4">
              <button
                className="premium-add-to-cart-btn flex-1 flex items-center justify-center gap-2 group"
                onClick={handleAddToCart}
              >
                <span className="tracking-wide">{t("addToCart")}</span>
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
              </button>
            </div>

            {/* Одржливост */}
            <div className="premium-sustainability">
              <h2
                className="text-lg font-bold text-gray-900 mb-4 tracking-wide"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t("sustainability")}
              </h2>
              <div className="space-y-3">
                <div className="premium-sustainability-item">
                  <div className="premium-sustainability-icon">✓</div>
                  <span className="text-sm text-gray-600">
                    {t("resourceSavings")}
                  </span>
                </div>
                <div className="premium-sustainability-item">
                  <div className="premium-sustainability-icon">✓</div>
                  <span className="text-sm text-gray-600">
                    {t("extendedUse")}
                  </span>
                </div>
                <div className="premium-sustainability-item">
                  <div className="premium-sustainability-icon">✓</div>
                  <span className="text-sm text-gray-600">
                    {t("minimalPackaging")}
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
