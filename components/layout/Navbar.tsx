"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, useAuthStore, useWishlistStore } from "@/lib/store";
import type { SiteConfig } from "@/types";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  MapPin,
  ChevronRight,
} from "lucide-react";

interface NavbarProps {
  site: SiteConfig;
}

export default function Navbar({ site }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { getCount, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const { items: wishlist } = useWishlistStore();
  const cartCount = getCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  return (
    <>
      {/* Announcement */}
      {site.announcement && (
        <div className="promo-strip text-[11px] px-4 truncate">{site.announcement}</div>
      )}

      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 sm:h-[72px] gap-3 sm:gap-6">
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src={site.logo}
                alt={site.name}
                className="h-8 sm:h-9 w-auto"
              />
              <span
                className="text-xl sm:text-2xl font-bold hidden xs:inline"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
              >
                {site.name}
                <span style={{ color: "var(--color-primary)" }}>.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center mx-auto">
              {site.mainNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="px-4 py-6 text-sm font-medium text-gray-700 hover:text-[var(--color-primary)] relative group transition-colors capitalize"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 origin-center transition-transform" style={{ backgroundColor: "var(--color-primary)" }}></span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* User */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  aria-label="Account"
                >
                  <User size={19} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden animate-slide-down z-50">
                    {user ? (
                      <>
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        <div className="py-1.5">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                          >
                            <LayoutDashboard size={15} /> Dashboard
                          </Link>

                          <Link
                            href="/dashboard/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                          >
                            <Package size={15} /> My Orders
                          </Link>

                          <Link
                            href="/dashboard/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                          >
                            <Heart size={15} /> Wishlist
                          </Link>

                          <Link
                            href="/dashboard/address"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                          >
                            <MapPin size={15} /> Addresses
                          </Link>
                        </div>

                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut size={15} /> Logout
                        </button>
                      </>
                    ) : (
                      <div className="p-2">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-white mb-1.5"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          Sign In <ChevronRight size={14} />
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 border border-gray-200"
                        >
                          Create Account <ChevronRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/dashboard/wishlist" className="relative p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors hidden sm:inline-flex" aria-label="Wishlist">
                <Heart size={19} />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 text-[10px] leading-none w-4 h-4 flex items-center justify-center rounded-full text-white font-semibold" style={{ backgroundColor: "var(--color-primary)" }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={toggleCart} className="relative p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors" aria-label="Cart">
                <ShoppingCart size={19} />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 text-[10px] leading-none w-4 h-4 flex items-center justify-center rounded-full text-white font-semibold" style={{ backgroundColor: "var(--color-primary)" }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Search for products, brands and more..."
                  />
                </div>
                <button type="submit" className="btn-primary px-5 text-sm">Search</button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-down max-h-[75vh] overflow-y-auto">
            <div className="p-4 space-y-1">
              {site.mainNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3 px-2 text-sm font-medium text-gray-700 border-b border-gray-50 capitalize"
                >
                  {item.label}
                  <ChevronRight size={15} className="text-gray-300" />
                </Link>
              ))}
              {!user && (
                <div className="pt-3 flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center text-sm">Sign In</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 justify-center text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
