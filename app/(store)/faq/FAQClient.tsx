'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const faqData = [
  {
    category: 'Orders',
    items: [
      { q: 'How do I place an order on Henoria?', a: "Simply browse our collection, select your size and color, and click 'Add to Cart'. Once you're ready, head to checkout, fill in your delivery details, and place your order. You'll receive an order confirmation email immediately." },
      { q: 'Can I modify or cancel my order after placing it?', a: 'You can cancel or modify your order within 2 hours of placing it by contacting our customer support. Once the order is processed or shipped, modifications are not possible. Please reach out to us at help@henoria.com.' },
      { q: 'How do I track my order?', a: "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order in real-time by logging into your account and visiting 'My Orders' in your dashboard." },
      { q: 'What should I do if I receive a wrong item?', a: "We apologize for the inconvenience! Please contact us within 48 hours of delivery with your order ID and photos of the wrong item. We'll arrange a free pickup and send the correct item within 2-3 business days." },
    ]
  },
  {
    category: 'Shipping & Delivery',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days depending on your location. Metro cities receive orders within 2-4 days. Express delivery (1-2 days) is available for select pin codes.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on all orders above ₹999. For orders below ₹999, a flat delivery charge of ₹49 applies. Use coupon code FREESHIP for free shipping on any order value.' },
      { q: 'Do you ship to all locations in India?', a: 'We ship to 27,000+ pin codes across India. Enter your pin code at checkout to check delivery availability and estimated delivery time.' },
      { q: 'Is international shipping available?', a: 'Currently, we only ship within India. International shipping is on our roadmap. Subscribe to our newsletter to be notified when it launches.' },
    ]
  },
  {
    category: 'Returns & Exchange',
    items: [
      { q: 'What is your return policy?', a: "We offer a hassle-free 30-day return policy. Items must be unused, unwashed, and in original packaging with all tags attached. Simply initiate a return from your account dashboard and we'll arrange a free pickup." },
      { q: 'How do I exchange a product for a different size?', a: 'To exchange for a different size, initiate a return from your dashboard and place a new order for the correct size. Your refund will be processed within 5-7 business days after we receive the returned item.' },
      { q: 'When will I receive my refund?', a: 'Once we receive and inspect your returned item, your refund is processed within 2-3 business days. The amount will reflect in your original payment method within 5-7 banking days.' },
    ]
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major payment methods: UPI (GPay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, Amex), Net Banking, EMI options, and Cash on Delivery for orders up to ₹5,000.' },
      { q: 'Is it safe to use my credit card on Henoria?', a: 'Absolutely! We use 256-bit SSL encryption to protect all your payment information. We are PCI DSS compliant and never store your card details on our servers.' },
      { q: 'What should I do if my payment failed?', a: 'If your payment failed, please check your internet connection and try again. If the amount was deducted but order was not placed, it will be auto-refunded within 3-5 business days.' },
    ]
  },
  {
    category: 'Products & Sizing',
    items: [
      { q: 'How do I find the right size?', a: "Each product page has a Size Guide with detailed measurements. We recommend measuring yourself and comparing with the size chart before ordering. If you're between sizes, we suggest going one size up." },
      { q: 'Are the product colors accurate to the images?', a: "We make every effort to display colors as accurately as possible. However, colors may vary slightly depending on your device's screen settings." },
      { q: 'How do I know if a product is in stock?', a: "Available stock is shown on the product page. If a size shows 'Out of Stock', you can click 'Notify Me' to receive an email when it's back in stock." },
    ]
  },
]

export default function FAQClient() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...faqData.map(f => f.category)]

  const filtered = faqData
    .filter(cat => activeCategory === 'All' || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="py-14 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Help Center</p>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 mb-8">Find quick answers to the most common questions.</p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search FAQ..."
              className="w-full pl-12 pr-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-gray-400 transition-colors bg-white"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-10 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeCategory === cat ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
              style={activeCategory === cat ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🤔</p>
            <p className="font-semibold text-gray-900 mb-2">No results found</p>
            <p className="text-gray-500 text-sm">Try a different search term or browse by category</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map(cat => (
              <div key={cat.category}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                  {cat.category}
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.category}-${idx}`
                    const isOpen = openItem === key
                    return (
                      <div key={idx}>
                        <button
                          onClick={() => setOpenItem(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-semibold text-gray-900 pr-4">{item.q}</span>
                          {isOpen
                            ? <ChevronUp size={18} className="flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                            : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                          }
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 animate-fade-in">
                            <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-16 bg-white rounded-2xl p-8 text-center border border-gray-100">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(196,61,107,0.08)' }}>
            <MessageCircle size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Still have questions?
          </h3>
          <p className="text-sm text-gray-500 mb-6">Our support team is here to help you 7 days a week.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contact" className="btn-primary text-sm">Contact Support</Link>
            <a href="mailto:help@henoria.com" className="btn-outline text-sm">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
