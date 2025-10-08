"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total, loading } = useCart();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
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
      // 6) Notify and redirect
      toast.success(t("orderCreated"), {
        duration: 8000,
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="border rounded-lg p-6 h-fit space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Allow guest users to view and checkout

  if (cart.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("cartEmpty")}</h1>
        <p className="text-gray-600 mb-6">
          {t("cartEmptyDescription")}
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:opacity-90"
        >
          {t("startShopping")}
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">{t("cart")}</h1>
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
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={imageSrc || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} x {item.price.toLocaleString()} {t("currency")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold whitespace-nowrap">
                    {(item.quantity * item.price).toLocaleString()} {t("currency")}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary card */}
        <div className="border rounded-xl p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4">{t("orderSummary")}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-medium">{total.toLocaleString()} {t("currency")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("shipping")}</span>
              <span className="font-medium">{t("shippingCalculated")}</span>
            </div>
          </div>
          {/* Checkout details */}
          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="border rounded px-3 py-2 col-span-2"
                placeholder={t("fullName")}
                value={checkout.full_name}
                onChange={(e) =>
                  setCheckout({ ...checkout, full_name: e.target.value })
                }
              />
              <input
                className="border rounded px-3 py-2"
                placeholder={t("email")}
                value={checkout.email}
                onChange={(e) =>
                  setCheckout({ ...checkout, email: e.target.value })
                }
              />
              <input
                className="border rounded px-3 py-2"
                placeholder={t("phone")}
                value={checkout.phone}
                onChange={(e) =>
                  setCheckout({ ...checkout, phone: e.target.value })
                }
              />
              <input
                className="border rounded px-3 py-2"
                placeholder={t("city")}
                value={checkout.city}
                onChange={(e) =>
                  setCheckout({ ...checkout, city: e.target.value })
                }
              />
              <input
                className="border rounded px-3 py-2 col-span-2"
                placeholder={t("address")}
                value={checkout.address_line1}
                onChange={(e) =>
                  setCheckout({ ...checkout, address_line1: e.target.value })
                }
              />
              <input
                className="border rounded px-3 py-2 col-span-2"
                placeholder={t("additionalAddress")}
                value={checkout.address_line2}
                onChange={(e) =>
                  setCheckout({ ...checkout, address_line2: e.target.value })
                }
              />
              <input
                className="border rounded px-3 py-2 col-span-2"
                placeholder={t("postalCode")}
                value={checkout.postal_code}
                onChange={(e) =>
                  setCheckout({ ...checkout, postal_code: e.target.value })
                }
              />
              <textarea
                className="border rounded px-3 py-2 col-span-2"
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
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">{t("total")}</span>
            <span className="text-lg font-bold">
              {total.toLocaleString()} {t("currency")}
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <button
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:opacity-90 disabled:opacity-60"
            >
              {submitting
                ? t("processing")
                : t("completeOrder")}
            </button>
            <Link
              href="/products"
              className="block w-full text-center px-6 py-3 border rounded-lg hover:bg-gray-50"
            >
              {t("continueShopping")}
            </Link>
            <button
              onClick={clearCart}
              className="w-full px-6 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              {t("clearCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
