"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";

export default function Products({
  items: initialItems = [],
  limit,
  showViewAllTile = false,
}) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ...Array(
                limit ? Math.min(limit + (showViewAllTile ? 1 : 0), 4) : 8
              ),
            ].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-black rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </section>
    );
  }

  const displayedItems = limit ? items.slice(0, limit) : items;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={
                    (Array.isArray(item.photos)
                      ? item.photos[0]
                      : item.photos) || "/placeholder.jpg"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-light rounded-full">
                  ♻ Eco
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="text-lg font-extrabold text-black">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                {item.size && (
                  <p className="text-xs text-gray-600">Size: {item.size}</p>
                )}
                <span className="text-black font-bold text-lg">
                  {item.price} ден
                </span>
              </div>
            </Link>
          ))}
          {showViewAllTile && (
            <Link
              href="/products"
              className="flex items-center justify-center bg-white rounded-2xl border border-gray-200 hover:border-black hover:shadow-md transition-all duration-200 min-h-[220px]"
            >
              <span className="inline-flex items-center gap-2 text-black font-bold">
                {t("viewAll")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M13.19 7.47a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l2.97-2.97H6.75a.75.75 0 010-1.5h9.41l-2.97-2.97a.75.75 0 010-1.06z" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
