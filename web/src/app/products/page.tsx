import type { Metadata } from "next";
import Products from "@/components/Products";
import { createServerClient } from "@/lib/supabase/supabase.server";

export const metadata: Metadata = {
  title: "Products - vtoraraka | Pre-Loved Fashion",
  description: "Browse our curated collection of pre-loved fashion items",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createServerClient();
  const term = typeof searchParams?.search === "string" ? searchParams.search.trim() : "";
  const like = term ? `%${term}%` : undefined;

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (like) {
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
