import {
  getProductById,
  getReviewsByProduct,
  getInventoryByProduct,
  getPublishedProducts,
} from "@/lib/dataLoader";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import ProductCard from "@/components/shop/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  return {
    title: product?.name ?? "Product",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product || product.status === "draft") notFound();

  const [reviews, inventory, allProducts] = await Promise.all([
    getReviewsByProduct(product.id),
    getInventoryByProduct(product.id),
    getPublishedProducts(),
  ]);

  const related = allProducts
    .filter((p) => p.gender === product.gender && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductDetailClient
        product={product}
        reviews={reviews}
        inventory={inventory}
      />

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="section-heading text-left mb-6">You May Also Like</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
