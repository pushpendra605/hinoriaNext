import { getProductsByCategory } from '@/lib/dataLoader'
import ProductListing from '@/components/shop/ProductListing'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bags & Accessories' }

export default async function BagsPage() {
  const products = await getProductsByCategory('backpacks')
  return <ProductListing products={products} title="Bags & Accessories" subtitle="Backpacks, handbags, luggage & more" />
}
