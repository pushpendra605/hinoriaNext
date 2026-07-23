import Link from 'next/link'
import type { SiteConfig } from '@/types'

interface FooterProps { site: SiteConfig }

export default function Footer({ site }: FooterProps) {
  return (
    <footer style={{ backgroundColor: "var(--color-dark)" }}>
      {/* Newsletter */}
      <div className="py-12 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h5
              className="text-white text-xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Want Style Ideas and Treats?
            </h5>
            <p className="text-gray-400 text-sm mb-6">
              Subscribe to get exclusive deals, style tips & more
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white flex-shrink-0 transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 mb-3">
                <img src={site.logo_white || site.logo} alt={site.name} className="h-9 w-auto" />
                <span
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {site.name}
                </span>
              </Link>
              <p className="text-gray-400 text-xs mb-5 leading-relaxed">
                {site.tagline}
              </p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { href: site.social.facebook, icon: "fa-facebook-f" },
                  { href: site.social.instagram, icon: "fa-instagram" },
                  { href: site.social.twitter, icon: "fa-twitter" },
                  { href: site.social.youtube, icon: "fa-youtube" },
                ]
                  .filter((s) => s.href)
                  .map((s) => (
                    <a
                      key={s.icon}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all text-xs"
                    >
                      <i className={`fab ${s.icon}`} />
                    </a>
                  ))}
              </div>
            </div>

            <div>
              <h6 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
                Support
              </h6>
              <ul className="space-y-2.5">
                {site.footerLinks.support.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
                Shop
              </h6>
              <ul className="space-y-2.5">
                {site.footerLinks.shop.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
                Company
              </h6>
              <ul className="space-y-2.5">
                {site.footerLinks.company.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
                Contact
              </h6>
              <ul className="space-y-2.5">
                {site.phone.map((ph, i) => (
                  <li key={i}>
                    <a
                      href={`tel:${ph}`}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {ph}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                  >
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <a href="https://dvanta.com/" target="_blank" rel="noreferrer" className="text-gray-500 text-xs">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
              Designed &amp; Developed by Dvanta Technologies Pvt. Ltd.
            </p>
          </a>

          <div className="flex items-center gap-2 flex-wrap">
            {["Mastercard", "Visa", "Amex", "PayPal", "UPI", "Razorpay"].map(
              (m) => (
                <span
                  key={m}
                  className="text-gray-500 text-[10px] bg-gray-800 px-2 py-1 rounded font-medium"
                >
                  {m}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
