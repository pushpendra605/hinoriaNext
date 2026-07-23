import { getProductsByGender } from "@/lib/dataLoader";
import ProductListing from "@/components/shop/ProductListing";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Women's Fashion" };

interface Props {
  searchParams: Promise<{ cat?: string; sort?: string; q?: string }>;
}

export default async function GirlsPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  let products = await getProductsByGender("women");

  if (cat) {
    products = products.filter(
      (p) => p.category === cat || p.tags?.includes(cat)
    );
  }

  return (
    <ProductListing
      products={products}
      title="Women's Fashion"
      subtitle="Discover the latest trends in women's clothing, footwear & accessories"
      genderFilter="women"
    />
  );
}
