'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const TARGET_DATE = new Date('2025-12-31T00:00:00')

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

export default function ComingSoonPage() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
  }

  const timeUnits = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, var(--color-dark) 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <p className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          <span style={{ color: 'var(--color-accent)' }}>Henoria</span>
        </p>

        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          We are<br />
          <span style={{ color: 'var(--color-accent)' }}>Coming Soon</span>
        </h1>

        <p className="text-gray-300 text-lg mb-10 leading-relaxed">
          Our team is working on something amazing. <br />
          Be the first to know when we launch!
        </p>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-4 mb-12">
          {timeUnits.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black text-white relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {String(value).padStart(2, '0')}
              </div>
              <p className="text-gray-400 text-xs mt-2 uppercase tracking-wider font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Subscribe Form */}
        {subscribed ? (
          <div className="bg-green-500/20 border border-green-400/30 rounded-2xl px-8 py-6 mb-8">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-green-300 font-semibold">You're on the list!</p>
            <p className="text-green-400/80 text-sm mt-1">We'll notify you at <strong>{email}</strong> when we launch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto mb-8">
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-white/50 transition-colors"
            />
            <button type="submit" className="btn-primary flex-shrink-0 px-6">
              Notify Me
            </button>
          </form>
        )}

        <p className="text-gray-500 text-xs mb-10">No spam, ever. Unsubscribe anytime.</p>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          {[
            { label: 'Facebook', icon: 'fab fa-facebook-f', href: '#' },
            { label: 'Instagram', icon: 'fab fa-instagram', href: '#' },
            { label: 'Twitter', icon: 'fab fa-twitter', href: '#' },
          ].map(({ label, icon, href }) => (
            <a key={label} href={href}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              aria-label={label}>
              <i className={icon} />
            </a>
          ))}
        </div>

        {/* Back to store */}
        <div className="mt-10">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}
