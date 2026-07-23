'use client'

import { useEffect, useState } from 'react'
import type { Coupon } from '@/types'
import { Plus, Pencil, Trash2, X, Tag, Power } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm = {
  code: '', description: '', type: 'percentage' as Coupon['type'], value: '', minOrderValue: '',
  maxDiscount: '', usageLimit: '', isActive: true, expiresAt: '', applicableFor: 'all',
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/coupons').then((r) => r.json()).then(setCoupons).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (c: Coupon) => {
    setEditingId(c.id)
    setForm({
      code: c.code, description: c.description, type: c.type, value: String(c.value),
      minOrderValue: String(c.minOrderValue), maxDiscount: String(c.maxDiscount),
      usageLimit: String(c.usageLimit), isActive: c.isActive,
      expiresAt: c.expiresAt.slice(0, 10), applicableFor: c.applicableFor,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      value: Number(form.value),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: Number(form.maxDiscount) || Number(form.value),
      usageLimit: Number(form.usageLimit) || 100,
      expiresAt: new Date(form.expiresAt || Date.now() + 30 * 86400000).toISOString(),
    }
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/coupons/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        toast.success('Coupon updated')
      } else {
        const res = await fetch('/api/admin/coupons', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        toast.success('Coupon created')
      }
      setShowForm(false)
      load()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const toggleActive = async (c: Coupon) => {
    const res = await fetch(`/api/admin/coupons/${c.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !c.isActive }),
    })
    if (res.ok) {
      setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, isActive: !x.isActive } : x))
      toast.success(!c.isActive ? 'Coupon activated' : 'Coupon deactivated')
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return
    const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Coupon deleted')
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount codes.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-16 text-center">Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <Tag size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">No coupons yet.</p>
          <button onClick={openAdd} className="btn-primary text-sm">Create your first coupon</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5 relative" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'rgba(184,134,47,0.1)', color: 'var(--color-primary)' }}>
                  {c.code}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${c.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{c.description}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                <p>Type: <span className="font-medium text-gray-700 capitalize">{c.type}</span></p>
                <p>Value: <span className="font-medium text-gray-700">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</span></p>
                <p>Min order: <span className="font-medium text-gray-700">₹{c.minOrderValue}</span></p>
                <p>Max discount: <span className="font-medium text-gray-700">₹{c.maxDiscount}</span></p>
                <p>Used: <span className="font-medium text-gray-700">{c.usedCount}/{c.usageLimit}</span></p>
                <p>For: <span className="font-medium text-gray-700 capitalize">{c.applicableFor}</span></p>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Expires {new Date(c.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                <button onClick={() => toggleActive(c)} className="text-xs font-semibold flex items-center gap-1 text-gray-600">
                  <Power size={12} /> {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEdit(c)} className="text-xs font-semibold flex items-center gap-1 ml-auto" style={{ color: 'var(--color-primary)' }}>
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(c.id, c.code)} className="text-xs font-semibold flex items-center gap-1 text-red-500">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Coupon' : 'Add New Coupon'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Code *</label>
                  <input required className="form-input uppercase" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="SAVE20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                  <select className="form-input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <input className="form-input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="20% off on all orders" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Value *</label>
                  <input required type="number" className="form-input" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Max Discount (₹)</label>
                  <input type="number" className="form-input" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Order Value (₹)</label>
                  <input type="number" className="form-input" value={form.minOrderValue} onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Usage Limit</label>
                  <input type="number" className="form-input" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Applicable For</label>
                  <select className="form-input" value={form.applicableFor} onChange={(e) => setForm((f) => ({ ...f, applicableFor: e.target.value }))}>
                    <option value="all">All Products</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expires On</label>
                  <input type="date" className="form-input" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} />
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-[var(--color-primary)]" />
                Active immediately
              </label>
              <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                {editingId ? 'Save Changes' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
