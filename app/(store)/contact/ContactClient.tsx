'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: Phone, title: 'Call to Us', lines: ['84390 07064', '97209 48956', '88595 39280'], sub: 'Mon–Sun, 10am–10pm IST' },
  { icon: Mail, title: 'Write to Us', lines: ['help@henoria.com', 'support@henoria.com'], sub: 'We reply within 24 hours' },
  { icon: MapPin, title: 'Visit Us', lines: ['123 Fashion Street,', 'Mumbai, Maharashtra – 400001'], sub: 'India' },
  { icon: Clock, title: 'Working Hours', lines: ['Monday – Friday: 10am – 8pm', 'Saturday – Sunday: 11am – 6pm'], sub: 'IST (Indian Standard Time)' },
]

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
    toast.success("Message sent! We'll reply within 24 hours.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-14 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Get In Touch</p>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>
            Contact Us
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Have a question, feedback, or need help? We're here for you 7 days a week.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, title, lines, sub }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(196,61,107,0.08)' }}>
                    <Icon size={18} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1.5">{title}</p>
                    {lines.map((line, i) => (
                      <p key={i} className="text-xs text-gray-600">{line}</p>
                    ))}
                    <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Help */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={16} style={{ color: 'var(--color-primary)' }} />
                <p className="font-bold text-gray-900 text-sm">Quick Help</p>
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Track your order', href: '/dashboard/orders' },
                  { label: 'Return & Exchange', href: '/faq' },
                  { label: 'Size Guide', href: '/size-guide' },
                  { label: 'FAQs', href: '/faq' },
                  { label: 'Shipping Policy', href: '/shipping' },
                ].map(({ label, href }) => (
                  <Link key={label} href={href}
                    className="block text-xs text-gray-600 hover:text-gray-900 transition-colors py-1.5 border-b border-gray-50 last:border-0 hover:pl-1">
                    → {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'rgba(196,61,107,0.08)' }}>
                    <CheckCircle size={32} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Thank you, {form.name}! We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="btn-outline text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    Send Us a Message
                  </h2>
                  <p className="text-sm text-gray-400 mb-6">Fill out the form and we&apos;ll contact you within 24 hours.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                        <input className="form-input" value={form.name} required
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address *</label>
                        <input type="email" className="form-input" value={form.email} required
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="email@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
                      <select className="form-input" value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                        <option value="">Select a topic</option>
                        <option>Order related query</option>
                        <option>Return / Exchange</option>
                        <option>Payment issue</option>
                        <option>Product inquiry</option>
                        <option>Shipping &amp; delivery</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                      <textarea className="form-input resize-y" rows={6} value={form.message} required
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Describe your issue or question in detail..." />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
                      {loading
                        ? <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </span>
                        : <><Send size={14} /> Send Message</>
                      }
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      We typically respond within 24 hours during business days.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
