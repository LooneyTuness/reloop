// src/components/ProductDetailWrapper.tsx
"use client";
import ProductDetail from "./ProductDetail";
import { CartProvider } from "@/contexts/CartContext";
import { useCart } from "../contexts/CartContext";

export default function ProductDetailWrapper() {
  return (
    <CartProvider>
      <ProductDetail />
    </CartProvider>
  );
}
