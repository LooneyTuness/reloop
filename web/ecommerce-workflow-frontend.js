// E-commerce Workflow Frontend Implementation
// Practical examples for your React components

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@/lib/supabase/supabase.browser";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// 1. Enhanced Product Card with Status Management
const ProductCard = ({ item, onStatusChange }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [isReserved, setIsReserved] = useState(false);
  const [reservationTimeLeft, setReservationTimeLeft] = useState(null);

  // Check if item is reserved
  useEffect(() => {
    if (item.reserved_until) {
      const reservedUntil = new Date(item.reserved_until);
      const now = new Date();

      if (reservedUntil > now) {
        setIsReserved(true);
        const timeLeft = Math.ceil((reservedUntil - now) / 1000 / 60); // minutes
        setReservationTimeLeft(timeLeft);

        // Update countdown every minute
        const interval = setInterval(() => {
          const newTimeLeft = Math.ceil(
            (reservedUntil - new Date()) / 1000 / 60
          );
          if (newTimeLeft <= 0) {
            setIsReserved(false);
            setReservationTimeLeft(null);
            clearInterval(interval);
            onStatusChange?.(); // Refresh product list
          } else {
            setReservationTimeLeft(newTimeLeft);
          }
        }, 60000);

        return () => clearInterval(interval);
      }
    }
  }, [item.reserved_until, onStatusChange]);

  const getStatusBadge = () => {
    switch (item.status) {
      case "active":
        if (item.quantity <= 0) {
          return {
            text: t("outOfStock"),
            className: "bg-red-100 text-red-800",
          };
        }
        if (isReserved) {
          return {
            text: `${t("reserved")} (${reservationTimeLeft}m)`,
            className: "bg-yellow-100 text-yellow-800",
          };
        }
        return {
          text: t("available"),
          className: "bg-green-100 text-green-800",
        };
      case "sold":
        return { text: t("sold"), className: "bg-gray-100 text-gray-800" };
      case "reserved":
        return {
          text: t("reserved"),
          className: "bg-yellow-100 text-yellow-800",
        };
      case "inactive":
        return { text: t("inactive"), className: "bg-gray-100 text-gray-800" };
      default:
        return null;
    }
  };

  const canAddToCart =
    item.status === "active" && item.quantity > 0 && !isReserved;

  // Enhanced Add to Cart with Reservation
  const handleAddToCart = async (item) => {
    try {
      const supabase = createBrowserClient();

      // First, try to reserve the item
      const { data: reserved, error: reserveError } = await supabase.rpc(
        "reserve_item",
        {
          item_uuid: item.id,
          user_uuid: user?.id,
          reserve_minutes: 15,
        }
      );

      if (reserveError) throw reserveError;

      if (!reserved) {
        toast.error(t("itemNotAvailable"));
        return;
      }

      // Add to cart
      await addToCart({
        id: item.id,
        name: item.title,
        price: item.price,
        image_url: item.photos,
        quantity: 1,
      });

      toast.success(t("addedToCart"));

      // Refresh the product list to show updated status
      onStatusChange?.();
    } catch (error) {
      console.error("Error adding to cart:", error);

      // Release reservation if cart add failed
      try {
        const supabase = createBrowserClient();
        await supabase.rpc("release_reservation", {
          item_uuid: item.id,
        });
      } catch (releaseError) {
        console.error("Error releasing reservation:", releaseError);
      }

      toast.error(t("errorAddingToCart"));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={Array.isArray(item.photos) ? item.photos[0] : item.photos}
          alt={item.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge() && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                getStatusBadge().className
              }`}
            >
              {getStatusBadge().text}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-gray-600 mb-2">{item.price} MKD</p>

        {item.quantity > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            {t("quantityAvailable")}: {item.quantity}
          </p>
        )}

        <div className="flex gap-2">
          {canAddToCart ? (
            <button
              onClick={() => handleAddToCart(item)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {t("addToCart")}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
            >
              {isReserved ? t("reserved") : t("notAvailable")}
            </button>
          )}

          <Link
            href={`/products/${item.id}`}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-center"
          >
            {t("viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

// 2. Vendor Order Management Component
const VendorOrderManagement = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendorOrders = useCallback(async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("vendor_orders")
        .select("*")
        .eq("vendor_id", user.id)
        .order("order_date", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVendorOrders();
    }
  }, [user, fetchVendorOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      // Refresh orders list
      await fetchVendorOrders();
      toast.success(t("orderStatusUpdated"));
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(t("failedToUpdateOrder"));
    }
  };

  const markItemAsSold = async (itemId, buyerId) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.rpc("mark_item_sold", {
        item_uuid: itemId,
        buyer_uuid: buyerId,
      });

      if (error) throw error;
      toast.success(t("itemMarkedAsSold"));
    } catch (error) {
      console.error("Error marking item as sold:", error);
      toast.error(t("failedToMarkAsSold"));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("vendorOrders")}</h2>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_item_id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.item_title}</h3>
                  <p className="text-gray-600">Order #{order.order_id}</p>
                  <p className="text-sm text-gray-500">{order.order_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{order.price} MKD</p>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.order_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">{t("buyerInfo")}</h4>
                  <p>
                    <strong>{t("name")}:</strong> {order.order_full_name}
                  </p>
                  <p>
                    <strong>{t("email")}:</strong> {order.order_email}
                  </p>
                  <p>
                    <strong>{t("phone")}:</strong> {order.order_phone}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t("deliveryAddress")}</h4>
                  <p>{order.address_line1}</p>
                  {order.address_line2 && <p>{order.address_line2}</p>}
                  <p>{order.city}</p>
                </div>
              </div>

              {order.order_status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateOrderStatus(order.order_id, "completed")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    {t("markCompleted")}
                  </button>
                  <button
                    onClick={() =>
                      markItemAsSold(order.item_id, order.order_id)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    {t("markAsSold")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Product Status Dashboard for Vendors
const VendorProductDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    sold: 0,
    inactive: 0,
    totalRevenue: 0,
  });

  const fetchVendorProducts = useCallback(async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);

      // Calculate stats
      const activeCount =
        data?.filter((p) => p.status === "active").length || 0;
      const soldCount = data?.filter((p) => p.status === "sold").length || 0;
      const inactiveCount =
        data?.filter((p) => p.status === "inactive").length || 0;
      const totalRevenue =
        data
          ?.filter((p) => p.status === "sold")
          .reduce((sum, p) => sum + p.price, 0) || 0;

      setStats({
        active: activeCount,
        sold: soldCount,
        inactive: inactiveCount,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVendorProducts();
    }
  }, [user, fetchVendorProducts]);

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const supabase = createBrowserClient();
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const { error } = await supabase
        .from("items")
        .update({
          status: newStatus,
          is_active: newStatus === "active",
        })
        .eq("id", productId);

      if (error) throw error;

      await fetchVendorProducts(); // Refresh
      toast.success(
        t(newStatus === "active" ? "itemActivated" : "itemDeactivated")
      );
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(t("failedToUpdateItem"));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("myProducts")}</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("activeProducts")}
          </h3>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("soldProducts")}
          </h3>
          <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("inactiveProducts")}
          </h3>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("totalRevenue")}
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.totalRevenue} MKD
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <Image
              src={
                Array.isArray(product.photos)
                  ? product.photos[0]
                  : product.photos
              }
              alt={product.title}
              width={300}
              height={128}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <h3 className="font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-600 mb-2">{product.price} MKD</p>

            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  product.status === "active"
                    ? "bg-green-100 text-green-800"
                    : product.status === "sold"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.status}
              </span>
              <span className="text-sm text-gray-500">
                Qty: {product.quantity}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => toggleProductStatus(product.id, product.status)}
                className={`w-full px-3 py-2 rounded transition-colors ${
                  product.status === "active"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {product.status === "active" ? t("deactivate") : t("activate")}
              </button>

              {product.status === "sold" && product.sold_at && (
                <p className="text-xs text-gray-500 text-center">
                  {t("soldOn")}:{" "}
                  {new Date(product.sold_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProductCard, VendorOrderManagement, VendorProductDashboard };
