'use client'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react'

interface Props { defaultTab?: 'login' | 'register' }

export default function LoginClient({ defaultTab = 'login' }: Props) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', cpassword: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (data.success) {
        login(data.user)
        router.push(data.user.role === 'admin' ? '/admin' : '/dashboard')
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch {
      setError('Login failed. Please try the demo credentials below.')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regForm.password !== regForm.cpassword) { setError('Passwords do not match'); return }
    if (regForm.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 800))
    login({ id: `user-${Date.now()}`, name: regForm.name, email: regForm.email, role: 'user' })
    router.push('/dashboard')
    setLoading(false)
  }

  const fillDemo = (email: string, password: string) => {
    setLoginForm({ email, password })
    setTab('login')
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-center px-14 py-16 w-[480px] flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, var(--color-dark) 0%, #2d2d5e 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 translate-x-32 -translate-y-32"
          style={{ backgroundColor: 'var(--color-primary)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 -translate-x-24 translate-y-24"
          style={{ backgroundColor: 'var(--color-accent)' }} />

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-10">
            <span className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Henoria<span style={{ color: 'var(--color-accent)' }}>.</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome to<br />
            <span style={{ color: 'var(--color-accent)' }}>Fashion That Fits</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-10">
            Join thousands of fashion lovers. Get exclusive deals, track your orders, and enjoy a personalized shopping experience.
          </p>
          <div className="space-y-4 mb-10">
            {[
              { icon: '🚚', text: 'Free delivery on orders above ₹999' },
              { icon: '🔄', text: 'Easy 30-day returns & exchanges' },
              { icon: '🎁', text: 'Exclusive member-only deals & coupons' },
              { icon: '📦', text: 'Real-time order tracking' },
              { icon: '🔒', text: '100% secure payments' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          {/* Demo Accounts */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Demo Accounts</p>
            <div className="space-y-2">
              {[
                { label: '👑 Admin', email: 'admin@henoria.com', password: 'admin123', color: '#8b5cf6' },
                { label: '👤 User', email: 'priya@example.com', password: 'user123', color: 'var(--color-primary)' },
              ].map(acc => (
                <button key={acc.label}
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:bg-white/10"
                  style={{ border: `1px solid ${acc.color}30` }}>
                  <div>
                    <p className="text-xs font-bold text-white">{acc.label}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{acc.email}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ backgroundColor: `${acc.color}20`, color: acc.color }}>
                    {acc.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                Henoria
              </span>
            </Link>
          </div>

          {/* Tab Switch */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <span className="text-base">⚠️</span> {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Sign In</h2>
                <p className="text-sm text-gray-400">Welcome back! Please enter your details.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={loginForm.email}
                    onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                    className="form-input pl-10" placeholder="admin@henoria.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} required value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    className="form-input pl-10 pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} />
                  <span className="text-xs text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</span>
                  : <><span>Sign In</span><ArrowRight size={14} /></>}
              </button>

              {/* Mobile demo */}
              <div className="lg:hidden bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-semibold">Quick Demo Login:</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => fillDemo('admin@henoria.com', 'admin123')}
                    className="flex-1 text-xs py-2 rounded-lg border border-purple-200 text-purple-600 bg-purple-50 font-medium">
                    👑 Admin
                  </button>
                  <button type="button" onClick={() => fillDemo('priya@example.com', 'user123')}
                    className="flex-1 text-xs py-2 rounded-lg border font-medium"
                    style={{ borderColor: 'rgba(196,61,107,0.2)', color: 'var(--color-primary)', backgroundColor: 'rgba(196,61,107,0.05)' }}>
                    👤 User
                  </button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setTab('register')}
                  className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Create Account</h2>
                <p className="text-sm text-gray-400">Join Henoria and start shopping!</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required value={regForm.name}
                    onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                    className="form-input pl-10" placeholder="Your full name" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    className="form-input pl-10" placeholder="email@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required value={regForm.phone}
                    onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))}
                    className="form-input pl-10" placeholder="10-digit mobile number" maxLength={10} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <input type="password" required value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                    className="form-input" placeholder="Min 6 chars" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm</label>
                  <input type="password" required value={regForm.cpassword}
                    onChange={e => setRegForm(f => ({ ...f, cpassword: e.target.value }))}
                    className="form-input" placeholder="Repeat password" />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-0.5" style={{ accentColor: 'var(--color-primary)' }} />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{' '}
                  <Link href="#" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link href="#" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</span>
                  : <><span>Create Account</span><ArrowRight size={14} /></>}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')}
                  className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
