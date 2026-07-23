'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Category } from '@/types'
import { Upload, X, Loader2, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const GENDERS = ['women', 'men', 'kids', 'unisex']
const STATUSES = ['published', 'draft', 'pending'] as const

interface Props {
  mode: 'create' | 'edit'
  productId?: string
  initialProduct?: Product
  initialStock?: Record<string, number>
}

export default function ProductForm({ mode, productId, initialProduct, initialStock }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price?.toString() || '',
    discountPercent: initialProduct?.discountPercent?.toString() || '0',
    category: initialProduct?.category || '',
    gender: initialProduct?.gender || 'women',
    color: initialProduct?.color || '',
    material: initialProduct?.material || '',
    brand: initialProduct?.brand || 'Henoria',
    features: initialProduct?.features?.join('\n') || '',
    tags: initialProduct?.tags?.join(', ') || '',
    sizes: initialProduct?.sizes || ([] as string[]),
    images: initialProduct?.images || ([] as string[]),
    status: initialProduct?.status || 'draft',
    isFeatured: initialProduct?.isFeatured || false,
    isNewArrival: initialProduct?.isNewArrival ?? true,
    isTrending: initialProduct?.isTrending || false,
    modelHeight: initialProduct?.modelInfo?.height || '',
    modelBust: initialProduct?.modelInfo?.bust || '',
    modelWaist: initialProduct?.modelInfo?.waist || '',
    modelHips: initialProduct?.modelInfo?.hips || '',
    modelSize: initialProduct?.modelInfo?.size || '',
  })

  const [stock, setStock] = useState<Record<string, number>>(initialStock || {})

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
  }, [])

  const filteredCategories = categories.filter(c => c.gender === form.gender || c.gender === 'unisex')

  const toggleSize = (size: string) => {
    setForm((f) => {
      const has = f.sizes.includes(size)
      const sizes = has ? f.sizes.filter((s) => s !== size) : [...f.sizes, size]
      if (!has) setStock((s) => ({ ...s, [size]: s[size] ?? 0 }))
      return { ...f, sizes }
    })
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.success) {
          setForm((f) => ({ ...f, images: [...f.images, data.url] }))
        } else {
          toast.error(data.message || 'Upload failed')
        }
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }))
  }

  const finalPrice = Math.round(
    (Number(form.price) || 0) - ((Number(form.price) || 0) * (Number(form.discountPercent) || 0)) / 100
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) {
      toast.error('Name, category and price are required')
      return
    }
    if (form.images.length === 0) {
      toast.error('Please add at least one product image')
      return
    }
    if (form.sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        price: Number(form.price),
        discountPercent: Number(form.discountPercent),
        category: form.category,
        gender: form.gender,
        color: form.color,
        material: form.material,
        brand: form.brand,
        features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        sizes: form.sizes,
        images: form.images,
        status: form.status,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isTrending: form.isTrending,
        modelInfo: form.modelHeight || form.modelBust
          ? { height: form.modelHeight, bust: form.modelBust, waist: form.modelWaist, hips: form.modelHips, size: form.modelSize }
          : undefined,
      }

      let savedProductId = productId
      if (mode === 'create') {
        const res = await fetch('/api/admin/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message)
        savedProductId = data.product.id
      } else {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message)
      }

      // Save inventory (stock per size)
      if (savedProductId && Object.keys(stock).length > 0) {
        await fetch('/api/admin/inventory', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: savedProductId, sizes: stock }),
        })
      }

      toast.success(mode === 'create' ? 'Product created successfully' : 'Product updated successfully')
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
              <input required className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Floral Wrap Midi Dress" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea rows={4} className="form-input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Detailed product description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand</label>
                <input className="form-input" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Color</label>
                <input className="form-input" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} placeholder="e.g. Black, Rust Orange" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fabric / Material</label>
              <input className="form-input" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} placeholder="e.g. 100% Cotton, Georgette" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Features (one per line)</label>
              <textarea rows={3} className="form-input" value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder={'Machine washable\nRegular fit\nRound neck'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (comma separated)</label>
              <input className="form-input" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="summer, casual, ethnic" />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900">Product Images *</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.images.map((img) => (
                <div key={img} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                <span className="text-[10px] font-medium">{uploading ? 'Uploading...' : 'Add Image'}</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFileUpload(e.target.files)} />
            <p className="text-[11px] text-gray-400">First image becomes the thumbnail. JPG/PNG/WEBP, max 5MB each.</p>
          </div>

          {/* Model Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900">Model Info (optional)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <input className="form-input !py-2 text-sm" placeholder="Height" value={form.modelHeight} onChange={(e) => setForm((f) => ({ ...f, modelHeight: e.target.value }))} />
              <input className="form-input !py-2 text-sm" placeholder="Bust" value={form.modelBust} onChange={(e) => setForm((f) => ({ ...f, modelBust: e.target.value }))} />
              <input className="form-input !py-2 text-sm" placeholder="Waist" value={form.modelWaist} onChange={(e) => setForm((f) => ({ ...f, modelWaist: e.target.value }))} />
              <input className="form-input !py-2 text-sm" placeholder="Hips" value={form.modelHips} onChange={(e) => setForm((f) => ({ ...f, modelHips: e.target.value }))} />
              <input className="form-input !py-2 text-sm" placeholder="Wearing Size" value={form.modelSize} onChange={(e) => setForm((f) => ({ ...f, modelSize: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900">Pricing</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹) *</label>
              <input required type="number" min={0} className="form-input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount (%)</label>
              <input type="number" min={0} max={90} className="form-input" value={form.discountPercent} onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-sm">
              <span className="text-gray-500">Final Price</span>
              <span className="font-bold text-gray-900">₹{finalPrice || 0}</span>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900">Organization</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender / Section *</label>
              <select className="form-input" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as any, category: '' }))}>
                {GENDERS.map((g) => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
              <select required className="form-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="">Select category</option>
                {filteredCategories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">Don't see the right category? <a href="/admin/categories" className="underline" style={{ color: 'var(--color-primary)' }}>Add a new one</a>.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Publish Status *</label>
              <select className="form-input" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Sizes & Stock */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900">Sizes & Stock *</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className="w-10 h-10 rounded-lg text-xs font-semibold border-2 transition-colors"
                  style={form.sizes.includes(sz)
                    ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                    : { borderColor: '#e5e7eb', color: '#6b7280' }}
                >
                  {sz}
                </button>
              ))}
            </div>
            {form.sizes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                {form.sizes.map((sz) => (
                  <div key={sz} className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-gray-600 w-8">{sz}</span>
                    <input
                      type="number" min={0}
                      className="form-input !py-1.5 text-sm flex-1"
                      value={stock[sz] ?? 0}
                      onChange={(e) => setStock((s) => ({ ...s, [sz]: Number(e.target.value) }))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 className="font-semibold text-gray-900 mb-1">Highlight Tags</h2>
            {[
              { key: 'isFeatured', label: 'Featured Product' },
              { key: 'isNewArrival', label: 'New Arrival' },
              { key: 'isTrending', label: 'Trending' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[var(--color-primary)]"
                />
                {label}
              </label>
            ))}
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3 text-sm">
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {saving ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
