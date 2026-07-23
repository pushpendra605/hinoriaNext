"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
  } = useCartStore();

  // ✅ Hydration fix
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const total = getTotal();
  const deliveryFree = subtotal >= 999;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99] backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[100] flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} style={{ color: "var(--color-primary)" }} />
            <h2 className="font-semibold text-gray-900">Shopping Cart</h2>
            {items.length > 0 && (
              <span
                className="text-xs text-white px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>

          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {!deliveryFree && subtotal > 0 && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-amber-700 font-medium">
                Add ₹{999 - subtotal} more for free delivery!
              </span>
              <span className="text-amber-600">
                {Math.round((subtotal / 999) * 100)}%
              </span>
            </div>

            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {deliveryFree && subtotal > 0 && (
          <div className="px-5 py-2.5 bg-green-50 border-b border-green-100 text-xs text-green-700 font-medium text-center">
            🎉 You've unlocked free delivery!
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>

              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Your cart is empty
                </p>
                <p className="text-xs text-gray-500">
                  Add items to get started
                </p>
              </div>

              <button onClick={closeCart} className="btn-primary text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-3"
              >
                {/* Image */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                  <img
                    src={item.thumbnail || "/images/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
                    {item.name}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      Size: {item.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        ₹{item.finalPrice}
                      </span>

                      {item.discountPercent > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.price}
                        </span>
                      )}
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1,
                          )
                        }
                        className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <Minus size={10} />
                      </button>

                      <span className="w-6 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1,
                          )
                        }
                        className="w-6 h-6 rounded flex items-center justify-center border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="p-1 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 self-start mt-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-4">
            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span
                  className={
                    deliveryFree ? "text-green-600 font-medium" : "font-medium"
                  }
                >
                  {deliveryFree ? "FREE" : "₹49"}
                </span>
              </div>

              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span style={{ color: "var(--color-primary)" }}>₹{total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full justify-center text-sm"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>

              <button
                onClick={closeCart}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
