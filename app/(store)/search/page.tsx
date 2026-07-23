import { searchProducts } from "@/lib/dataLoader";
import ProductListing from "@/components/shop/ProductListing";
import type { Metadata } from "next";
interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: "${q}"` : "Search" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {query ? (
        <ProductListing
          products={results}
          title={`Search results for "${query}"`}
          subtitle={`${results.length} products found`}
        />
      ) : (
        <div className="text-center py-16">
          <h1 className="page-title mb-4">Search Products</h1>
          <p className="text-gray-500">Enter a search term to find products</p>
        </div>
      )}
    </div>
  );
}
