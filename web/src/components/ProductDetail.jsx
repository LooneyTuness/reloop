"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Грешка при вчитување на продукт:", error.message);
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
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-1/2 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-red-500 text-center">
        Продуктот не е најден.
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
      toast.success("Додадено во кошничка");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Грешка при додавање во кошничка");
    }
    // Stay on the product page after adding; user can open cart from navbar
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
      {/* Лева страна: галерија */}
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] bg-white">
          <img
            src={
              (Array.isArray(product.photos)
                ? product.photos[currentIndex]
                : product.photos) || "/placeholder.jpg"
            }
            alt={product.name}
            className="w-full h-full object-cover"
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-md cursor-pointer"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-md cursor-pointer"
              >
                ›
              </button>
            </>
          )}
          {product.is_eco && (
            <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
              ♻ Еко избор
            </span>
          )}
        </div>

        {Array.isArray(product.photos) && product.photos.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {product.photos.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border ${
                  idx === currentIndex ? "border-black" : "border-gray-200"
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

      {/* Десна страна: детали */}
      <div className="flex flex-col space-y-6">
        {/* Име и опис */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>

        {/* Цена */}
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-black">
            {product.price} ден
          </span>
          {product.old_price && (
            <span className="text-gray-400 line-through">
              {product.old_price} ден
            </span>
          )}
        </div>

        {/* Состојба */}
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Состојба:{" "}
            <span className="text-black font-medium">
              {product.condition || "Претходно користено"}
            </span>
          </p>
          {product.size && (
            <p className="text-sm text-gray-500 mb-2">
              Големина:{" "}
              <span className="text-black font-medium">{product.size}</span>
            </p>
          )}
        </div>

        {/* Доверба и добавувач */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Продавач:</p>
          <p className="text-black font-semibold">
            {product.seller || "Анонимен продавач"}
          </p>
        </div>

        {/* Акција */}
        <div className="flex gap-4">
          <button
            className="flex-1 bg-green-500 text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 transition cursor-pointer"
            onClick={handleAddToCart}
          >
            Додади во кошничка
          </button>
          {/* Removed wishlist/heart button */}
        </div>

        {/* Одржливост */}
        <div className="pt-6 border-t">
          <h2 className="text-lg font-bold text-black mb-3">Одржливост</h2>
          <ul className="list-disc pl-6 text-sm text-gray-600 space-y-2">
            <li>Заштеда на ресурси споредено со нов производ</li>
            <li>Производот е задржан во употреба подолго</li>
            <li>Испорака во минимално пакување без пластика</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
