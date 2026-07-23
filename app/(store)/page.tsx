import Link from 'next/link'
import { getSiteConfig, getHomeConfig, getProductsByIds, getPublishedProducts } from '@/lib/dataLoader'
import ProductCard from '@/components/shop/ProductCard'
import HeroCarousel from '@/components/shop/HeroCarousel'
import { Truck, RefreshCw, Shield, Headphones, ArrowRight, Star, Tag } from 'lucide-react'

export default async function HomePage() {
  const [site, home, allProducts] = await Promise.all([
    getSiteConfig(),
    getHomeConfig(),
    getPublishedProducts(),
  ])

  const [topSellers, newArrivals, dealItems] = await Promise.all([
    getProductsByIds(home.topSellerSection.productIds),
    getProductsByIds(home.newArrivalsSection.productIds),
    getProductsByIds(home.dealOfDaySection.productIds),
  ])

  const featureIconMap: Record<string, typeof Truck> = {
    truck: Truck, refresh: RefreshCw, shield: Shield, headphones: Headphones,
  }

  return (
    <div>
      {/* ── 1. Hero Carousel ─────────────────────────────── */}
      <HeroCarousel />

      {/* ── 2. Features Strip ────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {home.features.map((feat, i) => {
              const Icon = featureIconMap[feat.icon] || Shield
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(196,61,107,0.08)' }}>
                    <Icon size={18} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{feat.title}</p>
                    <p className="text-xs text-gray-400">{feat.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Category Quick Links ──────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {home.categoryBanners.map((cat) => (
              <Link key={cat.id} href={cat.href}
                className="group relative rounded-2xl overflow-hidden flex items-end p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: cat.color, minHeight: 170 }}>
                <div className="relative z-10">
                  <p className="text-[11px] text-gray-500 mb-0.5 font-medium">{cat.subtitle}</p>
                  <h3 className="font-black text-gray-900 text-base leading-tight">{cat.title}</h3>
                  <span className="text-xs font-bold mt-2 inline-flex items-center gap-1"
                    style={{ color: 'var(--color-primary)' }}>
                    Shop Now <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Top Sellers ───────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>Most Loved</p>
              <h2 className="section-heading text-left mb-0">{home.topSellerSection.heading}</h2>
              <p className="text-gray-400 text-sm mt-1">{home.topSellerSection.subheading}</p>
            </div>
            <Link href="/girls" className="hidden md:flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(topSellers.length > 0 ? topSellers : allProducts.filter(p => p.isFeatured).slice(0, 8)).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/girls" className="btn-outline text-sm">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── 5. Wide Promo Banner ─────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center text-white"
            style={{ background: 'linear-gradient(135deg, #1c1712 0%, #3a2f1f 50%, #14100b 100%)' }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 translate-x-24 -translate-y-24"
              style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 -translate-x-16 translate-y-16"
              style={{ backgroundColor: 'var(--color-accent)' }} />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3 opacity-70">Limited Time Offer</p>
              <h2 className="text-4xl md:text-6xl font-black mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Up to <span style={{ color: 'var(--color-accent)' }}>70% OFF</span>
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
                On our summer collection — use code{' '}
                <code className="bg-white/10 px-2 py-0.5 rounded font-mono font-bold">SUMMER25</code> at checkout
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/girls" className="btn-primary px-8 py-3.5 text-sm">Shop Women</Link>
                <Link href="/boys"
                  className="px-8 py-3.5 rounded-lg text-sm font-semibold text-white border-2 border-white/40 hover:bg-white/15 transition-all">
                  Shop Men
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. New Arrivals ──────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>Just Dropped</p>
              <h2 className="section-heading text-left mb-0">{home.newArrivalsSection.heading}</h2>
              <p className="text-gray-400 text-sm mt-1">{home.newArrivalsSection.subheading}</p>
            </div>
            <Link href="/girls?sort=newest" className="hidden md:flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(newArrivals.length > 0 ? newArrivals : allProducts.filter(p => p.isNewArrival).slice(0, 8)).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Deal of Day ───────────────────────────────── */}
      {dealItems.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={14} style={{ color: 'var(--color-primary)' }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>Today Only</p>
                </div>
                <h2 className="section-heading text-left mb-0">{home.dealOfDaySection.heading}</h2>
                <p className="text-xs text-red-500 font-medium mt-1">⏰ Hurry! Limited stock available</p>
              </div>
              <Link href="/girls" className="hidden md:flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                Shop All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dealItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Trending Now ──────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-primary)' }}>🔥 Hot Right Now</p>
              <h2 className="section-heading text-left mb-0">Trending Now</h2>
            </div>
            <Link href="/search?sort=trending" className="hidden md:flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              See All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts.filter(p => p.isTrending).slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Why Choose Henoria ────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading mb-2">Why Choose Henoria?</h2>
          <p className="section-subheading">Trusted by 50,000+ happy customers across India</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {[
              { emoji: '🏆', title: 'Premium Quality', desc: 'Every product is carefully curated for quality & style.' },
              { emoji: '🔒', title: 'Secure Shopping', desc: '100% safe payment with 256-bit SSL encryption.' },
              { emoji: '↩️', title: 'Easy Returns', desc: 'Hassle-free 30-day returns — no questions asked.' },
              { emoji: '📦', title: 'Fast Delivery', desc: 'Pan India delivery in 2–7 business days.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Testimonials ─────────────────────────────── */}
      {/* <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading mb-2">What Our Customers Say</h2>
          <p className="section-subheading">Real reviews from real shoppers</p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Absolutely love the quality! The dress I ordered looks exactly like the picture and fits perfectly. Delivery was super fast too!', product: 'Bodycon Midi Dress' },
              { name: 'Rahul Kumar', city: 'Mumbai', rating: 5, text: "Best online fashion store I've shopped from. The return process was smooth and customer support was very helpful.", product: 'Canvas Backpack' },
              { name: 'Anita Mehta', city: 'Bangalore', rating: 4, text: 'Great variety and very reasonable prices. Got my order in 3 days. Will definitely shop again!', product: 'Velvet Bodycon Dress' },
            ].map(({ name, city, rating, text, product }) => (
              <div key={name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill={i < rating ? '#f59e0b' : 'none'} stroke={i < rating ? '#f59e0b' : '#d1d5db'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}>{name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{city} · Bought: {product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── 11. Newsletter ───────────────────────────────── */}
      <section className="py-14"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70">Stay Updated</p>
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Get 10% Off Your First Order
          </h2>
          <p className="text-white/80 text-sm mb-8">
            Subscribe to get exclusive deals, new arrivals &amp; style tips delivered to your inbox.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email address"
              className="flex-1 bg-white/15 border border-white/30 text-white placeholder-white/60 rounded-xl px-5 py-3 text-sm outline-none" />
            <button type="submit"
              className="px-6 py-3 bg-white rounded-xl text-sm font-bold flex-shrink-0 hover:-translate-y-0.5 transition-all"
              style={{ color: 'var(--color-primary)' }}>
              Subscribe
            </button>
          </form>
          <p className="text-white/50 text-xs mt-3">No spam ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}
