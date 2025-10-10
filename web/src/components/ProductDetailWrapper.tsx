// src/components/ProductDetailWrapper.tsx
"use client";
import ProductDetail from "./ProductDetail";
import PageTransitionWrapper from "./PageTransitionWrapper";

export default function ProductDetailWrapper() {
  return (
    <PageTransitionWrapper>
      <ProductDetail />
    </PageTransitionWrapper>
  );
}
