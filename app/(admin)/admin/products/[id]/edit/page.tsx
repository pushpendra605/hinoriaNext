'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import type { Product } from '@/types'
import { ChevronLeft } from 'lucide-react'

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [stock, setStock] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${params.id}`).then((r) => { if (!r.ok) throw new Error(); return r.json() }),
      fetch('/api/admin/inventory').then((r) => r.json()),
    ])
      .then(([p, inv]) => {
        setProduct(p)
        const item = inv.find((i: any) => i.productId === params.id)
        setStock(item?.sizes || {})
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <p className="text-sm text-gray-400 py-16 text-center">Loading product...</p>
  }

  if (notFound || !product) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
        <p className="text-sm text-gray-500 mb-4">Product not found.</p>
        <Link href="/admin/products" className="btn-primary text-sm">Back to Products</Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ChevronLeft size={16} /> Back to Products
      </Link>
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm mode="edit" productId={product.id} initialProduct={product} initialStock={stock} />
    </div>
  )
}
