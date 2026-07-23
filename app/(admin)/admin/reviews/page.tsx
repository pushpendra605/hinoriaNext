'use client'

import { useEffect, useState } from 'react'
import type { Review } from '@/types'
import { Star, Trash2, Search, BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/reviews').then((r) => r.json()).then(setReviews).finally(() => setLoading(false))
  }, [])

  const filtered = reviews.filter((r) =>
    !search ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.productId.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Review deleted')
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } else {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Moderate customer reviews across your catalog.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9 !py-2 text-sm" placeholder="Search reviews by title, customer, or product ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-16 text-center">Loading reviews...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <Star size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'text-amber-400' : 'text-gray-200'} />
                      ))}
                    </div>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xl">{r.body}</p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    By {r.userName} · Product: {r.productId} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
