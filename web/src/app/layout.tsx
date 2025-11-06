import type { Metadata } from "next";
import "./globals.css";
import { GlobalProvider } from "@/providers/global-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import LanguageProvider from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { DropdownStateProvider } from "@/contexts/DropdownStateContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from "@/providers/QueryProvider";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";
import { PostHogPageView } from "@/components/PostHogPageView";


export const metadata: Metadata = {
  title: "vtoraraka.mk - Second-hand Clothing | Buy and Sell with Style",
  description:
    "Buy and sell second-hand clothing online. Save money, find unique pieces and contribute to sustainable fashion – all in one place.",
  openGraph: {
    title: "vtoraraka.mk - Second-hand Clothing | Buy and Sell with Style",
    description: "Buy and sell second-hand clothing online. Save money, find unique pieces and contribute to sustainable fashion – all in one place.",
    type: "website",
    locale: "en_US",
    alternateLocale: "mk_MK",
  },
  alternates: {
    languages: {
      "en": "/en",
      "mk": "/mk",
    },
  },
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="vtoraraka.mk" />
        <meta name="keywords" content="second-hand clothing, sustainable fashion, pre-loved items, circular fashion, Macedonia, Skopje" />
        <meta property="og:site_name" content="vtoraraka.mk" />
        <meta property="og:url" content="https://vtoraraka.mk" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="vtoraraka.mk - Second-hand Clothing | Buy and Sell with Style" />
        <meta name="twitter:description" content="Buy and sell second-hand clothing online. Save money, find unique pieces and contribute to sustainable fashion – all in one place." />
      </head>
      <body className="antialiased bg-white">
        <GlobalErrorHandler />
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider>
              <AuthProvider>
                <CartProvider>
                  <NotificationProvider>
                    <LanguageProvider>
                      <CategoryProvider>
                        <DropdownStateProvider>
                          <GlobalProvider>
                            <PostHogPageView />
                            <ConditionalNavbar />
                            <PageTransitionWrapper>
                              {children}
                            </PageTransitionWrapper>
                            <Toaster />
                          </GlobalProvider>
                        </DropdownStateProvider>
                      </CategoryProvider>
                    </LanguageProvider>
                  </NotificationProvider>
                </CartProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
