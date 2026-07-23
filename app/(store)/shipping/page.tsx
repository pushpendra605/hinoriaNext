import type { Metadata } from 'next'
import { Truck, RefreshCw, Clock, Shield, MapPin, Package } from 'lucide-react'

export const metadata: Metadata = { title: 'Shipping & Returns' }

const shippingZones = [
  { zone: 'Metro Cities', cities: 'Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata', standard: '2–4 days', express: '1–2 days' },
  { zone: 'Tier 1 Cities', cities: 'Pune, Ahmedabad, Jaipur, Surat, Lucknow, etc.', standard: '3–5 days', express: '2–3 days' },
  { zone: 'Tier 2 & 3 Cities', cities: 'All other serviceable areas', standard: '5–7 days', express: '3–5 days' },
  { zone: 'Remote Areas', cities: 'J&K, Northeast India, Islands', standard: '7–10 days', express: 'Not available' },
]

export default function ShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-14 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Policies</p>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>
            Shipping & Returns
          </h1>
          <p className="text-gray-500">Everything you need to know about delivery and returns.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Quick Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999', color: '#dbeafe' },
            { icon: Clock, title: '2–7 Day Delivery', desc: 'Depending on location', color: '#dcfce7' },
            { icon: RefreshCw, title: '30-Day Returns', desc: 'Hassle-free policy', color: '#fce7f3' },
            { icon: Shield, title: 'Safe Packaging', desc: 'Eco-friendly & secure', color: '#fef3c7' },
            { icon: MapPin, title: '27,000+ Pin Codes', desc: 'Pan India delivery', color: '#f3e8ff' },
            { icon: Package, title: 'Tracked Orders', desc: 'Real-time tracking', color: '#e0f2fe' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: color }}>
                <Icon size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <p className="font-semibold text-sm text-gray-900">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Shipping Charges */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Shipping Charges</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">Order Value</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">Standard Shipping</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Express Shipping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { range: 'Below ₹999', standard: '₹49', express: '₹99' },
                    { range: '₹999 – ₹1,999', standard: 'FREE', express: '₹79' },
                    { range: '₹2,000 & above', standard: 'FREE', express: 'FREE' },
                  ].map(row => (
                    <tr key={row.range}>
                      <td className="py-3 pr-4 text-gray-700 font-medium">{row.range}</td>
                      <td className={`py-3 pr-4 font-semibold ${row.standard === 'FREE' ? 'text-green-600' : 'text-gray-700'}`}>{row.standard}</td>
                      <td className={`py-3 font-semibold ${row.express === 'FREE' ? 'text-green-600' : 'text-gray-700'}`}>{row.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Delivery Timeline by Zone</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead><tr><th>Zone</th><th>Cities</th><th>Standard</th><th>Express</th></tr></thead>
              <tbody>
                {shippingZones.map(z => (
                  <tr key={z.zone}>
                    <td className="font-semibold">{z.zone}</td>
                    <td className="text-gray-400 text-xs">{z.cities}</td>
                    <td><span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{z.standard}</span></td>
                    <td><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${z.express === 'Not available' ? 'text-gray-400 bg-gray-50' : 'text-green-600 bg-green-50'}`}>{z.express}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Returns Policy */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Return & Exchange Policy</h2>
          <div className="space-y-4">
            {[
              { title: '30-Day Return Window', desc: 'You have 30 days from delivery to initiate a return. Sale items have a 15-day return window.' },
              { title: 'Return Conditions', desc: 'Items must be unused, unwashed, and in original packaging with all tags attached. Lingerie, swimwear, and personalized items cannot be returned.' },
              { title: 'Free Pickup', desc: 'We arrange a free pickup from your doorstep. You don\'t need to visit any courier partner.' },
              { title: 'Refund Timeline', desc: 'Refunds are processed within 2-3 business days after inspection. Amount reflects in your account within 5-7 banking days.' },
              { title: 'Exchange', desc: 'For size exchanges, return the original item and place a new order for the correct size. Refund from the return will be processed simultaneously.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}>✓</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
