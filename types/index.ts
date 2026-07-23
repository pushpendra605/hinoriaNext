// ================================================================
// HENORIA — TYPE DEFINITIONS
// Replace these with your DB model types when migrating
// ================================================================

export interface SiteConfig {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  logo_white: string;
  favicon: string;
  email: string;
  phone: string[];
  address: string;
  social: { facebook: string; instagram: string; twitter: string; youtube: string };
  theme: { primaryColor: string; primaryHover: string; darkColor: string; accentColor: string; goldColor?: string; fontHeading: string; fontBody: string };
  announcement: string;
  currency: string;
  mainNav: NavItem[];
  megaMenus: Record<string, MegaMenu>;
  footerLinks: { support: FooterLink[]; shop: FooterLink[]; company: FooterLink[] };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  megaMenu?: string;
}

export interface MegaMenu {
  accentColor: string;
  columns: MegaMenuColumn[];
}

export interface MegaMenuColumn {
  heading: string;
  href?: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface HomeConfig {
  heroBanners: HeroBanner[];
  categoryBanners: CategoryBanner[];
  topSellerSection: { heading: string; subheading: string; productIds: string[] };
  newArrivalsSection: { heading: string; subheading: string; productIds: string[] };
  dealOfDaySection: { heading: string; endsAt: string; productIds: string[] };
  features: { icon: string; title: string; desc: string }[];
  promoStrip: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaText: string;
  ctaHref: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  backgroundImage: string;
  align: 'left' | 'right' | 'center';
  textColor: 'dark' | 'white';
}

export interface CategoryBanner {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  category: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  color: string;
  material: string;
  features: string[];
  sizes: string[];
  modelInfo?: { height: string; bust: string; waist: string; hips: string; size: string };
  images: string[];
  thumbnail: string;
  tags: string[];
  brand: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  status: 'published' | 'draft' | 'pending';
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  gender: string;
  parentSlug: string;
  image: string;
  productCount: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  avatar: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  thumbnail: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Omit<Address, 'id' | 'label' | 'isDefault'>;
  couponApplied: string | null;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  productId: string;
  sizes: Record<string, number>;
  totalStock: number;
  reserved: number;
  available: number;
  lastUpdated: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  applicableFor: string;
}

export interface CartItem {
  productId: string;
  name: string;
  thumbnail: string;
  price: number;
  finalPrice: number;
  discountPercent: number;
  size: string;
  color: string;
  quantity: number;
}

export interface FilterOptions {
  gender?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'discount';
  search?: string;
}
