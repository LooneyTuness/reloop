import { useState, useEffect } from "react";
import Products from "./Products";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const trendingSearches =
    language === "mk"
      ? [
          "Винтаж Левис 501",
          "Шанел Класична Торба",
          "Еколошки Патики",
          "Артизански Накит",
          "Рециклиран Деним",
          "Дизајнерски Торби",
          "Винтаж Фустани",
          "Еколошки Спортска Облека",
        ]
      : [
          "Vintage Levi's 501",
          "Chanel Classic Flap",
          "Sustainable Sneakers",
          "Artisan Jewelry",
          "Upcycled Denim",
          "Designer Bags",
          "Vintage Dresses",
          "Eco-Friendly Activewear",
        ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gray-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gray-50 rounded-full opacity-40"></div>
      </div>

      {/* Floating Action Button */}
      <div className="group">
        <button
          onClick={() => (window.location.href = "/sell")}
          className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 hover:scale-105 z-50"
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

      {/* Hero Section - Massimo Dutti Style */}
      <section className="relative min-h-screen flex items-center text-left">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Elegant Typography */}
            <div
              className={`space-y-12 transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="space-y-8">
                {/* Elegant Badge */}
                <div className="inline-flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-none text-xs font-light tracking-widest uppercase">
                  <span>
                    {language === "mk" ? "Кружна Мода" : "Circular Fashion"}
                  </span>
                </div>

                {/* Massimo Dutti Style Typography */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-light text-black leading-tight tracking-wide">
                    <span className="font-light">
                      {language === "mk" ? "Пре-Сакана" : "Pre-Loved"}
                    </span>
                    <br />
                    <span className="font-normal">
                      {language === "mk" ? "Мода" : "Fashion"}
                    </span>
                    <br />
                    <span className="font-light text-gray-600 text-3xl lg:text-4xl">
                      {language === "mk" ? "Редефинирана" : "Redefined"}
                    </span>
                  </h1>
                </div>

                {/* Elegant Description */}
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg font-light">
                    {language === "mk"
                      ? "Откријте уникатни парчиња со карактер, продавајте лесно."
                      : "Discover unique pieces with character, sell effortlessly."}
                    <span className="text-black font-normal block mt-2">
                      {language === "mk"
                        ? "Иднината на модата е кружна и свесна."
                        : "The future of fashion is circular & conscious."}
                    </span>
                  </p>
                </div>
              </div>

              {/* Refined CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-8 py-4 rounded-none font-light tracking-wide hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-sm uppercase">
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
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <button className="border border-gray-300 text-black px-8 py-4 rounded-none font-light tracking-wide hover:border-black transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 text-sm uppercase">
                  <span>
                    {language === "mk"
                      ? "Продај Ги Твоите Парчиња"
                      : "Sell Your Items"}
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
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>

              {/* Minimalist Search */}
              <div className="relative max-w-lg">
                <div className="relative">
                  <input
                    type="search"
                    placeholder={
                      language === "mk"
                        ? "Пребарај винтаж брендови, дизајнерски парчиња..."
                        : "Search vintage brands, designer pieces..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSearchSuggestions(false), 200)
                    }
                    className="w-full px-6 py-4 border border-gray-200 rounded-none bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-300 text-sm placeholder-gray-400 font-light"
                  />
                  <button className="absolute right-4 top-4 w-6 h-6 text-gray-400 hover:text-black transition-colors duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Clean Search Suggestions */}
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 overflow-hidden z-50">
                    <div className="p-6">
                      <div className="text-xs font-light text-gray-400 mb-4 uppercase tracking-widest">
                        {language === "mk"
                          ? "Трендови во Пребарување"
                          : "Trending Searches"}
                      </div>
                      <div className="space-y-3">
                        {trendingSearches.map((suggestion, i) => (
                          <button
                            key={i}
                            className="w-full text-left py-2 text-gray-700 hover:text-black transition-colors duration-200 border-b border-gray-50 last:border-0 font-light"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSearchSuggestions(false);
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Visual - Minimalist Hero Image */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative group">
                {/* Main Image Container */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src="/images/hero-sustainable-fashion2.jpg.jpg"
                    alt={
                      language === "mk"
                        ? "Еколошка Мода - Модерен Второработен Стил"
                        : "Sustainable Fashion - Modern Second-Hand Style"
                    }
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    onLoad={() => console.log("Image loaded successfully")}
                  />

                  {/* Fallback */}
                  <div
                    className="w-full h-full flex items-center justify-center relative"
                    style={{ display: "none" }}
                  >
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">♻</span>
                      </div>
                      <p className="text-gray-600 font-light text-lg">
                        {language === "mk"
                          ? "Кружна Економија"
                          : "Circular Economy"}
                      </p>
                      <p className="text-gray-400 text-sm font-light">
                        {language === "mk"
                          ? "Мода што трае"
                          : "Fashion that lasts"}
                      </p>
                    </div>
                  </div>

                  {/* Minimal Overlays */}
                  <div className="absolute inset-0 bg-black/10"></div>

                  {/* Mission Statement */}
                  <div className="absolute top-8 left-8 max-w-xs">
                    <div className="bg-white/90 backdrop-blur-sm p-6">
                      <p className="text-black text-sm leading-relaxed font-light">
                        {language === "mk"
                          ? "Нашата мисија е да револуционираме консумирање на мода со создавање одржлив пазар каде што секое парче има приказна и секоја купувачка прави разлика."
                          : "Our mission is to revolutionize fashion consumption by creating a sustainable marketplace where every piece has a story and every purchase makes a difference."}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-black/80 backdrop-blur-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white text-xl font-light tracking-wide mb-1">
                            {language === "mk"
                              ? "ОДРЖЛИВА МОДА"
                              : "SUSTAINABLE FASHION"}
                          </h3>
                          <p className="text-white/80 text-sm uppercase tracking-widest font-light">
                            {language === "mk"
                              ? "Кружно Движење за Облека"
                              : "Circular Clothing Movement"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-white">♻</div>
                          <div className="text-xs text-white/70 uppercase tracking-widest font-light">
                            {language === "mk" ? "Еколошки" : "Eco-Friendly"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              <span className="text-sm font-light uppercase tracking-widest text-gray-600">
                {language === "mk"
                  ? "Пре-сакана Колекција"
                  : "Pre-Loved Collection"}
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-light text-black mb-6 tracking-wide">
              <span className="font-light">
                {language === "mk" ? "Откриј" : "Discover"}
              </span>{" "}
              <span className="font-normal">
                {language === "mk" ? "Уникатни Парчиња" : "Unique Pieces"}
              </span>
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              {language === "mk"
                ? "Курирана мода што заштедува ресурси и намалува отпад."
                : "Curated fashion that saves resources and reduces waste."}{" "}
              <span className="text-black font-normal">
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
