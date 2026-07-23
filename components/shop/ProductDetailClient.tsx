'use client'
import { useState } from 'react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import type { Product, Review, InventoryItem } from '@/types'
import { Heart, Star, ShoppingCart, Check, Truck, RefreshCw, Shield, ChevronRight, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Props { product: Product; reviews: Review[]; inventory: InventoryItem | null }

export default function ProductDetailClient({ product, reviews, inventory }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const { addItem, openCart } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const isWishlisted = has(product.id)

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating

  const getSizeStock = (size: string) => inventory?.sizes[size] ?? 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size!', { position: 'bottom-center' })
      return
    }
    if (getSizeStock(selectedSize) < quantity) {
      toast.error('Not enough stock!', { position: 'bottom-center' })
      return
    }
    addItem({
      productId: product.id, name: product.name, thumbnail: product.thumbnail,
      price: product.price, finalPrice: product.finalPrice, discountPercent: product.discountPercent,
      size: selectedSize, color: product.color, quantity,
    })
    toast.success('Added to cart!', { duration: 1500, position: 'bottom-center' })
    openCart()
  }

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    r, count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length ? Math.round((reviews.filter(rev => rev.rating === r).length / reviews.length) * 100) : 0,
  }))

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/${product.gender === "women" ? "girls" : product.gender === "men" ? "boys" : "bags"}`}
          className="hover:text-gray-600 capitalize"
        >
          {product.gender}
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={product.images[activeImg] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.discountPercent > 0 && (
              <span
                className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {product.discountPercent}% OFF
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? "scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                  style={
                    activeImg === i
                      ? { borderColor: "var(--color-primary)" }
                      : {}
                  }
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-400">
              {product.brand}
            </p>
            <h1
              className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= Math.round(avgRating) ? "#f59e0b" : "none"}
                    stroke={s <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({reviews.length > 0 ? reviews.length : product.reviewCount}{" "}
                reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span
              className="text-3xl font-black"
              style={{ color: "var(--color-primary)" }}
            >
              ₹{product.finalPrice}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price}
                </span>
                <span className="text-sm font-bold text-green-600">
                  Save {product.discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Color */}
          {product.color && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Color:{" "}
                <span className="text-gray-800 font-medium">
                  {product.color}
                </span>
              </p>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Size:{" "}
                {selectedSize && (
                  <span className="text-gray-800 font-bold ml-1">
                    {selectedSize}
                  </span>
                )}
              </p>
              <Link href="/size-guide" className="flex items-center gap-1">
                <button
                  className="text-xs font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  Size Guide
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const stock = getSizeStock(size);
                const isOut = stock === 0;
                return (
                  <button
                    key={size}
                    onClick={() => !isOut && setSelectedSize(size)}
                    disabled={isOut}
                    className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${isOut ? "opacity-30 cursor-not-allowed line-through" : "cursor-pointer hover:shadow-sm"}`}
                    style={
                      selectedSize === size
                        ? {
                            backgroundColor: "var(--color-primary)",
                            color: "white",
                            borderColor: "var(--color-primary)",
                          }
                        : { borderColor: "#e5e7eb", color: "#374151" }
                    }
                  >
                    {size}
                    {stock > 0 && stock <= 3 && !isOut && (
                      <span className="block text-[9px] text-orange-500">
                        Only {stock} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 text-sm font-semibold border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              {selectedSize && getSizeStock(selectedSize) > 0 && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={12} /> {getSizeStock(selectedSize)} in stock
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 justify-center text-sm py-3"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button
              onClick={() => {
                toggle(product.id);
                toast(
                  isWishlisted
                    ? "Removed from wishlist"
                    : "❤️ Added to wishlist!",
                  { duration: 1200, position: "bottom-center" },
                );
              }}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <Heart
                size={18}
                fill={isWishlisted ? "var(--color-primary)" : "none"}
                style={{ color: "var(--color-primary)" }}
              />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            {[
              { icon: Truck, title: "Free Delivery", sub: "Above ₹999" },
              { icon: RefreshCw, title: "Easy Returns", sub: "30 days" },
              { icon: Shield, title: "Secure Pay", sub: "100% safe" },
            ].map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-1 text-center p-2 bg-gray-50 rounded-lg"
              >
                <Icon size={16} style={{ color: "var(--color-primary)" }} />
                <p className="text-xs font-medium text-gray-800">{title}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Details + Reviews */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200 mb-6">
          {(["details", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-current" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              style={
                activeTab === tab
                  ? {
                      color: "var(--color-primary)",
                      borderColor: "var(--color-primary)",
                    }
                  : {}
              }
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : tab}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Product Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
              {product.features?.filter(Boolean).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.filter(Boolean).map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 flex-shrink-0 text-green-500"
                        />{" "}
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {product.material && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Material & Care
                  </h4>
                  <p className="text-sm text-gray-600">{product.material}</p>
                </div>
              )}
              {product.modelInfo && product.modelInfo.height && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Model Info
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {Object.entries(product.modelInfo).map(
                      ([key, val]) =>
                        val && (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize text-gray-400">
                              {key}:
                            </span>
                            <span className="font-medium">{val}</span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-center mb-4">
                <p
                  className="text-5xl font-black"
                  style={{ color: "var(--color-primary)" }}
                >
                  {avgRating.toFixed(1)}
                </p>
                <div className="flex justify-center gap-0.5 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      fill={s <= Math.round(avgRating) ? "#f59e0b" : "none"}
                      stroke={
                        s <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db"
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {reviews.length} verified reviews
                </p>
              </div>
              <div className="space-y-2">
                {ratingDist.map(({ r, count, pct }) => (
                  <div key={r} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4">{r}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: "#f59e0b" }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-5">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Review List */}
            <div className="md:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={11}
                              fill={s <= review.rating ? "#f59e0b" : "none"}
                              stroke={
                                s <= review.rating ? "#f59e0b" : "#d1d5db"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                        {review.verified && (
                          <span className="text-[10px] text-green-600">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {review.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {review.body}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {review.helpful} people found this helpful
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
