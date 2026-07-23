'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'
import {
  IndianRupee, ShoppingBag, Users, Package, AlertTriangle, ArrowRight, TrendingUp,
} from 'lucide-react'

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueTrend: { date: string; revenue: number }[]
  statusBreakdown: { status: string; count: number }[]
  topProducts: { productId: string; name: string; qty: number; revenue: number; thumbnail: string }[]
  categoryBreakdown: { category: string; count: number }[]
  lowStock: { productId: string; name: string; thumbnail: string; available: number }[]
  productStatusCounts: Record<string, number>
  recentOrders: any[]
}

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Shipped: '#8b5cf6',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: 'var(--color-primary)' }} />
      </div>
    )
  }

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'var(--color-primary)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#3b82f6' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: '#8b5cf6' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: '#22c55e' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your store's performance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><TrendingUp size={16} /> Revenue (Last 14 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={45} />
              <Tooltip formatter={(v: number) => [`₹${v}`, 'Revenue']} contentStyle={{ borderRadius: 10, border: '1px solid #eee', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.statusBreakdown} dataKey="count" nameKey="status" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {stats.statusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eee', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {stats.statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] || '#ccc' }} />
                {s.status} ({s.count})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <img src={p.thumbnail} className="w-11 h-11 rounded-lg object-cover bg-gray-50" alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.qty} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">₹{p.revenue.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Low Stock</h2>
            <Link href="/admin/inventory" className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>View all</Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">All products well stocked.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.lowStock.slice(0, 6).map((p) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <img src={p.thumbnail} className="w-9 h-9 rounded-lg object-cover bg-gray-50" alt={p.name} />
                  <p className="text-xs text-gray-700 flex-1 truncate">{p.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.available === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {p.available === 0 ? 'Out of Stock' : `${p.available} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Items</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>{o.id}</Link>
                    </td>
                    <td className="py-2.5 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td className="py-2.5 text-gray-500">{o.items.length}</td>
                    <td className="py-2.5 font-semibold text-gray-900">₹{o.total}</td>
                    <td className="py-2.5"><span className={`status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
