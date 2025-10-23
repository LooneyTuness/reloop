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

      // If user is authenticated, check if they are a seller
      if (user && !loading) {
        setIsCheckingSeller(true);
        try {
          const { data: sellerProfile } = await supabase
            .from('seller_profiles')
            .select('is_approved, role')
            .eq('user_id', user.id)
            .single();

          if (sellerProfile) {
            const profile = sellerProfile as SellerProfile;
            if (profile.is_approved === true && 
                (profile.role === 'seller' || profile.role === 'admin')) {
              // User is an approved seller, redirect to dashboard
              router.push("/seller-dashboard");
            }
          }
        } catch (error) {
          console.error('Error checking seller status:', error);
        } finally {
          setIsCheckingSeller(false);
        }
      }
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