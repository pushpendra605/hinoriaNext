import fs from 'fs/promises';
import path from 'path';

// ─── Type Imports ────────────────────────────────────────────────────────────
import type {
  SiteConfig, HomeConfig, Product, Category, User,
  Order, InventoryItem, Review, Coupon, OrderStatusHistory
} from '@/types';

// ─── FS-BACKED JSON "DATABASE" ───────────────────────────────────────────────
// All data lives in /data/<client>/*.json and is read/written at request time.
// This keeps admin writes instantly visible without a server restart, and
// gives every function here a 1:1 signature with what a real DB/API layer
// would expose later (see README for the migration guide).

function dataDir(client: string) {
  return path.join(process.cwd(), 'data', client);
}

async function readJSON<T>(client: string, file: string): Promise<T> {
  const filePath = path.join(dataDir(client), `${file}.json`);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

async function writeJSON<T>(client: string, file: string, data: T): Promise<void> {
  const filePath = path.join(dataDir(client), `${file}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── CLIENT CONFIG ────────────────────────────────────────────────────────────

export async function getSiteConfig(client = 'henoria'): Promise<SiteConfig> {
  return readJSON<SiteConfig>(client, 'site');
}

export async function getHomeConfig(client = 'henoria'): Promise<HomeConfig> {
  return readJSON<HomeConfig>(client, 'home');
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function getAllProducts(client = 'henoria'): Promise<Product[]> {
  return readJSON<Product[]>(client, 'products');
}

// Public-facing product lists only ever show published items
export async function getPublishedProducts(client = 'henoria'): Promise<Product[]> {
  const products = await getAllProducts(client);
  return products.filter(p => !p.status || p.status === 'published');
}

export async function getProductById(id: string, client = 'henoria'): Promise<Product | null> {
  const products = await getAllProducts(client);
  return products.find(p => p.id === id) ?? null;
}

export async function getProductsByGender(gender: string, client = 'henoria'): Promise<Product[]> {
  const products = await getPublishedProducts(client);
  return products.filter(p => p.gender === gender || p.gender === 'unisex');
}

export async function getProductsByCategory(slug: string, client = 'henoria'): Promise<Product[]> {
  const products = await getPublishedProducts(client);
  return products.filter(p => p.category === slug || p.tags?.includes(slug));
}

export async function getFeaturedProducts(client = 'henoria'): Promise<Product[]> {
  const products = await getPublishedProducts(client);
  return products.filter(p => p.isFeatured);
}

export async function getNewArrivals(client = 'henoria'): Promise<Product[]> {
  const products = await getPublishedProducts(client);
  return products.filter(p => p.isNewArrival);
}

export async function getProductsByIds(ids: string[], client = 'henoria'): Promise<Product[]> {
  const products = await getAllProducts(client);
  return products.filter(p => ids.includes(p.id));
}

export async function searchProducts(query: string, client = 'henoria'): Promise<Product[]> {
  const products = await getPublishedProducts(client);
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags?.some((t: string) => t.toLowerCase().includes(q))
  );
}

export async function createProduct(product: Product, client = 'henoria'): Promise<Product> {
  const products = await getAllProducts(client);
  products.unshift(product);
  await writeJSON(client, 'products', products);

  // Seed an inventory record so it shows up in Inventory/stock tracking immediately
  const inventory = await getAllInventory(client);
  if (!inventory.find(i => i.productId === product.id)) {
    const sizes: Record<string, number> = {};
    product.sizes.forEach(sz => { sizes[sz] = 0; });
    const totalStock = 0;
    inventory.unshift({
      productId: product.id,
      sizes,
      totalStock,
      reserved: 0,
      available: totalStock,
      lastUpdated: new Date().toISOString(),
    });
    await writeJSON(client, 'inventory', inventory);
  }

  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>, client = 'henoria'): Promise<Product | null> {
  const products = await getAllProducts(client);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...patch };
  await writeJSON(client, 'products', products);
  return products[idx];
}

export async function deleteProduct(id: string, client = 'henoria'): Promise<boolean> {
  const products = await getAllProducts(client);
  const next = products.filter(p => p.id !== id);
  if (next.length === products.length) return false;
  await writeJSON(client, 'products', next);
  return true;
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export async function getAllCategories(client = 'henoria'): Promise<Category[]> {
  return readJSON<Category[]>(client, 'categories');
}

export async function getCategoryBySlug(slug: string, client = 'henoria'): Promise<Category | null> {
  const cats = await getAllCategories(client);
  return cats.find(c => c.slug === slug) ?? null;
}

export async function createCategory(category: Category, client = 'henoria'): Promise<Category> {
  const cats = await getAllCategories(client);
  cats.push(category);
  await writeJSON(client, 'categories', cats);
  return category;
}

export async function updateCategory(id: string, patch: Partial<Category>, client = 'henoria'): Promise<Category | null> {
  const cats = await getAllCategories(client);
  const idx = cats.findIndex(c => c.id === id);
  if (idx === -1) return null;
  cats[idx] = { ...cats[idx], ...patch };
  await writeJSON(client, 'categories', cats);
  return cats[idx];
}

export async function deleteCategory(id: string, client = 'henoria'): Promise<boolean> {
  const cats = await getAllCategories(client);
  const next = cats.filter(c => c.id !== id);
  if (next.length === cats.length) return false;
  await writeJSON(client, 'categories', next);
  return true;
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function getAllUsers(client = 'henoria'): Promise<User[]> {
  return readJSON<User[]>(client, 'users');
}

export async function getUserById(id: string, client = 'henoria'): Promise<User | null> {
  const users = await getAllUsers(client);
  return users.find(u => u.id === id) ?? null;
}

export async function getUserByEmail(email: string, client = 'henoria'): Promise<User | null> {
  const users = await getAllUsers(client);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function updateUser(id: string, patch: Partial<User>, client = 'henoria'): Promise<User | null> {
  const users = await getAllUsers(client);
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  await writeJSON(client, 'users', users);
  return users[idx];
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export async function getAllOrders(client = 'henoria'): Promise<Order[]> {
  return readJSON<Order[]>(client, 'orders');
}

export async function getOrderById(id: string, client = 'henoria'): Promise<Order | null> {
  const orders = await getAllOrders(client);
  return orders.find(o => o.id === id) ?? null;
}

export async function getOrdersByUser(userId: string, client = 'henoria'): Promise<Order[]> {
  const orders = await getAllOrders(client);
  return orders.filter(o => o.userId === userId);
}

export async function createOrder(order: Order, client = 'henoria'): Promise<Order> {
  const orders = await getAllOrders(client);
  orders.unshift(order);
  await writeJSON(client, 'orders', orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  note: string,
  client = 'henoria'
): Promise<Order | null> {
  const orders = await getAllOrders(client);
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  const historyEntry: OrderStatusHistory = { status, timestamp: new Date().toISOString(), note };
  orders[idx] = {
    ...orders[idx],
    status,
    updatedAt: new Date().toISOString(),
    statusHistory: [...orders[idx].statusHistory, historyEntry],
  };
  await writeJSON(client, 'orders', orders);
  return orders[idx];
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────

export async function getAllInventory(client = 'henoria'): Promise<InventoryItem[]> {
  return readJSON<InventoryItem[]>(client, 'inventory');
}

export async function getInventoryByProduct(productId: string, client = 'henoria'): Promise<InventoryItem | null> {
  const inv = await getAllInventory(client);
  return inv.find(i => i.productId === productId) ?? null;
}

export async function isInStock(productId: string, size: string, client = 'henoria'): Promise<boolean> {
  const inv = await getAllInventory(client);
  const item = inv.find(i => i.productId === productId);
  if (!item) return false;
  return ((item.sizes as Record<string, number>)[size] ?? 0) > 0;
}

export async function updateInventory(
  productId: string,
  sizes: Record<string, number>,
  client = 'henoria'
): Promise<InventoryItem> {
  const inv = await getAllInventory(client);
  const totalStock = Object.values(sizes).reduce((a, b) => a + b, 0);
  const idx = inv.findIndex(i => i.productId === productId);
  const record: InventoryItem = {
    productId,
    sizes,
    totalStock,
    reserved: idx >= 0 ? inv[idx].reserved : 0,
    available: totalStock - (idx >= 0 ? inv[idx].reserved : 0),
    lastUpdated: new Date().toISOString(),
  };
  if (idx >= 0) inv[idx] = record;
  else inv.push(record);
  await writeJSON(client, 'inventory', inv);
  return record;
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export async function getAllReviews(client = 'henoria'): Promise<Review[]> {
  return readJSON<Review[]>(client, 'reviews');
}

export async function getReviewsByProduct(productId: string, client = 'henoria'): Promise<Review[]> {
  const reviews = await getAllReviews(client);
  return reviews.filter(r => r.productId === productId);
}

export async function getAverageRating(productId: string, client = 'henoria'): Promise<number> {
  const reviews = await getReviewsByProduct(productId, client);
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export async function deleteReview(id: string, client = 'henoria'): Promise<boolean> {
  const reviews = await getAllReviews(client);
  const next = reviews.filter(r => r.id !== id);
  if (next.length === reviews.length) return false;
  await writeJSON(client, 'reviews', next);
  return true;
}

// ─── COUPONS ──────────────────────────────────────────────────────────────────

export async function getAllCoupons(client = 'henoria'): Promise<Coupon[]> {
  return readJSON<Coupon[]>(client, 'coupons');
}

export async function getCouponByCode(code: string, client = 'henoria'): Promise<Coupon | null> {
  const coupons = await getAllCoupons(client);
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive) ?? null;
}

export async function validateCoupon(
  code: string,
  orderTotal: number,
  client = 'henoria'
): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; message?: string }> {
  const coupons = await getAllCoupons(client);
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (orderTotal < coupon.minOrderValue)
    return { valid: false, message: `Minimum order ₹${coupon.minOrderValue} required` };
  const now = new Date();
  if (new Date(coupon.expiresAt) < now) return { valid: false, message: 'Coupon has expired' };
  const discount =
    coupon.type === 'percentage'
      ? Math.min((orderTotal * coupon.value) / 100, coupon.maxDiscount)
      : coupon.value;
  return { valid: true, coupon, discount: Math.round(discount) };
}

export async function createCoupon(coupon: Coupon, client = 'henoria'): Promise<Coupon> {
  const coupons = await getAllCoupons(client);
  coupons.unshift(coupon);
  await writeJSON(client, 'coupons', coupons);
  return coupon;
}

export async function updateCoupon(id: string, patch: Partial<Coupon>, client = 'henoria'): Promise<Coupon | null> {
  const coupons = await getAllCoupons(client);
  const idx = coupons.findIndex(c => c.id === id);
  if (idx === -1) return null;
  coupons[idx] = { ...coupons[idx], ...patch };
  await writeJSON(client, 'coupons', coupons);
  return coupons[idx];
}

export async function deleteCoupon(id: string, client = 'henoria'): Promise<boolean> {
  const coupons = await getAllCoupons(client);
  const next = coupons.filter(c => c.id !== id);
  if (next.length === coupons.length) return false;
  await writeJSON(client, 'coupons', next);
  return true;
}

export async function incrementCouponUsage(code: string, client = 'henoria'): Promise<void> {
  const coupons = await getAllCoupons(client);
  const idx = coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
  if (idx === -1) return;
  coupons[idx] = { ...coupons[idx], usedCount: coupons[idx].usedCount + 1 };
  await writeJSON(client, 'coupons', coupons);
}
