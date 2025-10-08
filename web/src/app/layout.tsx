import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/providers/global-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import LanguageProvider from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "vtoraraka - Second-hand. First rate. | Buy & Sell Pre-Loved Fashion",
  description:
    "vtoraraka: Second-hand. First rate. Buy and sell pre-loved clothing with style. Sustainable fashion that's NEW? NOT REALLY but STILL GOT IT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo192.png" type="image/png" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <LanguageProvider>
                <GlobalProvider>
                  <Navbar />
                  {children}
                  <Toaster />
                </GlobalProvider>
              </LanguageProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
