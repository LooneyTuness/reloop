"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import LaunchPage from "@/components/LaunchPage";
import LanguageProvider from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface SellerProfile {
  is_approved: boolean;
  role: 'seller' | 'admin';
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isCheckingSeller, setIsCheckingSeller] = useState(false);

  useEffect(() => {
    const checkSellerStatus = async () => {
      // Only redirect to seller dashboard if this is the seller subdomain
      if (typeof window !== 'undefined' && window.location.hostname.includes('sellers')) {
        router.push("/seller-dashboard");
        return;
      }

      // Note: Removed automatic redirection to seller dashboard for authenticated sellers
      // This allows users to access the home page even if they are sellers
      // They can still access the dashboard through the navigation menu
    };

    checkSellerStatus();
  }, [user, loading, router]);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <LaunchPage />
      </ThemeProvider>
    </LanguageProvider>
  );
}