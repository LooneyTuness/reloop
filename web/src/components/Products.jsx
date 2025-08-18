import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";

export default function Products() {
  const [items, setItems] = useState([]); // eslint-disable-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="h-8 bg-gray-200 w-56 mb-4 animate-pulse"></div>
              <div className="h-5 bg-gray-100 w-80 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 w-20 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] bg-gray-100 mb-6 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 w-3/4 animate-pulse"></div>
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 w-20 animate-pulse"></div>
                  </div>
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
    <div className="max-w-7xl mx-auto px-8">
      <div className="flex justify-between items-center mb-16">
        <div>
          <p className="text-sm text-gray-600 font-light uppercase tracking-widest">
            {t("preLoved")}
          </p>
        </div>
        <button className="text-sm text-black hover:text-gray-600 border-b border-black hover:border-gray-600 pb-1 transition-all duration-300 font-light">
          {t("viewAll")} →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Product Card 1 - Massimo Dutti Style */}
        <div className="group cursor-pointer">
          <div className="aspect-[4/5] bg-gray-100 mb-6 relative overflow-hidden group-hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-50">🧥</div>
            </div>

            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Heart Icon */}
            <button className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 shadow-sm">
              <span className="text-lg text-gray-600">♡</span>
            </button>

            {/* Quick View Button */}
            <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button className="w-full bg-black text-white py-3 px-6 text-sm font-light hover:bg-gray-900 transition-all duration-300">
                {t("quickView")}
              </button>
            </div>

            {/* Sustainability Badge */}
            <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 text-xs font-light">
              ♻ Eco-Friendly
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg text-black group-hover:text-gray-600 transition-colors duration-300 font-light">
              Vintage Leather Jacket
            </h3>
            <p className="text-sm text-gray-500 font-light">
              Pre-loved • Excellent condition
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-black font-light text-lg">€89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
