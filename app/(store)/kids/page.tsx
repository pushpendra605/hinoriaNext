import { getPublishedProducts } from "@/lib/dataLoader";
import ProductListing from "@/components/shop/ProductListing";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kids' Fashion" };

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function KidsPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  let products = await getPublishedProducts();

  products = products.filter(
    (p) => p.gender === "kids" || p.tags?.includes("kids")
  );

  if (products.length === 0) {
    const all = await getPublishedProducts();
    products = all.slice(0, 8).map((p) => ({ ...p, gender: "kids" as const }));
  }

  if (cat) {
    products = products.filter((p) => p.category === cat);
  }

  return (
    <ProductListing
      products={products}
      title="Kids' Fashion"
      subtitle="Trendy, comfortable & fun clothing for little ones"
    />
  );
}
