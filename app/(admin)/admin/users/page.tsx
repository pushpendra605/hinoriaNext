'use client'

import { useEffect, useMemo, useState } from 'react'
import type { User, Order } from '@/types'
import { Search, Shield, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]).then(([u, o]) => { setUsers(u); setOrders(o) }).finally(() => setLoading(false))
  }, [])

  const statsFor = (userId: string) => {
    const userOrders = orders.filter((o) => o.userId === userId)
    const spent = userOrders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
    return { count: userOrders.length, spent }
  }

  const filtered = useMemo(() => {
    return users
      .filter((u) => roleFilter === 'All' || u.role === roleFilter)
      .filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  }, [users, search, roleFilter])

  const toggleRole = async (u: Omit<User, 'password'>) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change ${u.name}'s role to ${newRole}?`)) return
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, role: newRole } : x))
      toast.success(`${u.name} is now ${newRole === 'admin' ? 'an admin' : 'a customer'}`)
    } else {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title text-2xl sm:text-3xl">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9 !py-2 text-sm" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input !py-2 text-sm w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="user">Customers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <p className="text-sm text-gray-400 py-16 text-center">Loading customers...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-16 text-center">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium">Total Spent</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const stats = statsFor(u.id)
                  return (
                    <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">{u.email}</p>
                        <p className="text-xs text-gray-400">{u.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{stats.count}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">₹{stats.spent.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                          {u.role === 'admin' ? <Shield size={11} /> : <UserIcon size={11} />} {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => toggleRole(u)} className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                          Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
