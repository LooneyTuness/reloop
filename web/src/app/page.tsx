"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "@/components/Home";
import LanguageProvider from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect to seller dashboard if this is the seller subdomain
    if (typeof window !== 'undefined' && window.location.hostname.includes('sellers')) {
      router.push("/seller-dashboard");
    }
  }, [router]);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </LanguageProvider>
  );
}