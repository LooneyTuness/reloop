"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect to seller dashboard if this is the seller subdomain
    if (typeof window !== 'undefined' && window.location.hostname.includes('sellers')) {
      router.push("/seller-dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to vtoraraka
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your marketplace platform
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/seller-dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Seller Dashboard
          </button>
          <button
            onClick={() => router.push("/products")}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}