"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Home from "@/components/Home";
import Waitlist from "@/components/Waitlist";
import { toast } from "sonner";
import { CategoryProvider } from "@/contexts/CategoryContext";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const error = searchParams.get('error');

  // Check if we're in waitlist-only mode
  const isWaitlistOnly = process.env.NEXT_PUBLIC_WAITLIST_ONLY === "true";

  useEffect(() => {
    console.log('Home page loaded, confirmed:', confirmed, 'error:', error);
    
    // Show success message if coming from email confirmation
    if (confirmed === 'true') {
      console.log('Showing success toast');
      toast.success("Your email has been successfully confirmed! Welcome to vtoraraka.mk!", {
        duration: 5000,
      });
      // Clean up the URL
      router.replace('/');
    }
    
    // Show error message if there was an error
    if (error) {
      console.log('Showing error toast:', error);
      toast.error(`Error: ${decodeURIComponent(error)}`, {
        duration: 7000,
      });
      // Clean up the URL
      router.replace('/');
    }
  }, [confirmed, error, router]);

  useEffect(() => {
    // If in waitlist mode, redirect to waitlist
    if (isWaitlistOnly && window.location.pathname !== "/waitlist") {
      router.push("/waitlist");
    }
  }, [isWaitlistOnly, router]);

  if (isWaitlistOnly) {
    return <Waitlist />;
  }

  return (
    <div className="bg-white">
      <main>
        <CategoryProvider>
          <Home />
        </CategoryProvider>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900" />}>
      <HomeContent />
    </Suspense>
  );
}
