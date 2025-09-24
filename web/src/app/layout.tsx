import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/providers/global-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import LanguageProvider from "@/contexts/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Swish - Second-hand. First rate. | Buy & Sell Pre-Loved Fashion",
  description:
    "Swish: Second-hand. First rate. Buy and sell pre-loved clothing with style. Sustainable fashion that's NEW? NOT REALLY but STILL GOT IT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#00C853" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <GlobalProvider>
              {children}
              <Toaster />
            </GlobalProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
