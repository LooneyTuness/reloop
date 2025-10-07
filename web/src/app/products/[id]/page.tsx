"use client";

import type { Metadata } from "next";
import ProductDetailWrapper from "@/components/ProductDetailWrapper";
import { CartProvider } from "@/contexts/CartContext";

export default function ProductDetailPage() {
  return (
    <main>
      <ProductDetailWrapper />
    </main>
  );
}
