"use client";

import { useState, useEffect } from "react";
import Products from "./Products";
import { useLanguage } from "../contexts/LanguageContext";
import Image from "next/image";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      style={{ fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}
    >
      {/* Floating Action Button */}
      <div className="group">
        <button
          onClick={() => (window.location.href = "/sell")}
          className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-50"
          style={{ backgroundColor: "#00C853" }}
        >
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className={`space-y-12 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="space-y-8">
                {/* Project Badge */}
                <div
                  className="inline-flex items-center space-x-3 text-white px-6 py-3 rounded-full text-xs font-black tracking-wider uppercase"
                  style={{
                    backgroundColor: "#00C853",
                  }}
                >
                  <span>
                    {language === "mk"
                      ? "Second-Hand Fashion"
                      : "Second-Hand Fashion"}
                  </span>
                </div>

                {/* Brand Typography */}
                <div className="space-y-4">
                  <h1
                    className="text-7xl lg:text-8xl font-black leading-none tracking-tighter"
                    style={{
                      fontWeight: "900",
                      transform: "scaleY(1.1)",
                      lineHeight: "1.0",
                      color: "#00C853",
                    }}
                  >
                    Swish
                  </h1>
                  <div className="space-y-2">
                    <h2
                      className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-wide"
                      style={{}}
                    >
                      {language === "mk" ? "Кружна мода." : "Circular fashion."}
                    </h2>
                  </div>
                </div>

                {/* Brand Messages */}
                <div
                  className="flex items-center justify-between text-gray-600 text-sm font-black uppercase tracking-widest"
                  style={{}}
                >
                  <span>NEW? NOT REALLY</span>
                  <span>STILL GOT IT</span>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <p
                    className="text-lg text-gray-700 leading-relaxed max-w-lg font-semibold"
                    style={{}}
                  >
                    {language === "mk"
                      ? "Модерна платформа за купување и продавање на второработени модни парчиња. Фокусирана на одржливост и стил."
                      : "Modern platform for buying and selling second-hand fashion pieces. Focused on sustainability and style."}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="text-white px-8 py-4 rounded-full font-black tracking-wide transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-sm"
                  style={{
                    backgroundColor: "#00C853",
                  }}
                >
                  <span>
                    {language === "mk" ? "Започни Купување" : "Start Shopping"}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <button
                  className="border-2 px-8 py-4 rounded-full font-black tracking-wide transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-sm"
                  style={{
                    borderColor: "#00C853",
                    color: "#00C853",
                  }}
                >
                  <span>
                    {language === "mk" ? "Продај Парчиња" : "Sell Items"}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Visual - Mobile Mockup Image */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative group flex justify-center">
                <Image
                  src="/mobile-mockup.png"
                  alt="Swish Mobile App Mockup"
                  width={400}
                  height={640}
                  className="object-contain shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Swish Style */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-gray-50 px-6 py-3 mb-8">
              <span
                className="text-sm font-bold uppercase tracking-widest text-gray-600"
                style={{}}
              >
                {language === "mk"
                  ? "Пре-сакана Колекција"
                  : "Pre-Loved Collection"}
              </span>
            </div>

            <h2
              className="text-4xl lg:text-6xl font-black text-black mb-6 tracking-wide"
              style={{}}
            >
              <span className="font-black">
                {language === "mk" ? "Откриј" : "Discover"}
              </span>{" "}
              <span className="font-black">
                {language === "mk" ? "Уникатни Парчиња" : "Unique Pieces"}
              </span>
            </h2>

            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto font-semibold leading-relaxed"
              style={{}}
            >
              {language === "mk"
                ? "Курирана мода што заштедува ресурси и намалува отпад."
                : "Curated fashion that saves resources and reduces waste."}{" "}
              <span className="text-black font-black">
                {language === "mk"
                  ? "Секое парче раскажува приказна за одржливост."
                  : "Every piece tells a story of sustainability."}
              </span>
            </p>

            {/* Decorative line */}
            <div className="w-16 h-px bg-gray-300 mx-auto mt-8"></div>
          </div>

          <Products />
        </div>
      </section>
    </div>
  );
}
