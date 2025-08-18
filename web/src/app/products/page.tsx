import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";

export const metadata: Metadata = {
  title: "Products - Reloop | Pre-Loved Fashion",
  description: "Browse our curated collection of pre-loved fashion items",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <Products />
      </main>
    </>
  );
}
