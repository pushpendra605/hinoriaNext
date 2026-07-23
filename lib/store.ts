'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId && i.size === newItem.size
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId && i.size === newItem.size
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, newItem], isOpen: true }
        })
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        }))
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0)
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 999 ? subtotal : subtotal + 49
      },

      getCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'henoria-cart' }
  )
)

// ─── Auth Store ─────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  avatar?: string
  addresses?: import('@/types').Address[]
}

interface AuthStore {
  user: AuthUser | null
  login: (user: AuthUser | null) => void
  logout: () => void
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'phone' | 'avatar'>>) => void
  addAddress: (address: import('@/types').Address) => void
  updateAddress: (address: import('@/types').Address) => void
  removeAddress: (addressId: string) => void
  setDefaultAddress: (addressId: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateProfile: (data) =>
        set((s) => (s.user ? { user: { ...s.user, ...data } } : s)),
      addAddress: (address) =>
        set((s) => {
          if (!s.user) return s
          const addresses = s.user.addresses ?? []
          const isFirst = addresses.length === 0
          return {
            user: {
              ...s.user,
              addresses: [...addresses, { ...address, isDefault: isFirst || address.isDefault }],
            },
          }
        }),
      updateAddress: (address) =>
        set((s) => {
          if (!s.user) return s
          const addresses = (s.user.addresses ?? []).map((a) =>
            a.id === address.id ? address : a
          )
          return { user: { ...s.user, addresses } }
        }),
      removeAddress: (addressId) =>
        set((s) => {
          if (!s.user) return s
          const addresses = (s.user.addresses ?? []).filter((a) => a.id !== addressId)
          return { user: { ...s.user, addresses } }
        }),
      setDefaultAddress: (addressId) =>
        set((s) => {
          if (!s.user) return s
          const addresses = (s.user.addresses ?? []).map((a) => ({
            ...a,
            isDefault: a.id === addressId,
          }))
          return { user: { ...s.user, addresses } }
        }),
    }),
    { name: 'henoria-auth' }
  )
)

// ─── Wishlist Store ─────────────────────────────────────────────────────────
interface WishlistStore {
  items: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) =>
        set((s) => ({
          items: s.items.includes(id) ? s.items.filter((i) => i !== id) : [...s.items, id],
        })),
      has: (id) => get().items.includes(id),
    }),
    { name: 'henoria-wishlist' }
  )
)
