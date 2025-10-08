"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

type CartRow = {
  item_id: string | number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hydrate from localStorage once on mount (supports anonymous users and avoids empty state on navigation)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {}
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // If user is logged in, sync cart with Supabase (merge local → server, then refresh)
  useEffect(() => {
    const sync = async () => {
      if (!user) return; // keep local cart for guests
      setLoading(true);
      // Merge local cart into server
      if (cart.length > 0) {
        const payload = cart.map((i) => ({
          user_id: user.id,
          item_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image_url: i.image_url ?? null,
        }));
        await (
          supabase as unknown as {
            from: (table: string) => {
              upsert: (
                values: CartRow[],
                options?: { onConflict?: string }
              ) => Promise<{ error: { message: string } | null }>;
            };
          }
        )
          .from("cart_items")
          .upsert(payload as unknown as CartRow[], {
            onConflict: "user_id,item_id",
          });
      }

      // Fetch server cart
      const { data, error } = await (
        supabase as unknown as {
          from: (table: string) => {
            select: (cols: string) => {
              eq: (
                col: string,
                val: string
              ) => Promise<{
                data: CartRow[] | null;
                error: { message: string } | null;
              }>;
            };
          };
        }
      )
        .from("cart_items")
        .select("item_id,name,price,quantity,image_url")
        .eq("user_id", user.id);
      if (!error && data) {
        const rows = data as CartRow[];
        setCart(
          rows.map((row) => ({
            id: row.item_id,
            name: row.name,
            price: row.price,
            quantity: row.quantity,
            image_url: row.image_url ?? undefined,
          }))
        );
      }
      setLoading(false);
    };
    sync();
    // Only re-run when user changes; use local cart snapshot on first login to merge
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (item: CartItem) => {
    console.log("Adding to cart:", item);
    // Optimistic update + immediate localStorage persist to survive route transitions
    setCart((prev) => {
      console.log("Previous cart state:", prev);
      const existing = prev.find((i) => i.id === item.id);
      let nextCart: CartItem[];
      
      if (existing) {
        nextCart = prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        nextCart = [...prev, { ...item, quantity: item.quantity || 1 }];
      }
      
      console.log("New cart state:", nextCart);
      
      // Update localStorage immediately
      try {
        localStorage.setItem("cart:v1", JSON.stringify(nextCart));
      } catch {}
      
      return nextCart;
    });

    if (!user) return; // anonymous user keeps local cart only

    // Upsert to Supabase
    const payload = {
      user_id: user.id,
      item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image_url: item.image_url ?? null,
    };
    
    try {
      const { error } = await (
        supabase as unknown as {
          from: (table: string) => {
            upsert: (
              values: CartRow[],
              options?: { onConflict?: string }
            ) => Promise<{ error: { message: string } | null }>;
          };
        }
      )
        .from("cart_items")
        .upsert([payload], { onConflict: "user_id,item_id" });
        
      if (error) {
        console.error("Error adding to cart:", error);
        // Revert the optimistic update on error
        setCart((prev) => {
          const reverted = prev.filter((i) => i.id !== item.id);
          try {
            localStorage.setItem("cart:v1", JSON.stringify(reverted));
          } catch {}
          return reverted;
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Revert the optimistic update on error
      setCart((prev) => {
        const reverted = prev.filter((i) => i.id !== item.id);
        try {
          localStorage.setItem("cart:v1", JSON.stringify(reverted));
        } catch {}
        return reverted;
      });
    }
  };

  const removeFromCart = async (id: string | number) => {
    // Optimistic remove
    setCart((prev) => prev.filter((i) => i.id !== id));
    if (!user) return;
    await (
      supabase as unknown as {
        from: (table: string) => {
          delete: () => {
            eq: (
              col: string,
              val: string | number
            ) => {
              eq: (
                col: string,
                val: string | number
              ) => Promise<{ error: { message: string } | null }>;
            };
          };
        };
      }
    )
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("item_id", id);
  };

  const clearCart = async () => {
    setCart([]);
    if (!user) return;
    await (
      supabase as unknown as {
        from: (table: string) => {
          delete: () => {
            eq: (
              col: string,
              val: string
            ) => Promise<{ error: { message: string } | null }>;
          };
        };
      }
    )
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);
  };

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
