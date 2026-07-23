"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductCard({
  product,
  showQuickAdd = true,
}: {
  product: Product;
  showQuickAdd?: boolean;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizes, setShowSizes] = useState(false);

  // ✅ hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();

  const { addItem, openCart } = useCartStore();
  const { toggle, has } = useWishlistStore();

  // ✅ FIX: SSR-safe wishlist
  const isWishlisted = mounted ? has(product.id) : false;

  const href = `/product/${product.gender}/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize && product.sizes.length > 1) {
      setShowSizes(true);
      return;
    }

    const size = selectedSize || product.sizes[0] || "One Size";

    addItem({
      productId: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      price: product.price,
      finalPrice: product.finalPrice,
      discountPercent: product.discountPercent,
      size,
      color: product.color,
      quantity: 1,
    });

    toast.success("Added to cart!", {
      duration: 1500,
      position: "bottom-center",
    });

    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggle(product.id);

    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      icon: isWishlisted ? "💔" : "❤️",
      duration: 1200,
      position: "bottom-center",
    });
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  return (
    <div className="product-card group relative">
      {product.discountPercent > 0 && (
        <span className="badge-discount">{product.discountPercent}% OFF</span>
      )}
      {product.isNewArrival && <span className="badge-new">NEW</span>}

      <Link
        href={href}
        className="block relative overflow-hidden bg-gray-50"
        style={{ aspectRatio: "3/4" }}
      >
        <img
          src={
            product.images?.[imgIdx] ||
            product.thumbnail ||
            "/images/placeholder.jpg"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onMouseEnter={() => product.images?.[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        />

        {/* ACTION BUTTONS */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          {/* ✅ Wishlist */}
          <button
            onClick={handleWishlist}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              size={14}
              fill={isWishlisted ? "var(--color-primary)" : "none"}
              style={{ color: "var(--color-primary)" }}
            />
          </button>

          {showQuickAdd && (
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ShoppingCart
                size={14}
                style={{ color: "var(--color-primary)" }}
              />
            </button>
          )}

          <button
            onClick={handleView}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Eye size={14} className="text-gray-600" />
          </button>
        </div>
      </Link>

      {/* Sizes */}
      {showSizes && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1.5">Select size:</p>
          <div className="flex gap-1 flex-wrap">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  setSelectedSize(sz);
                  setShowSizes(false);
                }}
                className="px-2 py-0.5 text-xs border rounded transition-all"
                style={
                  selectedSize === sz
                    ? {
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        borderColor: "var(--color-primary)",
                      }
                    : { borderColor: "#e5e7eb", color: "#6b7280" }
                }
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-3">
        <Link href={href}>
          <p className="text-[10px] text-gray-400 mb-0.5 font-medium uppercase tracking-wide">
            {product.brand}
          </p>
          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-2 hover:text-gray-600 transition-colors">
            {product.name}
          </p>
        </Link>

        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                fill={s <= Math.round(product.rating) ? "#f59e0b" : "none"}
                stroke={s <= Math.round(product.rating) ? "#f59e0b" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-base font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            ₹{product.finalPrice}
          </span>
          {product.discountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-2 text-xs font-medium rounded border transition-all duration-200"
          style={{
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--color-primary)";
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
