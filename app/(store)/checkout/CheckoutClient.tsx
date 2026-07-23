'use client'
import { useState } from 'react'
import { useCartStore, useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Tag, AlertCircle, Lock, ArrowLeft, Truck, ChevronDown, ChevronUp } from 'lucide-react'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry']

export default function CheckoutClient() {
  const { items, getSubtotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: user?.name || '', phone: '', email: user?.email || '',
    line1: '', line2: '', city: '', state: '', pincode: '',
    paymentMethod: 'COD',
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false)

  const subtotal = getSubtotal()
  const delivery = subtotal >= 999 ? 0 : 49
  const discount = couponResult?.valid ? couponResult.discount : 0
  const total = subtotal + delivery - discount
  const savings = items.reduce((s, i) => s + (i.price - i.finalPrice) * i.quantity, 0) + discount

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch(`/api/coupon?code=${couponCode}&total=${subtotal}`)
      const data = await res.json()
      setCouponResult(data)
    } catch {
      setCouponResult({ valid: false, discount: 0, message: 'Error applying coupon' })
    }
    setCouponLoading(false)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit number required'
    if (!form.line1.trim()) e.line1 = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state) e.state = 'Please select state'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = async () => {
    if (!validate() || items.length === 0) return
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: items.map(i => ({
            productId: i.productId, name: i.name, thumbnail: i.thumbnail,
            price: i.price, discountPercent: i.discountPercent, finalPrice: i.finalPrice,
            quantity: i.quantity, size: i.size, color: i.color,
          })),
          address: {
            fullName: form.fullName, phone: form.phone,
            line1: form.line1, line2: form.line2, city: form.city,
            state: form.state, pincode: form.pincode, country: 'India',
          },
          couponApplied: couponResult?.valid ? couponCode.toUpperCase() : null,
          subtotal, discount, deliveryCharge: delivery, total,
          paymentMethod: form.paymentMethod,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to place order')
      clearCart()
      router.push(`/order-confirmation?id=${data.order.id}`)
    } catch (err) {
      setErrors({ submit: 'Something went wrong placing your order. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-8">Add some items before checking out</p>
        <Link href="/" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-2 transition-colors">
              <ArrowLeft size={14} /> Back to Shopping
            </Link>
            <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Checkout</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <Lock size={12} className="text-green-500" />
            <span className="text-green-700 font-medium">Secure Checkout</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT: Forms */}
          <div className="lg:col-span-3 space-y-5">

            {/* Step 1: Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)' }}>1</div>
                <h2 className="font-bold text-gray-900">Contact Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name *</label>
                  <input className={`form-input ${errors.fullName ? 'border-red-400' : ''}`}
                    value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Your full name" />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone *</label>
                  <input className={`form-input ${errors.phone ? 'border-red-400' : ''}`}
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="10-digit mobile" maxLength={10} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                  <input type="email" className="form-input" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com" />
                </div>
              </div>
            </div>

            {/* Step 2: Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)' }}>2</div>
                <h2 className="font-bold text-gray-900">Delivery Address</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Address Line 1 *</label>
                  <input className={`form-input ${errors.line1 ? 'border-red-400' : ''}`}
                    value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))}
                    placeholder="House/Flat No., Building, Street" />
                  {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Address Line 2 (Optional)</label>
                  <input className="form-input" value={form.line2}
                    onChange={e => setForm(f => ({ ...f, line2: e.target.value }))}
                    placeholder="Area, Colony, Landmark" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">City *</label>
                  <input className={`form-input ${errors.city ? 'border-red-400' : ''}`}
                    value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="City" />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Pincode *</label>
                  <input className={`form-input ${errors.pincode ? 'border-red-400' : ''}`}
                    value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))}
                    placeholder="6-digit pincode" maxLength={6} />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">State *</label>
                  <select className={`form-input ${errors.state ? 'border-red-400' : ''}`}
                    value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                <Truck size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-blue-700">
                  Estimated delivery: <strong>3–7 business days</strong>.{' '}
                  {subtotal >= 999 ? '🎉 You qualify for free shipping!' : `Add ₹${999 - subtotal} more for free shipping.`}
                </span>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)' }}>3</div>
                <h2 className="font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives at your doorstep', emoji: '💵', available: true },
                  { value: 'UPI', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm, BHIM UPI', emoji: '📱', available: false },
                  { value: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex, Rupay', emoji: '💳', available: false },
                  { value: 'NetBanking', label: 'Net Banking', desc: 'All major Indian banks', emoji: '🏦', available: false },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${!opt.available ? 'opacity-60' : ''}`}
                    style={form.paymentMethod === opt.value
                      ? { borderColor: 'var(--color-primary)', backgroundColor: 'rgba(196,61,107,0.04)' }
                      : { borderColor: '#f3f4f6' }}>
                    <input type="radio" value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={e => opt.available && setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                      disabled={!opt.available}
                      style={{ accentColor: 'var(--color-primary)' }} />
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                    {!opt.available && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-100">
                        Coming Soon
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden lg:sticky lg:top-24">

              {/* Mobile Toggle */}
              <button
                className="lg:hidden w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50"
                onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}>
                <span className="font-semibold text-sm text-gray-900">
                  Order Summary ({items.length} item{items.length > 1 ? 's' : ''}) · ₹{total}
                </span>
                {orderSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Always visible header on desktop */}
              <div className="hidden lg:flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>
                <span className="text-xs text-gray-400">{items.length} item{items.length > 1 ? 's' : ''}</span>
              </div>

              <div className={`${orderSummaryOpen ? 'block' : 'hidden'} lg:block`}>
                {/* Items List */}
                <div className="px-5 py-3 max-h-56 overflow-y-auto border-b border-gray-50 space-y-3">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3 items-center">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-primary)' }}>{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.size}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-800 flex-shrink-0">₹{item.finalPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="px-5 py-4 border-b border-gray-50">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                        placeholder="COUPON CODE"
                        className="form-input pl-8 text-xs uppercase font-mono tracking-widest" />
                    </div>
                    <button onClick={applyCoupon} disabled={couponLoading}
                      className="px-3 py-2 text-xs font-bold rounded-lg border-2 flex-shrink-0 transition-all"
                      style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponResult && (
                    <div className={`flex items-center gap-1.5 mt-2 text-xs px-3 py-2 rounded-lg ${couponResult.valid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {couponResult.valid ? <Check size={11} /> : <AlertCircle size={11} />}
                      {couponResult.valid ? `You save ₹${couponResult.discount}!` : couponResult.message}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1.5">Try: WELCOME10 · FLAT200 · SUMMER25 · FREESHIP</p>
                </div>

                {/* Price Breakdown */}
                <div className="px-5 py-4 space-y-2 border-b border-gray-50">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">MRP Total</span><span>₹{items.reduce((s,i) => s + i.price * i.quantity, 0)}</span></div>
                  <div className="flex justify-between text-sm text-green-600"><span>Product Discount</span><span>−₹{items.reduce((s,i) => s + (i.price - i.finalPrice) * i.quantity, 0)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Coupon Discount</span><span>−₹{discount}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span>
                    <span className={delivery === 0 ? 'text-green-600 font-semibold' : ''}>{delivery === 0 ? 'FREE 🎉' : `₹${delivery}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span style={{ color: 'var(--color-primary)' }}>₹{total}</span>
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-lg text-center">
                      🎉 You are saving ₹{savings} on this order!
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="px-5 py-5">
                  <button onClick={placeOrder} disabled={loading}
                    className="btn-primary w-full justify-center py-4 text-base font-black rounded-xl shadow-lg">
                    {loading
                      ? <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Placing Order...
                        </span>
                      : <><Lock size={16} /> Place Order · ₹{total}</>
                    }
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Lock size={9} /> 256-bit SSL encrypted &amp; secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
