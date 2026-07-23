'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore, useWishlistStore } from '@/lib/store'
import type { Order } from '@/types'
import { Package, Heart, MapPin, ArrowRight, ShoppingBag } from 'lucide-react'

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

export default function DashboardOverviewPage() {
  const { user } = useAuthStore()
  const { items: wishlist } = useWishlistStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [user])

  const addressCount = (user as any)?.addresses?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Hi, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's a quick overview of your account.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(184,134,47,0.1)' }}>
            <Package size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '—' : orders.length}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,187,106,0.15)' }}>
            <Heart size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
            <p className="text-xs text-gray-500">Wishlist Items</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(28,23,18,0.06)' }}>
            <MapPin size={20} style={{ color: 'var(--color-dark)' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{addressCount}</p>
            <p className="text-xs text-gray-500">Saved Addresses</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 py-6 text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/" className="btn-primary text-sm">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <img
                  src={order.items[0]?.thumbnail}
                  alt={order.items[0]?.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-50"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">₹{order.total}</p>
                  <span className={statusClass(order.status)}>{order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/dashboard/orders', label: 'My Orders', icon: Package },
          { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
          { href: '/dashboard/address', label: 'Addresses', icon: MapPin },
          { href: '/', label: 'Continue Shopping', icon: ShoppingBag },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-gray-200 transition-colors" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Icon size={20} className="mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
            <p className="text-xs font-medium text-gray-700">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
