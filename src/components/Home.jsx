import { useState, useEffect } from "react";
import Catalog from "./Catalog";

export default function Home() {
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Show welcome toast after a short delay
    const timer = setTimeout(() => {
      setShowWelcomeToast(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Welcome Toast */}
      {showWelcomeToast && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in">
          <div className="backdrop-glass border border-brand-200 rounded-2xl p-4 shadow-xl max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 brand-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">🌱</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Welcome to Reloop!
                </h4>
                <p className="text-xs text-gray-600">
                  Join 50k+ eco-warriors saving the planet through sustainable
                  fashion.
                </p>
              </div>
              <button
                onClick={() => setShowWelcomeToast(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Floating Action Button */}
      <div className="group">
        <button
          onClick={() => (window.location.href = "/sell")}
          className="btn-floating group"
        >
          <svg
            className="w-6 h-6 text-white group-hover:animate-wiggle"
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
        <div className="fixed bottom-20 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
          <div className="text-white font-medium">Sell Item</div>
          <div className="text-gray-300 text-[10px]">Earn & help planet</div>
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900 transform translate-y-full"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-28 hero-gradient relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Product Images */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg transform rotate-12 animate-float">
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-4xl">👗</div>
            </div>
          </div>
          <div
            className="absolute top-40 right-16 w-24 h-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg transform -rotate-6 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-brand-100 rounded-2xl flex items-center justify-center">
              <div className="text-3xl">👟</div>
            </div>
          </div>
          <div
            className="absolute bottom-32 left-20 w-28 h-28 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg transform rotate-6 animate-float"
            style={{ animationDelay: "4s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-accent-teal/20 to-green-100 rounded-2xl flex items-center justify-center">
              <div className="text-3xl">👜</div>
            </div>
          </div>

          {/* Bottom Right Element - Similar to reference */}
          <div
            className="absolute bottom-16 right-16 w-36 h-36 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg transform rotate-12 animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-accent-teal/20 to-brand-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
              <div className="text-5xl">🌱</div>
              <div className="absolute top-3 left-3 pill bg-brand-600 text-white text-[10px]">
                eco-impact
              </div>
            </div>
          </div>

          {/* Subtle Decorative Shapes */}
          <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-brand-200/30 rounded-full opacity-40 animate-pulse"></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-accent-blue/20 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/3 left-1/4 w-6 h-6 bg-accent-teal/30 rounded-full opacity-40 animate-ping"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="heading-xl mb-8 animate-fade-in">
            <span className="inline-block transform hover:scale-105 transition-transform duration-500">
              Buy & Sell Pre-Loved Fashion
            </span>
            <br />
            <span className="inline-block transform hover:scale-105 transition-transform duration-500 delay-100 text-gradient">
              in Minutes, Not Hours
            </span>
          </h1>
          <p
            className="body-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Skip the hassle of traditional resale. List items instantly,
            discover unique pieces effortlessly, and make money from your
            closet.
            <span className="font-semibold text-gray-800">
              {" "}
              Start free — no credit card required.
            </span>
          </p>

          {/* Enhanced CTA with search preview */}
          <div
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <button className="button-primary">
              Start Selling & Shopping Free
            </button>

            {/* Enhanced Quick Search Bar */}
            <div className="max-w-md mx-auto relative">
              <input
                type="search"
                placeholder="Quick search: vintage, dresses, shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchSuggestions(false), 200)
                }
                className="w-full px-6 py-4 rounded-full border border-brand-200 bg-white/80 backdrop-blur-sm 
                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent 
                          transition-all duration-300 text-sm"
              />
              <button className="absolute right-2 top-2 w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white transition-transform hover:scale-105">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-brand-100 overflow-hidden animate-fade-in-up z-50">
                  <div className="p-4">
                    <div className="text-xs font-medium text-gray-500 mb-3">
                      Popular searches
                    </div>
                    <div className="space-y-2">
                      {[
                        "Vintage leather jackets",
                        "Designer dresses",
                        "Sustainable shoes",
                        "Eco-friendly bags",
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors duration-200 text-sm text-gray-700 flex items-center space-x-3"
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
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
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-brand-50 to-accent-blue/10 px-4 py-3 border-t border-brand-100">
                    <div className="text-xs text-brand-600 font-medium">
                      🌱 Every search helps reduce fashion waste
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-16 mt-20 pt-12 border-t border-brand-100">
            <div className="text-center group">
              <div className="text-3xl font-light text-black mb-2 transition-all duration-300 group-hover:text-emerald-600 group-hover:scale-110">
                50k+
              </div>
              <div className="text-sm text-gray-400 group-hover:text-emerald-400 transition-colors duration-300">
                Conscious Members
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-light text-black mb-2 transition-all duration-300 group-hover:text-green-600 group-hover:scale-110">
                200k+
              </div>
              <div className="text-sm text-gray-400 group-hover:text-green-400 transition-colors duration-300">
                Items Re‑loved
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-light text-black mb-2 transition-all duration-300 group-hover:text-lime-600 group-hover:scale-110">
                85%
              </div>
              <div className="text-sm text-gray-400 group-hover:text-lime-500 transition-colors duration-300">
                Waste Reduced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Second-Hand Matters - Gen-Z Section */}
      <section className="py-24 bg-gradient-to-br from-brand-50/50 via-white to-accent-blue/10 relative overflow-hidden">
        {/* Background Visual Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-accent-teal/30 to-green-300/30 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-brand-300/30 to-accent-blue/30 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-lg animate-pulse-slow"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-100 to-accent-blue/20 px-6 py-3 rounded-full mb-6 animate-fade-in">
              <span className="text-2xl">🌍</span>
              <span className="text-sm font-medium text-brand-700">
                Real Talk
              </span>
            </div>
            <h2
              className="heading-lg mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Why Your Fashion Choices Actually Matter
            </h2>
            <p
              className="body-lg text-gray-600 max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Let's be real - fast fashion is literally destroying our planet.
              But here's the plot twist:
              <span className="text-gradient font-semibold">
                {" "}
                your closet can be the main character in saving it
              </span>
              .
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Stat Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="text-4xl mb-4">💥</div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  2,700L
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  water to make ONE cotton t-shirt
                </div>
                <div className="text-xs text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full">
                  That's 18 bathtubs full!
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="text-4xl mb-4">🗑️</div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  92M
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  tons of clothing waste yearly
                </div>
                <div className="text-xs text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-full">
                  Enough to fill NYC!
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="text-4xl mb-4">✨</div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  70%
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  less CO₂ when you buy pre-loved
                </div>
                <div className="text-xs text-green-500 font-medium bg-green-50 px-3 py-1 rounded-full">
                  You're literally a hero!
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-accent-blue rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">💸</span>
                </div>
                <div>
                  <h3 className="heading-sm text-black mb-2 group-hover:text-brand-600 transition-colors">
                    Your wallet will thank you
                  </h3>
                  <p className="body-md text-gray-600">
                    Designer pieces at 60-80% off? That's not just sustainable,
                    that's smart AF. More money for experiences, less for
                    landfills.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-teal to-green-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">🎨</span>
                </div>
                <div>
                  <h3 className="heading-sm text-black mb-2 group-hover:text-accent-teal transition-colors">
                    Unique style, zero copying
                  </h3>
                  <p className="body-md text-gray-600">
                    Find one-of-a-kind vintage pieces that nobody else has.
                    Stand out from the fast fashion crowd and express your
                    actual personality.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">🌱</span>
                </div>
                <div>
                  <h3 className="heading-sm text-black mb-2 group-hover:text-purple-600 transition-colors">
                    Planet-friendly flex
                  </h3>
                  <p className="body-md text-gray-600">
                    Every pre-loved purchase is literally saving the planet.
                    Post that environmental impact story - your followers will
                    respect the consciousness.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-brand-100 via-accent-blue/20 to-accent-teal/20 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-dashed border-brand-300 rounded-2xl"></div>
                <div className="text-center z-10">
                  <div className="text-6xl mb-4">🔄</div>
                  <div className="heading-md text-brand-700 mb-2">
                    Circular Fashion
                  </div>
                  <div className="body-sm text-brand-600">
                    One person's "meh" is your new favorite outfit
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-6 left-6 w-6 h-6 bg-accent-blue rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-white rounded-full p-2 shadow-lg border border-brand-100">
              <button className="button-primary">
                Start Your Sustainable Journey
              </button>
              <button className="px-6 py-3 text-brand-700 hover:text-brand-800 transition-colors text-sm font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Gamification Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full animate-float"></div>
          <div
            className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-blue-300/40 to-cyan-300/40 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6 animate-fade-in">
              <span className="text-2xl">👥</span>
              <span className="text-sm font-medium text-purple-700">
                Community Vibes
              </span>
            </div>
            <h2
              className="heading-lg mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Join 50k+ Eco Warriors Making Waves
            </h2>
            <p
              className="body-lg text-gray-600 max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Be part of the coolest sustainable fashion movement. Share your
              finds, earn rewards, and flex your eco-impact.
            </p>
          </div>

          {/* Live Community Feed */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="heading-md mb-8 text-center">
                Live Community Feed
              </h3>
              <div className="space-y-4">
                {/* Community Post 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          @sarah_vintage
                        </span>
                        <span className="pill bg-purple-100 text-purple-700">
                          Eco Warrior
                        </span>
                        <span className="text-xs text-gray-500">2m ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Just scored this amazing vintage leather jacket! 🔥
                        Saved 8.5kg CO₂ vs buying new
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-red-500">❤️</span>
                          <span className="text-xs text-gray-500">47</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-brand-500">💬</span>
                          <span className="text-xs text-gray-500">12</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">🌱</span>
                          <span className="text-xs text-green-600 font-medium">
                            +50 eco points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community Post 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          @mike_sustain
                        </span>
                        <span className="pill bg-blue-100 text-blue-700">
                          Planet Hero
                        </span>
                        <span className="text-xs text-gray-500">8m ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Challenge completed! 🎯 Bought 5 pre-loved items this
                        month. Who's joining the #30DayEcoChallenge?
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-red-500">❤️</span>
                          <span className="text-xs text-gray-500">89</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-brand-500">💬</span>
                          <span className="text-xs text-gray-500">23</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">🏆</span>
                          <span className="text-xs text-green-600 font-medium">
                            Badge unlocked!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community Post 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          @anna_preloved
                        </span>
                        <span className="pill bg-green-100 text-green-700">
                          Style Icon
                        </span>
                        <span className="text-xs text-gray-500">15m ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        This designer dress was $20 instead of $300! 💅
                        Sustainable fashion = smart fashion
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-red-500">❤️</span>
                          <span className="text-xs text-gray-500">156</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-brand-500">💬</span>
                          <span className="text-xs text-gray-500">34</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">✨</span>
                          <span className="text-xs text-yellow-600 font-medium">
                            Trending post!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamification Dashboard */}
            <div>
              <h3 className="heading-md mb-8 text-center">Your Eco Impact</h3>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-brand-100">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-400 via-accent-blue to-accent-teal rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <span className="text-2xl text-white">👑</span>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-900">
                        7
                      </span>
                    </div>
                  </div>
                  <div className="heading-sm text-gray-900 mb-2">
                    Eco Level 7
                  </div>
                  <div className="body-sm text-gray-600">
                    Fashion Sustainability Expert
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      CO₂ Saved
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      142.5kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-3/4"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Items Saved
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      23 pieces
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full w-4/5"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Money Saved
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      $1,847
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-5/6"></div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">🌱</span>
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      Eco Warrior
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">💎</span>
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      Vintage Hunter
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      Goal Crusher
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-full p-2 shadow-lg border border-purple-100">
              <button className="button-primary">Join Community</button>
              <button className="px-6 py-3 text-purple-700 hover:text-purple-800 transition-colors text-sm font-medium">
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Gen-Z Vibes */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full mb-6 animate-fade-in">
              <span className="text-2xl">🤔</span>
              <span className="text-sm font-medium text-orange-700">
                FAQ That Hits Different
              </span>
            </div>
            <h2
              className="heading-lg mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Questions? We Got Answers
            </h2>
            <p
              className="body-lg text-gray-600 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Everything you're wondering about sustainable fashion, answered
              with zero BS.
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300 floating-card">
              <h3 className="heading-sm text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mr-4 text-brand-600 font-bold">
                  Q
                </span>
                Is buying second-hand actually better for the environment?
              </h3>
              <div className="ml-12">
                <p className="body-md text-gray-600 mb-4">
                  <strong>Short answer:</strong> Yes, absolutely!{" "}
                  <strong>Long answer:</strong> Every pre-loved item you buy
                  prevents a new item from being manufactured, which saves
                  massive amounts of water, energy, and reduces CO₂ emissions by
                  up to 70%.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="pill bg-green-100 text-green-700">
                    💧 2,700L water saved per t-shirt
                  </span>
                  <span className="pill bg-blue-100 text-blue-700">
                    ⚡ 70% less energy
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300 floating-card">
              <h3 className="heading-sm text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 text-purple-600 font-bold">
                  Q
                </span>
                How do I know if something is good quality when buying online?
              </h3>
              <div className="ml-12">
                <p className="body-md text-gray-600 mb-4">
                  We get it - you can't touch and feel the fabric through your
                  screen! That's why we have detailed photos, condition ratings,
                  and honest descriptions from sellers. Plus, our community
                  reviews keep everyone accountable.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="pill bg-purple-100 text-purple-700">
                    📸 Multiple angles
                  </span>
                  <span className="pill bg-pink-100 text-pink-700">
                    ⭐ Community verified
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300 floating-card">
              <h3 className="heading-sm text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-accent-blue/20 rounded-full flex items-center justify-center mr-4 text-accent-blue font-bold">
                  Q
                </span>
                What if I don't like what I bought?
              </h3>
              <div className="ml-12">
                <p className="body-md text-gray-600 mb-4">
                  No stress! We have a 7-day return policy for most items. But
                  honestly, our users love what they get - we have a 96%
                  satisfaction rate because our community knows what's good.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="pill bg-green-100 text-green-700">
                    ✅ 7-day returns
                  </span>
                  <span className="pill bg-blue-100 text-blue-700">
                    😍 96% satisfaction
                  </span>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300 floating-card">
              <h3 className="heading-sm text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-accent-teal/20 rounded-full flex items-center justify-center mr-4 text-accent-teal font-bold">
                  Q
                </span>
                Can I actually make money selling my old clothes?
              </h3>
              <div className="ml-12">
                <p className="body-md text-gray-600 mb-4">
                  For sure! Our top sellers make $200-500/month just from
                  clearing out their closets. Designer pieces, vintage finds,
                  and barely-worn items do especially well. It's like Marie
                  Kondo meets side hustle.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="pill bg-yellow-100 text-yellow-700">
                    💰 $200-500/month potential
                  </span>
                  <span className="pill bg-green-100 text-green-700">
                    🎯 Easy setup
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="body-md text-gray-600 mb-8">
              Still have questions? Our community is here to help!
            </p>
            <button className="button-primary magnetic-button">
              Join the Community
            </button>
          </div>
        </div>
      </section>

      {/* Redesigned Footer - Optimized Layout */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-brand-50/50 via-white to-accent-blue/10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-brand-100/40 to-accent-blue/20 rounded-full blur-2xl animate-float"></div>
          <div
            className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-accent-teal/20 to-green-200/30 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-lg animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          {/* Newsletter CTA - Prominent placement */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-br from-white to-brand-50/50 rounded-3xl p-8 border border-brand-200 shadow-xl max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Stay in the Loop
              </h3>
              <p className="text-gray-600 mb-6">
                Get sustainable fashion updates, early access to drops, and
                eco-tips
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                />
                <button className="w-full px-6 py-3 brand-gradient rounded-xl text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                  Join 50k+ Eco Warriors
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                No spam, just planet-friendly updates ✨
              </p>
            </div>
          </div>

          {/* Main Footer Navigation */}
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8 mb-12">
            {/* Brand Section - Compact */}
            <div className="lg:col-span-1 md:col-span-3">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reloop</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Circular Fashion Platform
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Making sustainable fashion{" "}
                <span className="text-gradient font-medium">the new cool</span>
              </p>

              {/* Compact Stats */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="text-center">
                  <div className="font-bold text-accent-teal">142.5k</div>
                  <div className="text-gray-500">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-accent-blue">50k+</div>
                  <div className="text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-500">89%</div>
                  <div className="text-gray-500">Love Rate</div>
                </div>
              </div>
            </div>

            {/* Shop Navigation */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">Shop</h4>
              <ul className="space-y-3">
                {[
                  "Trending Now",
                  "Vintage Finds",
                  "Designer Steals",
                  "Eco Essentials",
                  "Local Drops",
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm hover:underline decoration-brand-300 underline-offset-2"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sell & Earn */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                Sell & Earn
              </h4>
              <ul className="space-y-3">
                {[
                  "Start Selling",
                  "Seller Guide",
                  "Pricing Tips",
                  "Success Stories",
                  "Payout Info",
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm hover:underline decoration-brand-300 underline-offset-2"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community & Impact */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                Community
              </h4>
              <ul className="space-y-3">
                {[
                  "Join Community",
                  "Carbon Calculator",
                  "Sustainability Report",
                  "Eco Education",
                  "Brand Partnerships",
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm hover:underline decoration-brand-300 underline-offset-2"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Size Guide",
                  "Returns & Refunds",
                  "Contact Us",
                  "Safety Tips",
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm hover:underline decoration-brand-300 underline-offset-2"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-brand-200/60 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Copyright & Legal */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <p className="text-gray-600 text-sm text-center sm:text-left">
                  © 2025 Reloop.{" "}
                  <span className="text-gradient font-medium">
                    Buy less, choose well, make it last.
                  </span>
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors hover:underline"
                  >
                    Privacy
                  </a>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors hover:underline"
                  >
                    Terms
                  </a>
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors hover:underline"
                  >
                    Cookies
                  </a>
                </div>
              </div>

              {/* Social Links - Better spacing */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <span className="text-gray-600 text-sm font-medium">
                  Follow the movement:
                </span>
                <div className="flex space-x-3">
                  {[
                    {
                      name: "Instagram",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ),
                    },
                    {
                      name: "TikTok",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.365-1.958-1.423-3.096h-3.59v14.555c0 1.41-1.135 2.545-2.545 2.545-1.41 0-2.545-1.135-2.545-2.545 0-1.41 1.135-2.545 2.545-2.545.294 0 .576.05.84.143V9.691c-.264-.036-.534-.054-.807-.054C6.59 9.637 3 13.227 3 17.753s3.59 8.116 8.116 8.116c4.526 0 8.116-3.59 8.116-8.116V11.32a9.626 9.626 0 005.768 1.905v-3.672c0-.018-.015-.033-.033-.033a6.251 6.251 0 01-5.646-3.958z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Discord",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Twitter",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      ),
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 bg-white/70 hover:bg-white/95 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-300 border border-brand-200 hover:border-brand-300 shadow-sm hover:shadow-md hover:scale-110"
                      title={social.name}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Planet Love Badge */}
          </div>
        </div>
      </footer>
    </div>
  );
}
