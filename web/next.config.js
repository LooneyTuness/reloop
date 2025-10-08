/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add any external image domains you use
    unoptimized: true, // For static export if needed
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_WAITLIST_ONLY: process.env.NEXT_PUBLIC_WAITLIST_ONLY,
  },
  async redirects() {
    return [
      // Add any redirects you need
    ];
  },
  async rewrites() {
    return [
      // Add any rewrites you need
    ];
  },
};

module.exports = nextConfig;
