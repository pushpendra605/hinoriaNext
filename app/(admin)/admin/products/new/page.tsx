import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewProductPage() {
  return (
    <div className="space-y-5">
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ChevronLeft size={16} /> Back to Products
      </Link>
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to add a new product to your catalog.</p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
