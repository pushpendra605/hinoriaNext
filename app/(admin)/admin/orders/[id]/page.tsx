'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Order } from '@/types'
import { ChevronLeft, MapPin, CreditCard, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [note, setNote] = useState('')
  const [nextStatus, setNextStatus] = useState('')

  const load = () => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setNextStatus(data.status) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [params.id])

  const handleStatusUpdate = async () => {
    if (!order || nextStatus === order.status) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, note: note || `Status updated to ${nextStatus}` }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setOrder(data.order)
      setNote('')
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <p className="text-sm text-gray-400 py-16 text-center">Loading order...</p>
  if (!order) return <p className="text-sm text-gray-400 py-16 text-center">Order not found.</p>

  return (
    <div className="space-y-5">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title text-xl sm:text-2xl">{order.id}</h1>
          <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
          <Link href={`/invoice/${order.id}`} target="_blank" className="btn-outline text-sm">
            <FileText size={15} /> Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-gray-900 mb-4">Items ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img src={item.thumbnail} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">₹{item.finalPrice}</p>
                    {item.discountPercent > 0 && <p className="text-xs text-gray-400 line-through">₹{item.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-gray-900 mb-4">Order History</h2>
            <div className="space-y-3">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-400 whitespace-nowrap">{new Date(h.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-gray-700 font-medium">{h.status}:</span>
                  <span className="text-gray-500">{h.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Update Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-gray-900">Update Status</h2>
            <select className="form-input !py-2 text-sm" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input className="form-input !py-2 text-sm" placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <button onClick={handleStatusUpdate} disabled={updating || nextStatus === order.status} className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-50">
              {updating ? <Loader2 size={15} className="animate-spin" /> : null}
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><MapPin size={15} /> Shipping Address</h2>
            <p className="text-sm text-gray-700 font-medium">{order.address.fullName}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {order.address.line1}, {order.address.line2}<br />
              {order.address.city}, {order.address.state} - {order.address.pincode}<br />
              {order.address.country}
            </p>
            <p className="text-xs text-gray-500 mt-2">📞 {order.address.phone}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CreditCard size={15} /> Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount {order.couponApplied ? `(${order.couponApplied})` : ''}</span><span>-₹{order.discount}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.total}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-700">{order.paymentMethod}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-gray-500">Payment Status</span>
              <span className="font-medium text-gray-700">{order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
