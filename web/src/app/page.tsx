"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "@/components/Home";
import Waitlist from "@/components/Waitlist";

export default function HomePage() {
  const router = useRouter();

  // Check if we're in waitlist-only mode
  const isWaitlistOnly = process.env.NEXT_PUBLIC_WAITLIST_ONLY === "true";

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
        <Home />
      </main>
    </div>
  );
}
