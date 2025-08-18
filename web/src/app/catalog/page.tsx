import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Catalog from "@/components/Catalog";
import ProtectedRoute from "@/utils/ProtectedRoute";

export const metadata: Metadata = {
  title: "Catalog - Reloop | Your Fashion Collection",
  description: "Browse and manage your fashion catalog on Reloop",
};

export default function CatalogPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProtectedRoute>
          <Catalog />
        </ProtectedRoute>
      </main>
    </>
  );
}
