import { getProductsByGender } from "@/lib/dataLoader";
import ProductListing from "@/components/shop/ProductListing";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Men's Fashion" };

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function BoysPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  let products = await getProductsByGender("men");

  if (cat) {
    products = products.filter(
      (p) => p.category === cat || p.tags?.includes(cat)
    );
  }

  return (
    <ProductListing
      products={products}
      title="Men's Fashion"
      subtitle="Shop the latest men's clothing, footwear & accessories"
    />
  );
}
