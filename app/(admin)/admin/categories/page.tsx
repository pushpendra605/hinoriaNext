'use client'

import { useEffect, useState } from 'react'
import type { Category } from '@/types'
import { Plus, Pencil, Trash2, X, FolderTree } from 'lucide-react'
import toast from 'react-hot-toast'

const GENDERS = ['women', 'men', 'kids', 'unisex']

const emptyForm = { name: '', slug: '', gender: 'unisex', parentSlug: '', image: '' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (c: Category) => {
    setEditingId(c.id)
    setForm({ name: c.name, slug: c.slug, gender: c.gender, parentSlug: c.parentSlug, image: c.image })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Category updated')
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        toast.success('Category added')
      }
      setShowForm(false)
      load()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will remain but won't be grouped under it.`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Category deleted')
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your catalog — add new categories anytime (e.g. Skincare, Home Decor).</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus size={15} /> Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-16 text-center">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <FolderTree size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">No categories yet.</p>
          <button onClick={openAdd} className="btn-primary text-sm">Add your first category</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="aspect-[4/3] bg-gray-50">
                {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{c.gender} {c.parentSlug ? `· ${c.parentSlug}` : ''}</p>
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
                  <button onClick={() => openEdit(c)} className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-xs font-semibold flex items-center gap-1 text-red-500 ml-auto">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category Name *</label>
                <input required className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Skincare" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug (auto-generated if blank)</label>
                <input className="form-input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="e.g. skincare" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Section</label>
                <select className="form-input" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
                  {GENDERS.map((g) => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parent Group (optional)</label>
                <input className="form-input" value={form.parentSlug} onChange={(e) => setForm((f) => ({ ...f, parentSlug: e.target.value }))} placeholder="e.g. beauty-personal-care" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
                <input className="form-input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="/images/products/..." />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                {editingId ? 'Save Changes' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
