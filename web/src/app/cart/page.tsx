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
    
    // Check if user is authenticated
    if (!user) {
      alert("Please sign in to place an order");
      return;
    }

    try {
      setSubmitting(true);
      
      // First, get the seller information for the items in the cart
      const itemIds = cart.map(item => item.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('id, user_id')
        .in('id', itemIds);
      
      if (itemsError) throw itemsError;
      if (!itemsData || itemsData.length === 0) throw new Error("Could not find item information");
      
      // Get the seller_id from the first item (assuming all items are from the same seller for simplicity)
      const sellerId = (itemsData as Array<{ id: string; user_id: string }>)[0]?.user_id;
      if (!sellerId) throw new Error("Could not determine seller");
      
      // Debug logging
      console.log("Order creation debug:", {
        userId: user?.id,
        userObject: user,
        sellerId: sellerId,
        total: total,
        checkout: checkout
      });
      
      // Double-check user authentication
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log("Current user from auth:", currentUser);
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // 1) Create order
      const { data: orderData, error: orderError } = await (
        supabase as unknown as {
          from: (table: string) => {
            insert: (
              rows: Array<{
                user_id?: string | null;
                buyer_id?: string | null;
                seller_id?: string | null;
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
            user_id: currentUser.id,
            buyer_id: currentUser.id,
            seller_id: sellerId,
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
      const { error: orderItemsError } = await (
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
      if (orderItemsError) throw orderItemsError;

      // 3) Create notifications for sellers (vendors) whose items were ordered
      try {
        // Get seller information for each item in the cart
        const itemIds = cart.map(item => item.id);
        const { data: sellerData, error: sellerError } = await (
          supabase as unknown as {
            from: (table: string) => {
              select: (cols: string) => {
                in: (
                  col: string,
                  vals: (string | number)[]
                ) => Promise<{
                  data: Array<{ id: string | number; user_id: string | null; title: string }> | null;
                  error: { message: string } | null;
                }>;
              };
            };
          }
        )
          .from("items")
          .select("id,user_id,title")
          .in("id", itemIds);

        if (sellerError) {
          console.error("Error fetching seller data:", sellerError);
        } else if (sellerData) {
          // Group items by seller
          const sellerNotifications = new Map<string, { items: string[], sellerId: string }>();
          
          sellerData.forEach(item => {
            if (item.user_id) {
              const existing = sellerNotifications.get(item.user_id) || { items: [], sellerId: item.user_id };
              existing.items.push(item.title);
              sellerNotifications.set(item.user_id, existing);
            }
          });

          // Create notifications for each seller
          const notificationPromises = Array.from(sellerNotifications.values()).map(seller => {
            return (
              supabase as unknown as {
                from: (table: string) => {
                  insert: (
                    rows: Array<{
                      user_id: string;
                      type: string;
                      title: string;
                      message: string;
                      order_id: string;
                      item_name: string;
                      order_date: string;
                    }>
                  ) => Promise<{ error: { message: string } | null }>;
                };
              }
            )
              .from("notifications")
              .insert([
                {
                  user_id: seller.sellerId,
                  type: "order",
                  title: t("orderConfirmation"),
                  message: t("orderConfirmationMessage").replace("{orderId}", orderData.id.toString()),
                  order_id: orderData.id.toString(),
                  item_name: seller.items.join(", "),
                  order_date: new Date().toISOString(),
                },
              ]);
          });

          const notificationResults = await Promise.allSettled(notificationPromises);
          const notificationErrors = notificationResults.filter(result => result.status === 'rejected');
          
          if (notificationErrors.length > 0) {
          }
        }
      } catch (error) {
      }

      // 4) Notify seller(s) using items.user_email from DB
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:pt-28">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 animate-pulse"
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
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 h-fit space-y-4">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 sm:pt-36 text-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("cartEmpty")}</h1>
            <p className="text-gray-600 mb-8 text-lg">
              {t("cartEmptyDescription")}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24 sm:pt-32">
        <h1 
          className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {t("cart")}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
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
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]"
                >
                  {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4">
                    <div className="flex items-center gap-3 xs:gap-4 w-full xs:w-auto">
                      <div className="relative flex-shrink-0">
                        <img
                          src={imageSrc || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                        />
                        <div className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 
                          className="font-bold text-sm xs:text-base sm:text-lg text-gray-900 tracking-tight mb-1 line-clamp-2"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {item.name}
                        </h2>
                        <p 
                          className="text-gray-600 text-xs xs:text-sm tracking-wide"
                          style={{ fontFamily: "var(--font-poppins)" }}
                        >
                          {item.quantity} x {item.price.toLocaleString()} {t("currency")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between xs:justify-end gap-2 xs:gap-4 w-full xs:w-auto">
                      <span className="font-bold text-lg xs:text-xl text-gray-900 whitespace-nowrap">
                        {(item.quantity * item.price).toLocaleString()} {t("currency")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1.5 xs:px-4 xs:py-2 text-red-600 border border-red-200 rounded-lg xs:rounded-xl hover:bg-red-50 transition-all duration-300 hover:scale-105 transform font-medium text-xs xs:text-sm"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Summary card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 p-4 sm:p-6 h-fit sticky top-4 sm:top-6">
            <h2 
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight"
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
          {/* Enhanced Checkout details */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {t("shippingDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Full Name - Required */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fullName")} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("fullName")}
                  value={checkout.full_name}
                  onChange={(e) =>
                    setCheckout({ ...checkout, full_name: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* Email - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("email")}
                  value={checkout.email}
                  onChange={(e) =>
                    setCheckout({ ...checkout, email: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* Phone - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("phone")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("phone")}
                  value={checkout.phone}
                  onChange={(e) =>
                    setCheckout({ ...checkout, phone: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* City - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("city")} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("city")}
                  value={checkout.city}
                  onChange={(e) =>
                    setCheckout({ ...checkout, city: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* Address - Required */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("address")} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("address")}
                  value={checkout.address_line1}
                  onChange={(e) =>
                    setCheckout({ ...checkout, address_line1: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* Additional Address - Optional */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("additionalAddress")} <span className="text-gray-400 text-xs">({t("optional")})</span>
                </label>
                <input
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("additionalAddress")}
                  value={checkout.address_line2}
                  onChange={(e) =>
                    setCheckout({ ...checkout, address_line2: e.target.value })
                  }
                />
              </div>
              
              {/* Postal Code - Required */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("postalCode")} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder={t("postalCode")}
                  value={checkout.postal_code}
                  onChange={(e) =>
                    setCheckout({ ...checkout, postal_code: e.target.value })
                  }
                  required
                />
              </div>
              
              {/* Notes - Optional */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("notes")} <span className="text-gray-400 text-xs">({t("optional")})</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder={t("notes")}
                  value={checkout.notes}
                  onChange={(e) =>
                    setCheckout({ ...checkout, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              {t("dataUsageNote")}
            </p>
          </div>

          {/* Trust Badges Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-green-200">
            <div className="text-center mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                {t("secureCheckout")}
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-2xl">
                  <img 
                    src="/images/verified-ecommerce-badge.png" 
                    alt="Verified E-commerce" 
                    className="h-12 sm:h-14 lg:h-16 w-auto"
                  />
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-2xl">
                  <img 
                    src="/images/wbe-logo.webp" 
                    alt="WBE Logo" 
                    className="h-12 sm:h-14 lg:h-16 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 sm:mt-6 pt-4 sm:pt-6 flex justify-between items-center">
            <span className="text-lg sm:text-xl font-bold text-gray-900">{t("total")}</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {total.toLocaleString()} {t("currency")}
            </span>
          </div>
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <button
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="tracking-wide">
                {submitting ? t("processing") : t("completeOrder")}
              </span>
              {!submitting && (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
              href="/catalog"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white text-gray-900 border border-gray-200 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="tracking-wide">{t("continueShopping")}</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-red-600 border border-red-200 rounded-lg sm:rounded-xl hover:bg-red-50 transition-all duration-300 font-medium text-sm sm:text-base"
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
