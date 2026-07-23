'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/images/products/product-120.jpg',
    tag: 'New Arrivals 2024',
    title: 'Summer\nCollection',
    subtitle: "Discover the season's most loved styles — bold, elegant & effortlessly chic.",
    cta:  { label: 'Shop Women', href: '/girls' },
    cta2: { label: 'Shop Men',   href: '/boys'  },
    accent: '#b8862f',
    overlayFrom: 'rgba(20,10,30,0.55)',
    overlayTo:   'rgba(20,10,30,0.05)',
    overlayDir:  'to right',
    textSide: 'left',
  },
  {
    id: 2,
    image: '/images/products/product-110.jpg',
    tag: 'Limited Time Deal',
    title: 'Summer\nSale',
    subtitle: 'Up to 70% off on selected styles. Use code SUMMER25 at checkout.',
    badge: '-70%',
    cta:  { label: 'Shop Now', href: '/girls' },
    cta2: { label: 'View Deals', href: '/search?q=sale' },
    accent: '#f59e0b',
    overlayFrom: 'rgba(10,20,40,0.60)',
    overlayTo:   'rgba(10,20,40,0.05)',
    overlayDir:  'to right',
    textSide: 'left',
  },
  {
    id: 3,
    image: '/images/products/product-121.jpg',
    tag: "Men's Collection",
    title: 'Style That\nSpeaks',
    subtitle: 'Curated menswear for every occasion — casual, formal & everything between.',
    cta:  { label: 'Shop Men',    href: '/boys'  },
    cta2: { label: 'Shop Casuals', href: '/boys?cat=casual-shirts' },
    accent: '#3b82f6',
    overlayFrom: 'rgba(10,10,30,0.55)',
    overlayTo:   'rgba(10,10,30,0.05)',
    overlayDir:  'to right',
    textSide: 'left',
  },
  {
    id: 4,
    image: '/images/products/bags/product-2.jpg',
    tag: 'Bags & Accessories',
    title: 'Carry It\nWith Style',
    subtitle: 'Premium bags, backpacks & luggage — crafted for everyday elegance.',
    cta:  { label: 'Shop Bags',  href: '/bags' },
    cta2: { label: 'New Arrivals', href: '/bags?sort=newest' },
    accent: '#8b5cf6',
    overlayFrom: 'rgba(20,0,40,0.55)',
    overlayTo:   'rgba(20,0,40,0.05)',
    overlayDir:  'to right',
    textSide: 'left',
  },
  {
    id: 5,
    image: '/images/products/product-122.jpg',
    tag: 'Kids Fashion',
    title: 'Trendy &\nComfortable',
    subtitle: 'Bright, fun and durable kids clothing your little ones will love to wear.',
    cta:  { label: 'Shop Kids', href: '/kids' },
    cta2: { label: 'New In Kids', href: '/kids?sort=newest' },
    accent: '#f97316',
    overlayFrom: 'rgba(20,10,0,0.55)',
    overlayTo:   'rgba(20,10,0,0.05)',
    overlayDir:  'to right',
    textSide: 'left',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState<number | null>(null)
  const [dir, setDir]         = useState<'left' | 'right'>('right')
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused]   = useState(false)

  const go = useCallback((idx: number, direction: 'left' | 'right') => {
    if (animating) return
    setPrev(current)
    setDir(direction)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setPrev(null)
      setAnimating(false)
    }, 600)
  }, [animating, current])

  const next = useCallback(() => {
    go((current + 1) % slides.length, 'right')
  }, [current, go])

  const prev_ = useCallback(() => {
    go((current - 1 + slides.length) % slides.length, 'left')
  }, [current, go])

  // Auto-play
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused])

  const slide = slides[current]
  const prevSlide = prev !== null ? slides[prev] : null

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: 'min(90vh, 640px)', minHeight: 480 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Previous slide (exiting) ── */}
      {prevSlide && (
        <div
          className="absolute inset-0 z-10"
          style={{
            animation: `slideExit${dir === 'right' ? 'Left' : 'Right'} 0.6s cubic-bezier(.77,0,.18,1) forwards`,
          }}
        >
          <SlideContent slide={prevSlide} />
        </div>
      )}

      {/* ── Current slide (entering) ── */}
      <div
        className="absolute inset-0 z-20"
        style={{
          animation: animating
            ? `slideEnter${dir === 'right' ? 'Right' : 'Left'} 0.6s cubic-bezier(.77,0,.18,1) forwards`
            : 'none',
        }}
      >
        <SlideContent slide={slide} active={!animating} />
      </div>

      {/* ── Arrow Buttons ── */}
      <button
        onClick={prev_}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Dot Indicators ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > current ? 'right' : 'left')}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width:  i === current ? 28 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 z-30 w-full">
          <div
            key={current}
            className="h-full bg-white"
            style={{ animation: 'progressBar 5s linear forwards' }}
          />
        </div>
      )}

      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes slideEnterRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideEnterLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideExitLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes slideExitRight {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────────────────────────── */
function SlideContent({ slide, active = true }: { slide: typeof slides[0]; active?: boolean }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${slide.overlayDir}, ${slide.overlayFrom} 0%, ${slide.overlayTo} 65%)`,
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-xl">
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-5"
              style={{
                backgroundColor: active ? slide.accent : slide.accent,
                animation: active ? 'fadeUp 0.5s ease 0.1s both' : 'none',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {slide.tag}
            </div>

            {/* Badge (like -70%) */}
            {slide.badge && (
              <div
                className="text-6xl font-black mb-1 leading-none"
                style={{
                  color: slide.accent,
                  animation: active ? 'fadeUp 0.5s ease 0.15s both' : 'none',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {slide.badge}
              </div>
            )}

            {/* Title */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                animation: active ? 'fadeUp 0.55s ease 0.2s both' : 'none',
                textShadow: '0 2px 30px rgba(0,0,0,0.4)',
                whiteSpace: 'pre-line',
              }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-md"
              style={{ animation: active ? 'fadeUp 0.55s ease 0.3s both' : 'none' }}
            >
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-3"
              style={{ animation: active ? 'fadeUp 0.55s ease 0.4s both' : 'none' }}
            >
              <Link
                href={slide.cta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-white text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ backgroundColor: slide.accent }}
              >
                {slide.cta.label} <ArrowRight size={15} />
              </Link>
              {slide.cta2 && (
                <Link
                  href={slide.cta2.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-white text-sm font-bold border-2 border-white/50 backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  {slide.cta2.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide number */}
      <div className="absolute right-6 bottom-14 text-white/40 text-xs font-mono font-bold z-10 hidden md:block">
        {String(slides.findIndex(s => s.id === slide.id) + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  )
}
