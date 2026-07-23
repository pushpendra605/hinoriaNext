'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import type { Order } from '@/types'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'

function statusClass(status: string) {
  const map: Record<string, string> = {
    Pending: 'status-pending',
    Confirmed: 'status-confirmed',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
    Cancelled: 'status-cancelled',
  }
  return map[status] || 'status-pending'
}

const FILTERS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  useEffect(() => {
    if (!user) return
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage all your orders.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors"
            style={
              filter === f
                ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                : { borderColor: '#e5e7eb', color: '#6b7280' }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-10 text-center">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
          <ShoppingBag size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">No orders found{filter !== 'All' ? ` with status "${filter}"` : ''}.</p>
          <Link href="/" className="btn-primary text-sm">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:border-gray-200 transition-colors"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Package size={14} />
                  <span className="font-semibold text-gray-700">{order.id}</span>
                  <span>·</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <span className={statusClass(order.status)}>{order.status}</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {order.items.map((item, i) => (
                  <img
                    key={i}
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-50"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <p className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">₹{order.total}</p>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
