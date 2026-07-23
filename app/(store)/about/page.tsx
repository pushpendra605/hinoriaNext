import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Leaf, Users, Award, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'About Us' }

const team = [
  { name: 'Munendra Rajput', role: 'Founder & CEO', avatar: 'M', bio: 'Passionate about making fashion accessible to everyone.' },
  { name: 'Shree Krishna', role: 'Co-Founder & CTO', avatar: 'S', bio: 'Tech visionary building the future of online shopping.' },
  { name: 'Priya Sharma', role: 'Head of Design', avatar: 'P', bio: 'Creating beautiful experiences for our customers.' },
  { name: 'Rahul Verma', role: 'Head of Operations', avatar: 'R', bio: 'Ensuring every order reaches you perfectly.' },
]

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '2000+', label: 'Products' },
  { value: '500+', label: 'Brands' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with asking: "Is this good for our customer?"' },
  { icon: Leaf, title: 'Sustainability', desc: 'We partner with brands that share our commitment to ethical fashion.' },
  { icon: Users, title: 'Inclusivity', desc: 'Fashion for every body, every age, every budget — no exceptions.' },
  { icon: Award, title: 'Quality', desc: 'We curate only the best products that meet our strict quality standards.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28"
        style={{ background: 'linear-gradient(135deg, var(--color-dark) 0%, #2d2d5e 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--color-accent)' }}>Our Story</p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            We believe we can all <br />
            <span style={{ color: 'var(--color-accent)' }}>make a stylish.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Henoria started with a simple belief — that great fashion shouldn't be a luxury. 
            We're here to make style accessible, sustainable, and inclusive for everyone.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10" style={{ backgroundColor: 'var(--color-accent)' }} />
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center py-6">
                <p className="text-4xl font-black mb-1" style={{ color: 'var(--color-primary)' }}>{value}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/products/product-1.jpg"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl hidden md:block">
                <img src="/images/products/product-120.jpg" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:pl-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-400">About Our Store</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Fashion Democracy — <br />Style for All
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                Founded in 2020, Henoria began as a small boutique with a big dream: to democratize fashion. 
                We believed that looking great shouldn't require a designer budget — just the right platform to discover it.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Today, we're proud to serve over 50,000 customers across India with a curated collection 
                of women's, men's, and kids' fashion — all at prices that make sense. From daily casuals 
                to special occasion wear, Henoria has something for every wardrobe and every moment.
              </p>
              <Link href="/girls" className="btn-primary">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">What We Stand For</h2>
            <p className="section-subheading">Our values guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(196,61,107,0.08)' }}>
                  <Icon size={24} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading">Meet Our Team</h2>
            <p className="section-subheading">The passionate people behind Henoria</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar, bio }) => (
              <div key={name} className="text-center group">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black transition-transform group-hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}>
                  {avatar}
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">{name}</h4>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-primary)' }}>{role}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-white text-center"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Ready to Explore?</h2>
          <p className="mb-8 text-white/80">Discover thousands of curated fashion pieces just for you.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/girls" className="bg-white px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ color: 'var(--color-primary)' }}>Shop Women</Link>
            <Link href="/boys" className="border-2 border-white px-8 py-3 rounded-lg font-semibold text-sm text-white transition-all hover:bg-white hover:-translate-y-0.5"
              style={{}}>Shop Men</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
