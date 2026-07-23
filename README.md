# 🛍️ Henoria — Production-Ready Next.js E-Commerce Platform

A complete, multi-tenant e-commerce platform built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. All data is driven from JSON files with a clean abstraction layer for easy database migration.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@henoria.com      | admin123   |
| User  | priya@example.com      | user123    |
| User  | rahul@example.com      | rahul123   |

---

## 📁 Project Structure

```
henoria-nextjs/
│
├── app/                          # Next.js App Router
│   ├── (store)/                  # Public store pages
│   │   ├── page.tsx              # Home page
│   │   ├── girls/                # Women's products
│   │   ├── boys/                 # Men's products
│   │   ├── bags/                 # Bags & accessories
│   │   ├── product/[cat]/[id]/   # Product detail
│   │   ├── checkout/             # Checkout flow
│   │   ├── order-confirmation/   # Post-order page
│   │   ├── search/               # Search results
│   │   └── login/                # Auth page (login + register)
│   │
│   ├── (user)/dashboard/         # User dashboard (protected)
│   │   ├── page.tsx              # Dashboard home
│   │   ├── orders/               # My orders + tracking
│   │   ├── profile/              # Edit profile
│   │   ├── address/              # Manage addresses
│   │   └── wishlist/             # Saved products
│   │
│   ├── (admin)/admin/            # Admin panel (admin-only)
│   │   ├── page.tsx              # Dashboard + stats + charts
│   │   ├── products/             # CRUD products
│   │   ├── categories/           # Manage categories
│   │   ├── orders/               # Orders + status update
│   │   ├── inventory/            # Stock tracking
│   │   ├── users/                # User management
│   │   ├── coupons/              # Coupon CRUD
│   │   └── reviews/              # Moderate reviews
│   │
│   └── api/                      # API Routes
│       ├── auth/login/           # POST: Login
│       ├── coupon/               # GET: Validate coupon
│       ├── products/             # GET: Products
│       └── admin/                # Admin data endpoints
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Data-driven navbar + mega menus
│   │   ├── Footer.tsx            # Data-driven footer
│   │   └── CartSidebar.tsx       # Sliding cart panel
│   ├── shop/
│   │   ├── ProductCard.tsx       # Reusable product card
│   │   ├── ProductListing.tsx    # Listing + filters
│   │   └── ProductDetailClient.tsx # Product detail with gallery
│   └── Providers.tsx             # Toast notifications
│
├── data/
│   └── henoria/                  # ← ALL YOUR DATA HERE (JSON)
│       ├── site.json             # Branding, theme, navbar, footer
│       ├── home.json             # Banners, featured sections
│       ├── products.json         # All products
│       ├── categories.json       # Category hierarchy
│       ├── users.json            # User accounts
│       ├── orders.json           # Order records
│       ├── inventory.json        # Stock levels
│       ├── reviews.json          # Product reviews
│       └── coupons.json          # Discount coupons
│
├── lib/
│   ├── dataLoader.ts             # ← DB-MIGRATION LAYER (change here only!)
│   └── store.ts                  # Zustand (cart, auth, wishlist)
│
└── types/
    └── index.ts                  # TypeScript type definitions
```

---

## 🗄️ Migrating to a Real Database

The entire data access is abstracted in **`/lib/dataLoader.ts`**.

To switch from JSON to MySQL / PostgreSQL / MongoDB:

```typescript
// BEFORE (JSON):
export async function getAllProducts(client = 'henoria'): Promise<Product[]> {
  return readJSON<Product[]>(client, 'products')
}

// AFTER (MySQL with Prisma):
export async function getAllProducts(client = 'henoria'): Promise<Product[]> {
  return await prisma.product.findMany({ where: { clientId: client } })
}

// AFTER (MongoDB):
export async function getAllProducts(client = 'henoria'): Promise<Product[]> {
  return await db.collection('products').find({ clientId: client }).toArray()
}
```

**All other files (pages, components, API routes) stay exactly the same.**

---

## 📦 Features

### 🏪 Customer Store
- ✅ Home page with banners, featured products, new arrivals
- ✅ Men / Women / Kids / Bags product pages
- ✅ Mega menu navigation (from site.json)
- ✅ Product detail with image gallery, size selector, reviews
- ✅ Add to Cart (sliding sidebar) with quantity controls
- ✅ Free delivery progress bar
- ✅ Wishlist (persisted in localStorage)
- ✅ Full-text product search
- ✅ Filter by category, price, rating, size
- ✅ Sort by price, rating, discount, newest
- ✅ Checkout with coupon code validation
- ✅ Order confirmation page

### 👤 User Dashboard
- ✅ Login / Register with role-based routing
- ✅ Dashboard overview with quick links
- ✅ My Orders with status timeline
- ✅ Profile editor
- ✅ Address book (add/edit/delete/default)
- ✅ Wishlist management

### 🔧 Admin Panel (`/admin`)
- ✅ Dashboard with revenue chart, order stats
- ✅ Products CRUD (add, edit, delete with modal)
- ✅ Categories CRUD
- ✅ Orders management with status dropdown
- ✅ Inventory tracking (per-size stock, low stock alerts)
- ✅ User management with role toggle
- ✅ Coupons CRUD with usage tracking
- ✅ Reviews moderation

### 🧱 Architecture
- ✅ JSON → DB migration-ready abstraction layer
- ✅ Multi-tenant support (`?client=client1`)
- ✅ Theme driven by `site.json` (colors, fonts)
- ✅ Navbar mega menus from JSON
- ✅ Footer links from JSON
- ✅ TypeScript throughout
- ✅ Zustand for cart/auth/wishlist state
- ✅ CSS variables for theming

---

## 🎨 Adding a New Client / Store

1. Create `/data/client2/` folder
2. Copy all JSON files from `/data/henoria/`
3. Edit `site.json` with new branding/theme
4. Access via `?client=client2` (or configure subdomain routing)

---

## 💳 Payment Integration (Future)

The checkout page is ready for Razorpay / Stripe:

```typescript
// In checkout page, replace the "Place Order" handler:
const razorpay = new Razorpay({
  key: process.env.RAZORPAY_KEY_ID,
  amount: total * 100,
  currency: 'INR',
  handler: (response) => { /* confirm order */ }
})
razorpay.open()
```

---

## 📸 Image Setup

Copy your extracted images to:
```
public/images/
  logo.png
  logo1.png
  headerlogo.png
  products/
    women/
    boys/
    bags/
```

---

## 🛠️ Tech Stack

| Tool         | Purpose                    |
|--------------|----------------------------|
| Next.js 14   | Framework (App Router)     |
| TypeScript   | Type safety                |
| Tailwind CSS | Styling                    |
| Zustand      | Client state management    |
| react-hot-toast | Notifications           |
| lucide-react | Icons                      |

---

**© 2024 Henoria. Designed & Developed by Munendra Rajput / Shree Krishna.**
