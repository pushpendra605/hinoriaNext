'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWishlistStore } from '@/lib/store'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/products?ids=${wishlistIds.join(',')}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [wishlistIds])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">My Wishlist</h1>
        <p className="text-gray-500 text-sm mt-1">Products you've saved for later.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-10 text-center">Loading wishlist...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <Heart size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link href="/" className="btn-primary text-sm">Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
