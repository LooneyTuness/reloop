import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";

export default function HeaderCatalog() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const dropdownRef = useRef(null);

  const handleToggle = () => {
    if (!isOpen) {
      fetchItems();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchItems = async () => {
    // if (items.length > 0) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.log("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Minimalist */}
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-black transition-colors duration-300 rounded-lg hover:bg-gray-50"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>

        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}

          {/* Items List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <HeaderCatalogSkeleton />
            ) : items.length === 0 ? (
              <HeaderCatalogEmpty t={t} />
            ) : (
              <div className="p-2">
                {items.map((item, index) => (
                  <HeaderCatalogItem
                    key={item.id}
                    item={item}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/products";
                }}
                className="w-full text-center text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {t("viewAllItems")} ({items.length}+)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function HeaderCatalogItem({ item, onClick }) {
  console.log("🎨 Rendering item:", item);

  const imageUrl =
    item.photos && item.photos.length > 0
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/items/${item.photos[0]}`
      : null;
  console.log("🔗 Image URL:", imageUrl);
  const handleClick = () => {
    onClick();
    // TODO: Navigate to item detail page
    console.log("View item:", item.title);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      {/* Item Image */}
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            👗
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-600 transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">
            ${item.price}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            eco
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Quick action */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}

// Loading skeleton for dropdown
function HeaderCatalogSkeleton() {
  return (
    <div className="p-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state for dropdown
function HeaderCatalogEmpty({ t }) {
  return (
    <div className="p-6 text-center">
      <div className="text-4xl mb-3">🌱</div>
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        {t("noItemsYet")}
      </h4>
      <p className="text-xs text-gray-600 mb-4">{t("beFirstToList")}</p>
      <button
        onClick={() => (window.location.href = "/sell")}
        className="text-xs px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
      >
        {t("listItem")}
      </button>
    </div>
  );
}
