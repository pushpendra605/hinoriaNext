'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import type { Order } from '@/types'
import { Printer, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function InvoicePage() {
  const params = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [params.id])

  if (!mounted || loading) {
    return <p className="text-sm text-gray-400 py-16 text-center">Loading invoice...</p>
  }

  if (!order) {
    return <p className="text-sm text-gray-400 py-16 text-center">Invoice not found.</p>
  }

  const authorized = user && (user.role === 'admin' || user.id === order.userId)
  if (!authorized) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <p className="text-sm text-gray-500 mb-4">You're not authorized to view this invoice.</p>
        <Link href="/" className="btn-primary text-sm">Go Home</Link>
      </div>
    )
  }

  const gstRate = 0.05
  const taxableValue = Math.round(order.subtotal / (1 + gstRate))
  const gstAmount = order.subtotal - taxableValue

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="no-print flex items-center justify-between mb-5">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
          <ChevronLeft size={16} /> Home
        </Link>
        <button onClick={() => window.print()} className="btn-primary text-sm">
          <Printer size={15} /> Print / Save PDF
        </button>
      </div>

      <div id="invoice" className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10">
        <div className="flex items-start justify-between pb-6 border-b-2 border-gray-900">
          <div>
            <img src="/images/logo.png" alt="Henoria" className="h-10 mb-2" />
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Henoria</p>
            <p className="text-xs text-gray-500 mt-1">contact@henoria.com</p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1">{order.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Billed To</p>
            <p className="text-sm font-semibold text-gray-900">{order.address.fullName}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {order.address.line1}, {order.address.line2}<br />
              {order.address.city}, {order.address.state} - {order.address.pincode}<br />
              {order.address.country}<br />
              📞 {order.address.phone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Payment</p>
            <p className="text-sm text-gray-700">{order.paymentMethod}</p>
            <p className="text-xs text-gray-500 mt-0.5">Status: <span className="font-medium">{order.paymentStatus}</span></p>
          </div>
        </div>

        <table className="w-full text-sm mt-6">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-200">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 font-medium">Size</th>
              <th className="pb-2 font-medium text-center">Qty</th>
              <th className="pb-2 font-medium text-right">Price</th>
              <th className="pb-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-2.5 text-gray-800">{item.name}</td>
                <td className="py-2.5 text-gray-500">{item.size}</td>
                <td className="py-2.5 text-center text-gray-500">{item.quantity}</td>
                <td className="py-2.5 text-right text-gray-500">₹{item.finalPrice}</td>
                <td className="py-2.5 text-right font-medium text-gray-900">₹{item.finalPrice * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Taxable Value</span><span>₹{taxableValue}</span></div>
            <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>₹{gstAmount}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount {order.couponApplied ? `(${order.couponApplied})` : ''}</span><span>-₹{order.discount}</span></div>
            )}
            <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t-2 border-gray-900"><span>Grand Total</span><span>₹{order.total}</span></div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          Thank you for shopping with Henoria! This is a computer-generated invoice.
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          nav, footer { display: none !important; }
        }
      `}</style>
    </div>
  )
}
