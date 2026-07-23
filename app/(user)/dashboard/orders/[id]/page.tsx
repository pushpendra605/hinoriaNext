'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Order } from '@/types'
import { ChevronLeft, MapPin, CreditCard, CheckCircle2, Circle, FileText } from 'lucide-react'

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

const STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered']

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((data) => setOrder(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <p className="text-sm text-gray-400 py-10 text-center">Loading order...</p>
  }

  if (notFound || !order) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
        <p className="text-sm text-gray-500 mb-4">Order not found.</p>
        <Link href="/dashboard/orders" className="btn-primary text-sm">Back to Orders</Link>
      </div>
    )
  }

  const currentStepIdx = order.status === 'Cancelled' ? -1 : STEPS.indexOf(order.status === 'Pending' ? 'Placed' : order.status)

  return (
    <div className="space-y-5">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="page-title text-xl sm:text-2xl">{order.id}</h1>
          <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <span className={statusClass(order.status)}>{order.status}</span>
      </div>

      <Link
        href={`/invoice/${order.id}`}
        target="_blank"
        className="btn-outline text-sm inline-flex w-fit"
      >
        <FileText size={15} /> Download Invoice
      </Link>

      {/* Status Timeline */}
      {order.status !== 'Cancelled' ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center">
            {STEPS.map((step, idx) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  {idx <= currentStepIdx ? (
                    <CheckCircle2 size={22} style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <Circle size={22} className="text-gray-300" />
                  )}
                  <span className={`text-[11px] font-medium ${idx <= currentStepIdx ? 'text-gray-800' : 'text-gray-400'}`}>{step}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: idx < currentStepIdx ? 'var(--color-primary)' : '#e5e7eb' }} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-gray-400 whitespace-nowrap">{new Date(h.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                <span className="text-gray-700 font-medium">{h.status}:</span>
                <span className="text-gray-500">{h.note}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-sm text-red-600">
          This order was cancelled.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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

        {/* Summary */}
        <div className="space-y-5">
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
