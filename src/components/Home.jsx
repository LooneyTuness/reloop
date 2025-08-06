import Login from "./Login";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl font-light text-black mb-8 leading-tight animate-fade-in">
            <span className="inline-block transform hover:scale-105 transition-transform duration-500">
              Second-hand,
            </span>
            <br />
            <span className="inline-block transform hover:scale-105 transition-transform duration-500 delay-100 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              first choice
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
            Discover carefully curated pre-owned items. Sustainable shopping
            that doesn't compromise on style or quality.
          </p>
          <button className="rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white px-8 py-3 text-sm hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-bounce-subtle">
            Explore Collection
          </button>

          <div className="grid grid-cols-3 gap-16 mt-24 pt-16 border-t border-gray-100">
            <div className="text-center group">
              <div className="text-3xl font-light text-black mb-2 transition-all duration-300 group-hover:text-purple-600 group-hover:scale-110">
                50k+
              </div>
              <div className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                Members
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-light text-black mb-2 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110">
                200k+
              </div>
              <div className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                Items
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-light text-black mb-2 transition-all duration-300 group-hover:text-green-600 group-hover:scale-110">
                85%
              </div>
              <div className="text-sm text-gray-400 group-hover:text-green-400 transition-colors duration-300">
                Waste Reduced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-light text-black mb-4">Categories</h2>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-pink-300 group-hover:to-rose-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  👕
                </span>
              </div>
              <h3 className="text-sm text-gray-600 group-hover:text-pink-600 transition-colors duration-300">
                Clothing
              </h3>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-purple-300 group-hover:to-indigo-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  👜
                </span>
              </div>
              <h3 className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                Bags
              </h3>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-blue-300 group-hover:to-cyan-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  👟
                </span>
              </div>
              <h3 className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                Shoes
              </h3>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-green-300 group-hover:to-emerald-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  ⌚
                </span>
              </div>
              <h3 className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                Watches
              </h3>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-yellow-300 group-hover:to-orange-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  🏠
                </span>
              </div>
              <h3 className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors duration-300">
                Home
              </h3>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-teal-300 group-hover:to-cyan-300">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                  📚
                </span>
              </div>
              <h3 className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors duration-300">
                Books
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="text-3xl font-light text-black mb-16">
            Why choose pre-owned
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="group">
              <div
                className="w-12 h-12 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 
              group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-green-400 group-hover:to-emerald-400"
              >
                <span className="text-white text-lg transform group-hover:rotate-12 transition-transform duration-300">
                  ♻
                </span>
              </div>
              <h3 className="text-lg font-light text-black mb-4 group-hover:text-green-600">
                Sustainable
              </h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Extend the lifecycle of quality items and reduce environmental
                impact.
              </p>
            </div>

            <div className="group">
              <div
                className="w-12 h-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-6 
              group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-purple-400 group-hover:to-pink-400 "
              >
                <span className="text-white text-lg transform group-hover:scale-125 transition-transform duration-300">
                  ✓
                </span>
              </div>
              <h3 className="text-lg font-light text-black mb-4 group-hover:text-purple-600 transition-colors duration-300">
                Quality
              </h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Every item is carefully inspected and authenticated before
                listing.
              </p>
            </div>

            <div className="group">
              <div
                className="w-12 h-12 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full flex items-center justify-center mx-auto mb-6
              group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:from-blue-400 group-hover:to-cyan-400"
              >
                <span className="text-white text-lg transform group-hover:scale-125">
                  $
                </span>
              </div>
              <h3 className="text-lg font-light text-black mb-4 group-hover:text-cyan-500 transition-colors duration-300">
                Value
              </h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Access premium brands and unique pieces at accessible prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 text-justify">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full transition-transform duration-300 group-hover:scale-110"></div>
                <span className="text-xl font-light text-black transition-colors duration-300 group-hover:text-purple-600">
                  Reloop
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Making sustainable shopping accessible through carefully curated
                pre-owned items.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-black mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-pink-600 transition-colors duration-300"
                  >
                    All Items
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors duration-300"
                  >
                    Clothing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Accessories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-black mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-pink-600 transition-colors duration-300"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors duration-300"
                  >
                    Shipping
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-black mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-pink-600 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors duration-300"
                  >
                    Sustainability
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors duration-300"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 text-center">
            <p className="text-xs text-gray-400">
              &copy; 2025 Reloop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
