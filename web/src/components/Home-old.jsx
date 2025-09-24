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
    <div className="min-h-screen bg-white relative overflow-hidden">
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
                      {language === "mk"
                        ? "Second-hand. First rate."
                        : "Second-hand. First rate."}
                    </h2>
                  </div>
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
              <div className="flex flex-col sm:flex-row gap-4 rounded-lg">
                <button
                  className="text-white px-8 py-4 rounded-lg font-black tracking-wide transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-sm"
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
                  className="border-2 rounded-lg px-8 py-4 rounded-full font-black tracking-wide transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-sm"
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

            {/* Right Visual - Mobile Phone Mockup */}
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
                {/* Phone Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-12 bg-white flex items-center justify-between px-6 text-black text-sm font-black">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                      <div className="w-6 h-3 border-2 border-black rounded-sm">
                        <div className="w-full h-full bg-black rounded-xs"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="flex-1 relative">
                    {/* Hero Image */}
                    <div className="relative h-96 overflow-hidden">
                      <img
                        src="/images/hero-sustainable-fashion2.jpg.jpg"
                        alt="Fashion Model"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      {/* Fallback */}
                      <div
                        className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <div className="text-center text-white">
                          <div className="text-6xl mb-4">🕶️</div>
                          <p className="text-lg font-black">Fashion Model</p>
                          <p className="text-sm font-bold opacity-80">
                            Green Jacket Style
                          </p>
                        </div>
                      </div>

                      {/* Overlay UI Elements */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Product Info Overlay */}
                      <div className="absolute bottom-16 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3
                                className="font-black text-gray-900 text-sm"
                                style={{}}
                              >
                                Bubblegum Fleece Hoodie
                              </h3>
                              <p className="text-gray-600 text-xs" style={{}}>
                                Outwear
                              </p>
                              <p
                                className="font-black text-lg text-gray-900 mt-1"
                                style={{}}
                              >
                                32 €
                              </p>
                            </div>
                            <button
                              className="text-white px-6 py-2 rounded-full text-sm font-black"
                              style={{
                                backgroundColor: "#00C853",
                              }}
                            >
                              Buy Now
                            </button>
                          </div>

                          {/* Engagement Stats */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span
                                  className="text-xs font-black text-gray-600"
                                  style={{}}
                                >
                                  47
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                                <span
                                  className="text-xs font-black text-gray-600"
                                  style={{}}
                                >
                                  12
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                  />
                                </svg>
                                <span
                                  className="text-xs font-black text-gray-600"
                                  style={{}}
                                >
                                  23
                                </span>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <img
                                className="w-6 h-6 rounded-full"
                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMEMwNEIiLz4KPGB0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkRNIFNhbnMiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BPC90ZXh0Pgo8L3N2Zz4K"
                                alt="Seller"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Side Actions */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
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
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                      <div className="flex items-center justify-around py-3">
                        <div className="flex flex-col items-center space-y-1">
                          <svg
                            className="w-5 h-5"
                            style={{ color: "#00C853" }}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                          </svg>
                          <span
                            className="text-xs font-black"
                            style={{
                              color: "#00C853",
                            }}
                          >
                            Home
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span
                            className="text-xs font-black text-gray-500"
                            style={{}}
                          >
                            Liked
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#00C853" }}
                          >
                            <svg
                              className="w-4 h-4 text-white"
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
                          </div>
                          <span
                            className="text-xs font-black text-gray-500"
                            style={{}}
                          >
                            Create
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span
                            className="text-xs font-black text-gray-500"
                            style={{}}
                          >
                            Inbox
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span
                            className="text-xs font-black text-gray-500"
                            style={{}}
                          >
                            Profile
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Massimo Dutti Style */}
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
