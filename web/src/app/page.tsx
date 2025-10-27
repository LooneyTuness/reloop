"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LaunchPage from "@/components/LaunchPage";
import LanguageProvider from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAuthAndSellerStatus = async () => {
      if (typeof window === 'undefined') return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const token_hash = urlParams.get('token_hash');
      const type = urlParams.get('type');
      const code = urlParams.get('code');
      
      // If there are auth tokens in the URL, redirect to /auth/confirm
      if (token_hash || code) {
        console.log('Root page: Detected auth tokens in URL, redirecting to /auth/confirm');
        const authParams = new URLSearchParams();
        if (token_hash) authParams.set('token_hash', token_hash);
        if (type) authParams.set('type', type);
        if (code) authParams.set('code', code);
        
        router.push(`/auth/confirm?${authParams.toString()}`);
        return;
      }
      
      // Only redirect to seller dashboard if this is the seller subdomain
      if (window.location.hostname.includes('sellers')) {
        router.push("/seller-dashboard");
        return;
      }

      // Note: Removed automatic redirection to seller dashboard for authenticated sellers
      // This allows users to access the home page even if they are sellers
      // They can still access the dashboard through the navigation menu
    };

    checkAuthAndSellerStatus();
  }, [user, loading, router]);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <LaunchPage />
      </ThemeProvider>
    </LanguageProvider>
  );
}