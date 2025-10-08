"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Products from "./Products";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setItems(data || []);
    };
    fetchItems();
  }, []);

  return (
    <div
      className="min-h-screen relative "
      style={{ fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}
    >
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] hero-gradient hero-overlap">
        {/* Background video */}
        <video
          src="/images/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Content */}
        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-32 lg:py-40 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 z-20"
          style={{ marginTop: "10px", marginBottom: "70px" }}
        >
          {/* Left: text/buttons */}
          <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="hero-band text-xs sm:text-sm text-white/90">
              Новите парчиња стигнаа • Избрани со љубов
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
              {language === "mk"
                ? "Втора рака. Прв избор."
                : "Second-hand. First Pick."}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 font-medium text-white/90 leading-relaxed">
              {language === "mk"
                ? "Зошто да платиш повеќе? Зошто да загадиш? Избери стил што вреди - без компромис."
                : "Why pay more? Why pollute? Choose a style that's worth it - without compromise."}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mt-6 justify-center lg:justify-start">
              <Link
                href="/products"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold tracking-wide bg-primary text-primary-foreground text-center transform transition-transform duration-200 hover:scale-[1.03] hero-cta-primary text-sm sm:text-base"
              >
                {language === "mk" ? "Започни купување" : "Start Shopping"}
              </Link>
              <Link
                href="/sell"
                className="backdrop-blur-sm bg-white/70 border-1 border-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold tracking-wide text-center transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hero-cta-secondary text-sm sm:text-base"
              >
                {language === "mk"
                  ? "Додади ја својата приказна"
                  : "Add Your Story"}
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-700 flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/80 border border-gray-200 backdrop-blur">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V2.5A.75.75 0 0112 1.75zM4.72 4.72a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L4.72 5.78a.75.75 0 010-1.06zM1.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H2.5A.75.75 0 011.75 12zm17.03-7.28a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06zM12 18.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V19a.75.75 0 01.75-.75zM18.22 18.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM18.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H19a.75.75 0 01-.75-.75z" />
                </svg>
                <span className="hidden sm:inline">
                  {language === "mk" ? "Безбедни плаќања" : "Secure Payments"}
                </span>
                <span className="sm:hidden">
                  {language === "mk" ? "Безбедно" : "Secure"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/80 border border-gray-200 backdrop-blur">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14l-4-4 1.5-1.5L11 12l5.5-5.5L18 8l-7 8z" />
                </svg>
                <span className="hidden sm:inline">
                  {language === "mk"
                    ? "Проверени продавачи"
                    : "Verified Sellers"}
                </span>
                <span className="sm:hidden">
                  {language === "mk" ? "Проверено" : "Verified"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/80 border border-gray-200 backdrop-blur">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 7h13a2 2 0 012 2v7h-1a3 3 0 11-6 0H9a3 3 0 11-6 0H2V9a2 2 0 011-2zm15 2h2.5a1.5 1.5 0 011.5 1.5V15h-4V9z" />
                </svg>
                <span className="hidden sm:inline">
                  {language === "mk" ? "Брза достава" : "Fast Delivery"}
                </span>
                <span className="sm:hidden">
                  {language === "mk" ? "Брзо" : "Fast"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-separator">
        <span className="line" />
      </div>

      {/* Products Section */}
      <section className="py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 content-surface">
          <div className="text-center mb-6 sm:mb-10"></div>
          <Products limit={4} showViewAllTile />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <div className="text-lg sm:text-xl font-black text-black">
              vtoraraka.mk
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-sm italic">
              {language === "mk"
                ? "Пазарете свесно. Одберете стил кој трае."
                : "Shop consciously. Choose style that lasts."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
