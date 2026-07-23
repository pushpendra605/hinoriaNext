'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Home, Copy, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderConfirmationClient() {
  const params = useSearchParams()
  const orderId = params.get('id') || `ORD-${Date.now()}`

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    toast.success('Order ID copied!', { duration: 1500, position: 'bottom-center' })
  }

  const steps = [
    { label: 'Order Placed', done: true, icon: '📋' },
    { label: 'Confirmed', done: false, icon: '✅' },
    { label: 'Shipped', done: false, icon: '🚚' },
    { label: 'Delivered', done: false, icon: '📦' },
  ]

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-center max-w-lg w-full">

        {/* Success Animation */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in"
          style={{ backgroundColor: 'rgba(196,61,107,0.08)' }}
        >
          <CheckCircle size={48} style={{ color: 'var(--color-primary)' }} />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Order Placed! 🎉
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          Thank you for shopping with Henoria! Your order has been confirmed and will be dispatched soon.
        </p>

        {/* Order ID Card */}
        <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6 mb-8 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Your Order ID</p>
          <div className="flex items-center justify-center gap-3">
            <p className="font-mono font-black text-gray-900 text-xl tracking-wider">{orderId}</p>
            <button
              onClick={copyOrderId}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              title="Copy Order ID"
            >
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Save this ID to track your order</p>
        </div>

        {/* Order Timeline */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-5">Order Progress</p>
          <div className="flex items-start justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative flex items-center justify-center">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 z-0"
                      style={{
                        width: 'calc(100% + 2rem)',
                        backgroundColor: step.done ? 'var(--color-primary)' : '#e5e7eb',
                      }}
                    />
                  )}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-base"
                    style={{
                      backgroundColor: step.done ? 'var(--color-primary)' : '#f3f4f6',
                    }}
                  >
                    <span>{step.done ? '✓' : step.icon}</span>
                  </div>
                </div>
                <p className={`text-[11px] font-medium text-center ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 text-left shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">What happens next?</p>
          <div className="space-y-3">
            {[
              { emoji: '📧', text: "You'll receive an order confirmation email shortly." },
              { emoji: '📦', text: 'Your items will be packed and dispatched within 24 hours.' },
              { emoji: '🚚', text: "You'll receive a tracking link once your order is shipped." },
              { emoji: '🏠', text: 'Estimated delivery: 3–7 business days.' },
            ].map(({ emoji, text }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">{emoji}</span>
                <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/orders" className="btn-primary">
            <Package size={14} /> Track My Order
          </Link>
          <Link href="/" className="btn-outline">
            <Home size={14} /> Continue Shopping
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Questions? Email us at{' '}
          <a href="mailto:help@henoria.com" className="font-medium" style={{ color: 'var(--color-primary)' }}>
            help@henoria.com
          </a>
        </p>
      </div>
    </div>
  )
}
