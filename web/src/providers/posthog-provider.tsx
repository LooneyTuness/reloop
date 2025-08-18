"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React, { useEffect } from "react";

// Helper function to get a specific cookie by name
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined; // Ensure this only runs client-side
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

type PosthogProviderProps = {
  children: React.ReactNode;
};

// Removed bootstrapData from props
export function PosthogProvider({ children }: PosthogProviderProps) {
  useEffect(() => {
    // Read bootstrap data from cookie using helper
    const cookieValue = getCookie("bootstrapData");
    let bootstrapData = {};
    if (cookieValue) {
      try {
        bootstrapData = JSON.parse(decodeURIComponent(cookieValue));
      } catch (e) {
        console.error("Failed to parse bootstrapData cookie:", e);
      }
    }

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true,
        bootstrap: bootstrapData, // Use data from cookie
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
