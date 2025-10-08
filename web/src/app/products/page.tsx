import type { Metadata } from "next";
import Products from "@/components/Products";
import { createServerClient } from "@/lib/supabase/supabase.server";

interface Item {
  id: number;                // bigint maps to number in TS
  created_at: string;        // timestamp with timezone as ISO string
  title: string;
  description: string | null;
  price: number;             // numeric -> number
  photos: string[];          // text[] -> string array
  user_id: string | null;    // uuid as string, nullable
  user_email: string | null;
  category: string;
  size: string | null;
}

export const metadata: Metadata = {
  title: "Products - vtoraraka | Pre-Loved Fashion",
  description: "Browse our curated collection of pre-loved fashion items",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const supabase = await createServerClient();
  const term = (searchParams?.search || "").trim();
  const like = term ? `%${term}%` : undefined;

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });
  if (like) {
    // Search in title or description
    query = query.or(`title.ilike.${like},description.ilike.${like}`);
  }
  const { data: items, error } = await query;

  if (error) {
    console.error(error);
    return <main>Error loading products</main>;
  }

  return (
    <main>
      <Products items={items || []} limit={items?.length ?? 0} />
    </main>
  );
}
