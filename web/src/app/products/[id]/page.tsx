import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";

export const metadata: Metadata = {
  title: "Product Details - Reloop | Pre-Loved Fashion",
  description: "View detailed information about this pre-loved fashion item",
};

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main>
        <ProductDetail />
      </main>
    </>
  );
}
