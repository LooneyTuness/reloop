import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Products() {
  const [items, setItems] = useState([]);
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
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
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
          <h2 className="text-3xl font-light text-black">Featured</h2>
          <button className="text-sm text-gray-600 hover:text-purple-600 border-b border-gray-200 hover:border-purple-300 pb-1 transition-all duration-300">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-rose-100 to-indigo-100 mb-4 relative overflow-hidden rounded-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                Image
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-100 hover:scale-110">
                <span className="text-sm text-pink-600">♡</span>
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-black group-hover:text-pink-600 transition-colors duration-300">
                Vintage Leather Jacket
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-black">$89</span>
                <span className="text-xs text-gray-400 line-through">$250</span>
              </div>
              <p className="text-xs text-gray-400">Excellent condition</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
