'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product, InventoryItem } from '@/types'
import { Search, Save, AlertTriangle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('All')
  const [editing, setEditing] = useState<Record<string, Record<string, number>>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/admin/products').then((r) => r.json()),
      fetch('/api/admin/inventory').then((r) => r.json()),
    ]).then(([p, i]) => { setProducts(p); setInventory(i) }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const invFor = (productId: string) => inventory.find((i) => i.productId === productId)

  const rows = useMemo(() => {
    return products
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => {
        const inv = invFor(p.id)
        const available = inv?.available ?? 0
        if (stockFilter === 'out') return available === 0
        if (stockFilter === 'low') return available > 0 && available <= 5
        if (stockFilter === 'in') return available > 5
        return true
      })
  }, [products, inventory, search, stockFilter])

  const getSizeValue = (productId: string, size: string) => {
    if (editing[productId]?.[size] !== undefined) return editing[productId][size]
    return invFor(productId)?.sizes?.[size] ?? 0
  }

  const setSizeValue = (productId: string, size: string, value: number) => {
    setEditing((prev) => ({ ...prev, [productId]: { ...prev[productId], [size]: value } }))
  }

  const hasChanges = (productId: string) => !!editing[productId]

  const handleSave = async (product: Product) => {
    setSavingId(product.id)
    try {
      const sizes: Record<string, number> = {}
      product.sizes.forEach((sz) => { sizes[sz] = getSizeValue(product.id, sz) })
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, sizes }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setInventory((prev) => {
        const next = prev.filter((i) => i.productId !== product.id)
        return [...next, data.inventory]
      })
      setEditing((prev) => { const n = { ...prev }; delete n[product.id]; return n })
      toast.success(`Stock updated for ${product.name}`)
    } catch {
      toast.error('Failed to update stock')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Inventory</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage stock levels across all products.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9 !py-2 text-sm" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'All', label: 'All' },
            { key: 'in', label: 'In Stock' },
            { key: 'low', label: 'Low Stock' },
            { key: 'out', label: 'Out of Stock' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStockFilter(key)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors"
              style={stockFilter === key
                ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                : { borderColor: '#e5e7eb', color: '#6b7280' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-16 text-center">Loading inventory...</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <p className="text-sm text-gray-500">No products match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((p) => {
            const inv = invFor(p.id)
            const available = inv?.available ?? 0
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <img src={p.thumbnail} alt={p.name} className="w-11 h-11 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.id}</p>
                  </div>
                  {available === 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full"><AlertTriangle size={12} /> Out of Stock</span>
                  ) : available <= 5 ? (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Low Stock</span>
                  ) : (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{available} Available</span>
                  )}
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  {p.sizes.map((sz) => (
                    <div key={sz} className="w-20">
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">{sz}</label>
                      <input
                        type="number" min={0}
                        className="form-input !py-1.5 text-sm"
                        value={getSizeValue(p.id, sz)}
                        onChange={(e) => setSizeValue(p.id, sz, Number(e.target.value))}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleSave(p)}
                    disabled={!hasChanges(p.id) || savingId === p.id}
                    className="btn-primary !py-2 text-xs disabled:opacity-40"
                  >
                    {savingId === p.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
