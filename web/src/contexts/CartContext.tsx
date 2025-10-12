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
  isInCart: (id: string | number) => boolean;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState<boolean>(false);

  // Hydrate from localStorage once on mount (supports anonymous users and avoids empty state on navigation)
  useEffect(() => {
    if (hasLoadedFromStorage) {
      return; // Prevent multiple loads
    }
    
    try {
      const raw = localStorage.getItem("cart:v1");
      if (raw && raw !== "[]") { // Don't load empty arrays
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }
      setHasLoadedFromStorage(true);
    } catch {
      setHasLoadedFromStorage(true);
    }
  }, [hasLoadedFromStorage]);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(cart));
    } catch {
      // Handle localStorage error silently
    }
  }, [cart]);

  // Track previous user state to detect logout vs initial load
  const [prevUser, setPrevUser] = useState<typeof user | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Clear cart only when user explicitly logs out (not on initial load)
  useEffect(() => {
    if (!hasInitialized) {
      setPrevUser(user);
      setHasInitialized(true);
      return;
    }
    
    // Clear cart if user logged out
    if (prevUser && !user) {
      setCart([]);
    }
    
    // SECURITY: Clear anonymous cart when user logs in to prevent merging
    if (!prevUser && user) {
      setCart([]);
    }
    
    setPrevUser(user);
  }, [user, prevUser, hasInitialized]);

  // If user is logged in, sync cart with Supabase (SECURITY: don't merge anonymous cart)
  useEffect(() => {
    const sync = async () => {
      if (!user) {
        return; // keep local cart for guests - don't clear it
      }
      
      setLoading(true);
      
      // Fetch server cart first
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
      
      if (error) {
        setLoading(false);
        return;
      }

      const serverCart = data as CartRow[] || [];
      
      const serverCartItems = serverCart.map((row) => ({
        id: row.item_id,
        name: row.name,
        price: row.price,
        quantity: row.quantity,
        image_url: row.image_url ?? undefined,
      }));

      // SECURITY: Always use server cart only when user is logged in
      // Don't merge anonymous cart to prevent security issues
      setCart(serverCartItems);
      const finalCart = serverCartItems;

      // Sync cart back to server (only if there are items to sync)
      const cartToSync = finalCart;
      if (cartToSync.length > 0) {
        const payload = cartToSync.map((i) => ({
          user_id: user.id,
          item_id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image_url: i.image_url ?? null,
        }));
        
        const { error: upsertError } = await (
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
          
        if (upsertError) {
          // Handle sync error silently
        }
      }
      
      setLoading(false);
    };
    sync();
    // Only re-run when user changes
  }, [user]);

  const addToCart = async (item: CartItem) => {
    // Optimistic update + immediate localStorage persist to survive route transitions
    setCart((prev) => {
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
      
      // Update localStorage immediately
      try {
        localStorage.setItem("cart:v1", JSON.stringify(nextCart));
      } catch {
        // Handle localStorage error silently
      }
      
      return nextCart;
    });

    if (!user) {
      return; // anonymous user keeps local cart only
    }

    // Check if user exists in auth.users before proceeding
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      throw error;
    }

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
        // Revert the optimistic update on error
        setCart((prev) => {
          const reverted = prev.filter((i) => i.id !== item.id);
          try {
            localStorage.setItem("cart:v1", JSON.stringify(reverted));
          } catch {}
          return reverted;
        });
        throw error; // Re-throw to be caught by calling component
      }
    } catch (error) {
      // Revert the optimistic update on error
      setCart((prev) => {
        const reverted = prev.filter((i) => i.id !== item.id);
        try {
          localStorage.setItem("cart:v1", JSON.stringify(reverted));
        } catch {}
        return reverted;
      });
      throw error; // Re-throw to be caught by calling component
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

  const isInCart = (id: string | number) => {
    return cart.some((item) => item.id === id);
  };

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, isInCart, total, loading }}
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
