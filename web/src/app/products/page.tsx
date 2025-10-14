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
  const supabase = createServerClient();
  const term = typeof searchParams?.search === "string" ? searchParams.search.trim() : "";
  const like = term ? `%${term}%` : undefined;

  let query = (await supabase)
    .from("items" as any)
    .select("*")
    .or("and(status.eq.active,quantity.gt.0),and(is_active.eq.true,status.is.null)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (like) {
    query = query.or(`(title.ilike.${like}),(description.ilike.${like})`);
  }

  const { data: items, error } = await query;

  if (error) {
    return <main>Error loading products</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50bg-gray-900">
      {/* Single Products Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-gray-50bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Products items={(items as any) || []} limit={items?.length ?? 0} searchTerm={term} showViewAllButton={false} compact={true} />
        </div>
      </section>
    </main>
  );
}
