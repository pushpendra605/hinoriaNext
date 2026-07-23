'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Product, InventoryItem } from '@/types'
import { Plus, Search, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-50 text-green-600',
  draft: 'bg-gray-100 text-gray-500',
  pending: 'bg-amber-50 text-amber-600',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')

  const load = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/inventory').then(r => r.json()),
    ]).then(([p, i]) => { setProducts(p); setInventory(i) }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const stockFor = (productId: string) => inventory.find(i => i.productId === productId)?.available ?? 0

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))).sort(), [products])

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'All' && (p.status || 'published') !== statusFilter) return false
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false
    const stock = stockFor(p.id)
    if (stockFilter === 'out' && stock !== 0) return false
    if (stockFilter === 'low' && !(stock > 0 && stock <= 5)) return false
    if (stockFilter === 'in' && stock <= 5) return false
    return true
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Product deleted')
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } else {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9 !py-2 text-sm" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input !py-2 text-sm w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
        </select>
        <select className="form-input !py-2 text-sm w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-input !py-2 text-sm w-auto" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="All">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock (≤5)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <p className="text-sm text-gray-400 py-16 text-center">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-16 text-center">No products match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const stock = stockFor(p.id)
                  return (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.thumbnail} alt={p.name} className="w-11 h-11 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[220px]">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">₹{p.finalPrice}</span>
                        {p.discountPercent > 0 && <span className="text-xs text-gray-400 line-through ml-1.5">₹{p.price}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {stock === 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"><AlertTriangle size={12} /> Out of stock</span>
                        ) : stock <= 5 ? (
                          <span className="text-xs font-semibold text-amber-600">{stock} left</span>
                        ) : (
                          <span className="text-xs text-gray-500">{stock} in stock</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[p.status || 'published']}`}>
                          {p.status || 'published'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                            <Pencil size={15} />
                          </Link>
                          <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
