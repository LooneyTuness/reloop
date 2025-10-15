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


export const metadata: Metadata = {
  title: "vtoraraka.mk - Облека од втора рака | Купувај и продавај со стил",
  description:
    "Купувај и продавај облека од втора рака онлајн. Заштеди пари, најди уникатни парчиња и придонеси за одржлива мода – сè на едно место.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk">
      <head>
        <link rel="icon" href="/logo192.png" type="image/png" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
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
