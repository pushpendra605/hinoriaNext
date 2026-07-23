import Link from 'next/link'
import { Home, Search, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black mb-4 leading-none" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Page Not Found
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home size={14} /> Back to Home
          </Link>
          <Link href="/girls" className="btn-outline">
            Browse Products <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-4">Or search for what you're looking for:</p>
          <form action="/search" className="flex gap-2 max-w-sm mx-auto">
            <input name="q" placeholder="Search products..." className="form-input flex-1 text-sm" />
            <button type="submit" className="btn-primary px-4 py-2">
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
