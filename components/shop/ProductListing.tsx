'use client'
import { useState, useMemo } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { Product } from '@/types'

interface ProductListingProps {
  products: Product[]
  title: string
  subtitle?: string
  genderFilter?: string
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 – ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity },
]

export default function ProductListing({ products, title, subtitle, genderFilter }: ProductListingProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState({ category: true, price: true, rating: true, size: true })

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.map(cat => ({ slug: cat, name: cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))
  }, [products])

  const allSizes = useMemo(() => {
    const sizes = new Set<string>()
    products.forEach(p => p.sizes?.forEach(s => sizes.add(s)))
    return [...sizes]
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (selectedCategories.length) list = list.filter(p => selectedCategories.includes(p.category))
    if (selectedPriceRange) list = list.filter(p => p.finalPrice >= selectedPriceRange.min && p.finalPrice <= selectedPriceRange.max)
    if (selectedRating) list = list.filter(p => p.rating >= selectedRating)
    if (selectedSizes.length) list = list.filter(p => p.sizes?.some(s => selectedSizes.includes(s)))
    switch (sortBy) {
      case 'price_asc': list.sort((a, b) => a.finalPrice - b.finalPrice); break
      case 'price_desc': list.sort((a, b) => b.finalPrice - a.finalPrice); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'discount': list.sort((a, b) => b.discountPercent - a.discountPercent); break
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return list
  }, [products, sortBy, selectedCategories, selectedPriceRange, selectedRating, selectedSizes])

  const activeFiltersCount = selectedCategories.length + (selectedPriceRange ? 1 : 0) + (selectedRating ? 1 : 0) + selectedSizes.length

  const toggleSection = (sec: keyof typeof expandedSections) =>
    setExpandedSections(s => ({ ...s, [sec]: !s[sec] }))

  const clearAll = () => {
    setSelectedCategories([])
    setSelectedPriceRange(null)
    setSelectedRating(0)
    setSelectedSizes([])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        <p className="text-xs text-gray-400 mt-1">{filtered.length} products found</p>
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 py-3 border-y border-gray-100">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="text-xs text-white px-1.5 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
              <X size={12} /> Clear All
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden md:block">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {selectedCategories.map(cat => (
            <span key={cat} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              {cat.replace(/-/g, ' ')}
              <button onClick={() => setSelectedCategories(s => s.filter(c => c !== cat))}><X size={10} /></button>
            </span>
          ))}
          {selectedPriceRange && (
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              {PRICE_RANGES.find(r => r.min === selectedPriceRange.min)?.label}
              <button onClick={() => setSelectedPriceRange(null)}><X size={10} /></button>
            </span>
          )}
          {selectedRating > 0 && (
            <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              {selectedRating}★ & above
              <button onClick={() => setSelectedRating(0)}><X size={10} /></button>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Filter Panel */}
        {filterOpen && (
          <aside className="w-56 flex-shrink-0 space-y-5">
            {/* Category */}
            <div>
              <button onClick={() => toggleSection('category')}
                className="filter-label flex items-center justify-between w-full">
                <span>Category</span>
                {expandedSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expandedSections.category && (
                <div className="space-y-2 mt-2">
                  {categories.map(cat => (
                    <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => setSelectedCategories(s =>
                          s.includes(cat.slug) ? s.filter(c => c !== cat.slug) : [...s, cat.slug]
                        )}
                        className="rounded"
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 capitalize">{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="border-t border-gray-100 pt-4">
              <button onClick={() => toggleSection('price')}
                className="filter-label flex items-center justify-between w-full">
                <span>Price Range</span>
                {expandedSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expandedSections.price && (
                <div className="space-y-2 mt-2">
                  {PRICE_RANGES.map(range => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange?.min === range.min}
                        onChange={() => setSelectedPriceRange({ min: range.min, max: range.max })}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900">{range.label}</span>
                    </label>
                  ))}
                  {selectedPriceRange && (
                    <button onClick={() => setSelectedPriceRange(null)} className="text-xs text-red-400 hover:text-red-600">
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="border-t border-gray-100 pt-4">
              <button onClick={() => toggleSection('rating')}
                className="filter-label flex items-center justify-between w-full">
                <span>Rating</span>
                {expandedSections.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expandedSections.rating && (
                <div className="space-y-2 mt-2">
                  {[4, 3, 2].map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === r}
                        onChange={() => setSelectedRating(r)}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 flex items-center gap-1">
                        {'★'.repeat(r)} & above
                      </span>
                    </label>
                  ))}
                  {selectedRating > 0 && (
                    <button onClick={() => setSelectedRating(0)} className="text-xs text-red-400">Clear</button>
                  )}
                </div>
              )}
            </div>

            {/* Size */}
            <div className="border-t border-gray-100 pt-4">
              <button onClick={() => toggleSection('size')}
                className="filter-label flex items-center justify-between w-full">
                <span>Size</span>
                {expandedSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expandedSections.size && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {allSizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizes(s => s.includes(sz) ? s.filter(x => x !== sz) : [...s, sz])}
                      className="text-xs px-2.5 py-1 border rounded transition-all"
                      style={selectedSizes.includes(sz)
                        ? { backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                        : { borderColor: '#e5e7eb', color: '#6b7280' }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">😕</p>
              <p className="font-semibold text-gray-900 mb-2">No products found</p>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
              <button onClick={clearAll} className="btn-outline text-sm">Clear All Filters</button>
            </div>
          ) : (
            <div className={`grid gap-4 ${filterOpen ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
