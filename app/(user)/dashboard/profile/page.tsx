'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { User, Mail, Phone, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' })
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      updateProfile({ name: form.name, phone: form.phone })
      toast.success('Profile updated successfully')
      setSaving(false)
    }, 500)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Update your personal information.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role} account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="form-input pl-10"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="form-input pl-10 bg-gray-50 text-gray-500" value={user?.email || ''} disabled />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Email address cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="form-input pl-10"
                value={form.phone}
                maxLength={10}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary text-sm mt-2">
            {saving ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</span>
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
