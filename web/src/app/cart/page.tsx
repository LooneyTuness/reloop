"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";
import MagicLinkSignupModal from "@/components/MagicLinkSignupModal";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total, loading } = useCart();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [checkout, setCheckout] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    notes: "",
  });

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
    // Redirect to home after closing modal
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handlePlaceOrder = async () => {
    if (submitting) return;
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      // 1) Create order
      const { data: orderData, error: orderError } = await (
        supabase as unknown as {
          from: (table: string) => {
            insert: (
              rows: Array<{
                user_id?: string | null;
                total_amount: number;
                payment_method: string;
                status: string;
                full_name?: string;
                email?: string;
                phone?: string;
                address_line1?: string;
                address_line2?: string;
                city?: string;
                postal_code?: string;
                notes?: string;
              }>
            ) => {
              select: () => {
                single: () => Promise<{
                  data: { id: number } | null;
                  error: { message: string } | null;
                }>;
              };
            };
          };
        }
      )
        .from("orders")
        .insert([
          {
            user_id: user ? user.id : null,
            total_amount: total,
            payment_method: "cash_on_delivery",
            status: "pending",
            full_name: checkout.full_name,
            email: checkout.email,
            phone: checkout.phone,
            address_line1: checkout.address_line1,
            address_line2: checkout.address_line2,
            city: checkout.city,
            postal_code: checkout.postal_code,
            notes: checkout.notes,
          },
        ])
        .select()
        .single();
      if (orderError) throw orderError;
      if (!orderData) throw new Error("Order creation failed");

      // 2) Create order items
      const orderItems = cart.map((i) => ({
        order_id: orderData.id,
        item_id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image_url: Array.isArray(i.image_url)
          ? (i.image_url[0] as unknown as string)
          : typeof i.image_url === "string"
          ? i.image_url
          : null,
      }));
      const { error: itemsError } = await (
        supabase as unknown as {
          from: (table: string) => {
            insert: (
              rows: Array<{
                order_id: number;
                item_id: string | number;
                name: string;
                price: number;
                quantity: number;
                image_url: string | null;
              }>
            ) => Promise<{ error: { message: string } | null }>;
          };
        }
      )
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw itemsError;

      // 3) Notify seller(s) using items.user_email from DB
      try {
        const ids = cart.map((c) => c.id);
        const { data: sellerRows } = await (
          supabase as unknown as {
            from: (table: string) => {
              select: (cols: string) => {
                in: (
                  col: string,
                  vals: (string | number)[]
                ) => Promise<{
                  data:
                    | { id: string | number; user_email: string | null }[]
                    | null;
                }>;
              };
            };
          }
        )
          .from("items")
          .select("id,user_email")
          .in("id", ids as (string | number)[]);

        const idToEmail = new Map<string | number, string>();
        (sellerRows || []).forEach((r) => {
          if (r.user_email) idToEmail.set(r.id, r.user_email);
        });

        const emailToItems = new Map<
          string,
          { name: string; quantity: number; price: number }[]
        >();
        cart.forEach((c) => {
          const email = idToEmail.get(c.id);
          if (!email) return;
          const arr = emailToItems.get(email) || [];
          arr.push({ name: c.name, quantity: c.quantity, price: c.price });
          emailToItems.set(email, arr);
        });

        const sellerNotificationResults = await Promise.allSettled(
          Array.from(emailToItems.entries()).map(
            ([sellerEmail, itemsForSeller]) =>
              fetch("/api/orders/notify-sellers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sellerEmail,
                  items: itemsForSeller,
                  orderId: orderData.id,
                  buyerName: checkout.full_name,
                  totalAmount: total,
                  language: language,
                }),
              })
          )
        );

        // Check for seller notification failures
        const sellerFailures = sellerNotificationResults.filter(result => result.status === 'rejected');
        if (sellerFailures.length > 0) {
          console.warn("Some seller notifications failed:", sellerFailures);
        }
      } catch (e) {
        console.warn("Failed to notify seller(s)", e);
      }

      // 4) Notify buyer with order confirmation
      try {
        const buyerNotificationResult = await fetch("/api/orders/notify-buyer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyerEmail: checkout.email,
            buyerName: checkout.full_name,
            items: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            orderId: orderData.id,
            totalAmount: total,
            shippingAddress: {
              full_name: checkout.full_name,
              address_line1: checkout.address_line1,
              address_line2: checkout.address_line2,
              city: checkout.city,
              postal_code: checkout.postal_code,
              phone: checkout.phone,
            },
            language: language,
          }),
        });

        if (!buyerNotificationResult.ok) {
          const errorData = await buyerNotificationResult.json();
          console.warn("Buyer notification failed:", errorData);
        }
      } catch (e) {
        console.warn("Failed to notify buyer", e);
      }

      // 5) Clear cart (both local and server)
      await clearCart();
      // 6) Notify and show signup modal for non-authenticated users
      toast.success(t("orderCreated"), {
        duration: 8000,
      });
      
      // Show magic link signup modal for non-authenticated users
      if (!user) {
        setShowSignupModal(true);
      } else {
        // Redirect authenticated users immediately
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to place order", err);
      alert(t("orderError"));
    } finally {
      setSubmitting(false);
    }
  };

  // Prevent back navigation when on cart (optional; mild UX guard)
  // Users can still navigate via links
  if (typeof window !== "undefined") {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    // Register once per mount
    window.removeEventListener("popstate", handlePopState);
    window.addEventListener("popstate", handlePopState);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="professional-card p-4 animate-pulse"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="professional-card p-6 h-fit space-y-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Allow guest users to view and checkout

  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="professional-card p-12 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t("cartEmpty")}</h1>
            <p className="text-gray-600 mb-8">
              {t("cartEmptyDescription")}
            </p>
            <Link
              href="/products"
              className="hero-primary-button inline-flex items-center justify-center gap-2"
            >
              <span className="tracking-wide">{t("startShopping")}</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 
          className="text-3xl font-black text-gray-900 mb-8 tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {t("cart")}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              // Normalize possible shapes: string URL, array of URLs, or JSON stringified array
              let imageSrc: string | undefined;
              if (Array.isArray(item.image_url)) {
                imageSrc = (item.image_url[0] as unknown as string) || undefined;
              } else if (typeof item.image_url === "string") {
                // Try to parse JSON array first
                try {
                  const parsed = JSON.parse(item.image_url as string);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    imageSrc = parsed[0];
                  } else {
                    imageSrc = item.image_url;
                  }
                } catch {
                  imageSrc = item.image_url;
                }
              }
              return (
                <div
                  key={item.id}
                  className="professional-card p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={imageSrc || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h2 
                          className="font-black text-lg text-gray-900 tracking-tight"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {item.name}
                        </h2>
                        <p 
                          className="text-gray-600 text-sm tracking-wide"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {item.quantity} x {item.price.toLocaleString()} {t("currency")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-gray-900 whitespace-nowrap">
                        {(item.quantity * item.price).toLocaleString()} {t("currency")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 hover:scale-105 transform"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary card */}
          <div className="professional-card p-6 h-fit sticky top-6">
          <h2 
            className="text-xl font-black text-gray-900 mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {t("orderSummary")}
          </h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-semibold text-gray-900">{total.toLocaleString()} {t("currency")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("shipping")}</span>
              <span className="font-semibold text-gray-900">{t("shippingCalculated")}</span>
            </div>
          </div>
          {/* Checkout details */}
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="professional-input col-span-2"
                placeholder={t("fullName")}
                value={checkout.full_name}
                onChange={(e) =>
                  setCheckout({ ...checkout, full_name: e.target.value })
                }
              />
              <input
                className="professional-input"
                placeholder={t("email")}
                value={checkout.email}
                onChange={(e) =>
                  setCheckout({ ...checkout, email: e.target.value })
                }
              />
              <input
                className="professional-input"
                placeholder={t("phone")}
                value={checkout.phone}
                onChange={(e) =>
                  setCheckout({ ...checkout, phone: e.target.value })
                }
              />
              <input
                className="professional-input"
                placeholder={t("city")}
                value={checkout.city}
                onChange={(e) =>
                  setCheckout({ ...checkout, city: e.target.value })
                }
              />
              <input
                className="professional-input col-span-2"
                placeholder={t("address")}
                value={checkout.address_line1}
                onChange={(e) =>
                  setCheckout({ ...checkout, address_line1: e.target.value })
                }
              />
              <input
                className="professional-input col-span-2"
                placeholder={t("additionalAddress")}
                value={checkout.address_line2}
                onChange={(e) =>
                  setCheckout({ ...checkout, address_line2: e.target.value })
                }
              />
              <input
                className="professional-input col-span-2"
                placeholder={t("postalCode")}
                value={checkout.postal_code}
                onChange={(e) =>
                  setCheckout({ ...checkout, postal_code: e.target.value })
                }
              />
              <textarea
                className="professional-input col-span-2"
                placeholder={t("notes")}
                value={checkout.notes}
                onChange={(e) =>
                  setCheckout({ ...checkout, notes: e.target.value })
                }
              />
            </div>
            <p className="text-gray-500 text-xs">
              {t("dataUsageNote")}
            </p>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">{t("total")}</span>
            <span className="text-lg font-bold text-gray-900">
              {total.toLocaleString()} {t("currency")}
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <button
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="hero-primary-button w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="tracking-wide">
                {submitting ? t("processing") : t("completeOrder")}
              </span>
              {!submitting && (
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </button>
            <Link
              href="/products"
              className="hero-secondary-button w-full flex items-center justify-center gap-2"
            >
              <span className="tracking-wide">{t("continueShopping")}</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <button
              onClick={clearCart}
              className="w-full px-6 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              {t("clearCart")}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Magic Link Signup Modal */}
      <MagicLinkSignupModal
        isOpen={showSignupModal}
        onClose={handleCloseSignupModal}
        buyerEmail={checkout.email}
        buyerName={checkout.full_name}
      />
    </div>
  );
}
