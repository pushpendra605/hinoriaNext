'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store'
import type { Address } from '@/types'
import { MapPin, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm: Omit<Address, 'id' | 'isDefault'> = {
  label: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
}

export default function AddressPage() {
  const { user, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const addresses = user?.addresses ?? []

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    setForm({ ...addr })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      const existing = addresses.find((a) => a.id === editingId)
      updateAddress({ ...form, id: editingId, isDefault: existing?.isDefault ?? false })
      toast.success('Address updated')
    } else {
      addAddress({ ...form, id: `addr-${Date.now()}`, isDefault: false })
      toast.success('Address added')
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    removeAddress(id)
    toast.success('Address removed')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl">My Addresses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your delivery addresses.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus size={15} /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <MapPin size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">You haven't added any addresses yet.</p>
          <button onClick={openAdd} className="btn-primary text-sm">Add your first address</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-xl border border-gray-100 p-5 relative" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(184,134,47,0.1)', color: 'var(--color-primary)' }}>
                  <MapPin size={11} /> {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-green-600 bg-green-50 px-2 py-1 rounded-full">Default</span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900">{addr.fullName}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {addr.line1}, {addr.line2}<br />
                {addr.city}, {addr.state} - {addr.pincode}<br />
                {addr.country}
              </p>
              <p className="text-xs text-gray-500 mt-2">📞 {addr.phone}</p>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                {!addr.isDefault && (
                  <button onClick={() => setDefaultAddress(addr.id)} className="text-xs font-semibold flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    <Check size={13} /> Set Default
                  </button>
                )}
                <button onClick={() => openEdit(addr)} className="text-xs font-semibold flex items-center gap-1 ml-auto" style={{ color: 'var(--color-primary)' }}>
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-xs font-semibold flex items-center gap-1 text-red-500">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['Home', 'Work', 'Other'].map((lbl) => (
                  <button
                    type="button"
                    key={lbl}
                    onClick={() => setForm((f) => ({ ...f, label: lbl }))}
                    className="py-2 rounded-lg text-xs font-semibold border transition-colors"
                    style={form.label === lbl ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' } : { borderColor: '#e5e7eb', color: '#6b7280' }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <input required placeholder="Full Name" className="form-input" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              <input required placeholder="Phone Number" maxLength={10} className="form-input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <input required placeholder="Address Line 1" className="form-input" value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} />
              <input placeholder="Address Line 2 (optional)" className="form-input" value={form.line2} onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="City" className="form-input" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                <input required placeholder="State" className="form-input" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Pincode" maxLength={6} className="form-input" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
                <input required placeholder="Country" className="form-input" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                {editingId ? 'Save Changes' : 'Add Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
