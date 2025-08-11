import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Products() {
  const [items, setItems] = useState([]); // eslint-disable-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Got items:", data);
      setItems(data || []);
    } catch (error) {
      console.error("Error:", error);
      setError("Error loading items: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="skeleton h-8 w-48 mb-2"></div>
              <div className="skeleton h-4 w-96"></div>
            </div>
            <div className="skeleton h-6 w-16"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="group animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-square skeleton mb-4 rounded-xl shimmer-effect"></div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="flex items-center space-x-2">
                    <div className="skeleton h-4 w-12"></div>
                    <div className="skeleton h-3 w-16"></div>
                    <div className="skeleton h-5 w-12 rounded-full"></div>
                  </div>
                  <div className="skeleton h-3 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
  }
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-3xl font-light text-black font-display">
              Eco‑Featured
            </h2>
            <p className="text-sm text-gray-600">
              Pre‑loved pieces that save resources and reduce waste
            </p>
          </div>
          <button className="text-sm text-gray-700 hover:text-brand-600 border-b border-gray-200 hover:border-brand-300 pb-1 transition-all duration-300">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Product Card 1 */}
          <div className="group cursor-pointer card-hover animate-fade-in-up">
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 mb-4 relative overflow-hidden rounded-xl group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-6xl">🧥</div>
              </div>
              <div className="absolute top-3 left-3 pill bg-brand-600 text-white animate-slide-in">
                eco‑choice
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="absolute top-4 right-4 w-8 h-8 backdrop-glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <span className="text-sm text-brand-700 group-hover:animate-wiggle">
                  ♡
                </span>
              </button>

              {/* Quick View Button */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-full bg-white/90 backdrop-blur-sm text-brand-700 py-2 px-4 rounded-full text-xs font-medium hover:bg-white transition-colors">
                  Quick View
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-black group-hover:text-brand-700 transition-colors duration-300 font-medium line-clamp-1">
                Vintage Leather Jacket
              </h3>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-semibold text-black">$89</span>
                <span className="text-xs text-gray-400 line-through">$250</span>
                <span className="pill bg-green-100 text-green-700 animate-pulse-slow">
                  64% off
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Saved ~5kg CO₂e vs. new</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div
            className="group cursor-pointer card-hover animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="aspect-square bg-gradient-to-br from-accent-blue/20 to-brand-100 mb-4 relative overflow-hidden rounded-xl group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-6xl">👗</div>
              </div>
              <div className="absolute top-3 left-3 pill bg-accent-blue text-white animate-slide-in">
                trending
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="absolute top-4 right-4 w-8 h-8 backdrop-glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-blue/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-blue">
                <span className="text-sm text-accent-blue group-hover:animate-wiggle">
                  ♡
                </span>
              </button>

              {/* Quick View Button */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-full bg-white/90 backdrop-blur-sm text-accent-blue py-2 px-4 rounded-full text-xs font-medium hover:bg-white transition-colors">
                  Quick View
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-black group-hover:text-accent-blue transition-colors duration-300 font-medium line-clamp-1">
                Boho Summer Dress
              </h3>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-semibold text-black">$45</span>
                <span className="text-xs text-gray-400 line-through">$120</span>
                <span className="pill bg-accent-blue/10 text-accent-blue animate-pulse-slow">
                  62% off
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Saved ~3kg CO₂e vs. new</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < 5 ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Card 3 */}
          <div
            className="group cursor-pointer card-hover animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="aspect-square bg-gradient-to-br from-accent-teal/20 to-green-100 mb-4 relative overflow-hidden rounded-xl group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-6xl">👟</div>
              </div>
              <div className="absolute top-3 left-3 pill bg-accent-teal text-white animate-slide-in">
                verified
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-accent-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="absolute top-4 right-4 w-8 h-8 backdrop-glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-teal/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-teal">
                <span className="text-sm text-accent-teal group-hover:animate-wiggle">
                  ♡
                </span>
              </button>

              {/* Quick View Button */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-full bg-white/90 backdrop-blur-sm text-accent-teal py-2 px-4 rounded-full text-xs font-medium hover:bg-white transition-colors">
                  Quick View
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-black group-hover:text-accent-teal transition-colors duration-300 font-medium line-clamp-1">
                Designer Sneakers
              </h3>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-semibold text-black">$125</span>
                <span className="text-xs text-gray-400 line-through">$300</span>
                <span className="pill bg-accent-teal/10 text-accent-teal animate-pulse-slow">
                  58% off
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Saved ~7kg CO₂e vs. new</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Card 4 */}
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 mb-4 relative overflow-hidden rounded-xl group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">👜</div>
              </div>
              <div className="absolute top-3 left-3 pill bg-accent-pink text-white">
                limited
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-100 hover:scale-110">
                <span className="text-sm text-pink-700">♡</span>
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-black group-hover:text-pink-700 transition-colors duration-300 font-medium">
                Luxury Handbag
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-black">$280</span>
                <span className="text-xs text-gray-400 line-through">$800</span>
                <span className="pill bg-pink-100 text-pink-700">65% off</span>
              </div>
              <p className="text-xs text-gray-500">Saved ~4kg CO₂e vs. new</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
