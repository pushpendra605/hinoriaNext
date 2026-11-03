import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = { title: 'Fashion Blog' }

const blogs = [
  { id: 1, title: '10 Must-Have Wardrobe Essentials for Every Woman', slug: 'wardrobe-essentials-women', category: 'Fashion', date: 'Mar 15, 2024', readTime: '5 min read', image: '/images/products/product-1.jpg', excerpt: 'Building a capsule wardrobe doesn\'t have to be complicated. We\'ve curated the 10 pieces every woman needs to look effortlessly stylish all year round.', author: 'Priya Sharma', featured: true },
  { id: 2, title: 'Men\'s Fashion Trends to Watch in 2024', slug: 'mens-fashion-2024', category: 'Trends', date: 'Mar 10, 2024', readTime: '4 min read', image: '/images/products/boys/product-2.jpg', excerpt: 'From quiet luxury to bold street style, here are the trends defining menswear this year. Stay ahead of the fashion curve with our expert picks.', author: 'Rahul Kumar', featured: true },
  { id: 3, title: 'How to Style a Little Black Dress 5 Different Ways', slug: 'style-little-black-dress', category: 'Style Tips', date: 'Mar 5, 2024', readTime: '3 min read', image: '/images/products/product-120.jpg', excerpt: 'The LBD is the ultimate versatile piece. Whether you\'re heading to the office or a night out, here are five ways to transform this classic.', author: 'Priya Sharma', featured: false },
  { id: 4, title: 'The Complete Guide to Summer Fabrics', slug: 'summer-fabrics-guide', category: 'Tips', date: 'Feb 28, 2024', readTime: '6 min read', image: '/images/products/product-121.jpg', excerpt: 'Beat the heat without sacrificing style. We break down the best fabrics for staying cool and looking great during the hot summer months.', author: 'Anita Mehta', featured: false },
  { id: 5, title: 'Kids Fashion: Comfort Meets Style', slug: 'kids-fashion-comfort-style', category: 'Kids', date: 'Feb 20, 2024', readTime: '4 min read', image: '/images/products/product-08.jpeg', excerpt: 'Finding clothes that kids love to wear AND parents approve of can be tricky. Here are our top picks for stylish yet comfortable kids\' clothing.', author: 'Sunita Roy', featured: false },
  { id: 6, title: 'Sustainable Fashion: Our Commitment to the Planet', slug: 'sustainable-fashion-commitment', category: 'Sustainability', date: 'Feb 15, 2024', readTime: '5 min read', image: '/images/products/product-122.jpg', excerpt: 'At Henoria, we believe fashion and sustainability can go hand in hand. Learn about our initiatives to reduce our environmental footprint.', author: 'Munendra Rajput', featured: false },
]

const categories = ['All', 'Fashion', 'Trends', 'Style Tips', 'Tips', 'Kids', 'Sustainability']

export default function BlogPage() {
  const featured = blogs.filter(b => b.featured)
  const regular = blogs.filter(b => !b.featured)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-14 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-400">Insights & Inspiration</p>
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>Our Blog</h1>
          <p className="text-gray-500">Fashion tips, style guides, and the latest trends — all in one place. =============================================</p>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-10 justify-center">
          {categories.map(cat => (
            <button key={cat}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${cat === 'All' ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
              style={cat === 'All' ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Posts */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {featured.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="blog-card group overflow-hidden rounded-2xl block">
              <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                <img src={post.image} alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}>{post.category}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={11} />{post.date}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />{post.readTime}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 text-lg mb-3 leading-tight group-hover:text-gray-600 transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">By {post.author}</span>
                  <span className="text-xs font-semibold flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--color-primary)' }}>
                    Read More <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Regular Posts Grid */}
        <h2 className="text-lg font-bold text-gray-900 mb-6">More Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {regular.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="blog-card group block overflow-hidden rounded-xl">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={post.image} alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(196,61,107,0.1)', color: 'var(--color-primary)' }}>
                    {post.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{post.date}</span>
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--color-primary)' }}>Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 rounded-2xl p-10 text-center text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-dark), #2d2d5e)' }}>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Never Miss a Style Update</h3>
          <p className="text-gray-300 text-sm mb-6">Subscribe to get the latest fashion tips delivered to your inbox.</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/50 transition-colors" />
            <button type="submit" className="btn-primary flex-shrink-0">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  )
}
