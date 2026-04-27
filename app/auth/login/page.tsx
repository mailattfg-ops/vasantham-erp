/**
 * Login page — demo auth with 3 preset credentials shown
 */
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, ShoppingBag, Lock, Mail, ChevronRight } from 'lucide-react'
import { SEED_CATEGORIES, SEED_ITEMS, SEED_BARCODES, SEED_VENDORS, SEED_EMPLOYEES, SEED_ACCOUNTS } from '@/lib/db/seed'
import { isSeeded, markSeeded, saveAll } from '@/lib/db/store'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password required'),
})
type LoginForm = z.infer<typeof schema>

const DEMO_CREDS = [
  { role: 'Admin', email: 'admin@vasantham.com', password: 'admin123', color: 'bg-primary/10 border-primary/30 text-primary' },
  { role: 'Cashier', email: 'priya@vasantham.com', password: 'cashier123', color: 'bg-secondary/10 border-secondary/30 text-yellow-700' },
  { role: 'Staff', email: 'anoop@vasantham.com', password: 'staff123', color: 'bg-success/10 border-success/30 text-emerald-700' },
]

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  })

  // Seed demo data on first load
  useEffect(() => {
    if (!isSeeded()) {
      saveAll('categories', SEED_CATEGORIES)
      saveAll('items', SEED_ITEMS)
      saveAll('barcodes', SEED_BARCODES)
      saveAll('vendors', SEED_VENDORS)
      saveAll('employees', SEED_EMPLOYEES)
      saveAll('chart_of_accounts', SEED_ACCOUNTS)
      saveAll('sales', [])
      saveAll('purchases', [])
      saveAll('held_bills', [])
      saveAll('pos_sessions', [])
      saveAll('journal_entries', [])
      saveAll('quotations', [])
      markSeeded()
    }
  }, [])

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.replace('/dashboard')
      else if (user.role === 'cashier') router.replace('/pos')
      else router.replace('/inventory')
    }
  }, [user, router])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    const { error } = await login(data.email, data.password)
    setLoading(false)
    if (error) { toast.error(error); return }
    toast.success('Welcome back!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary" style={{ color: '#1e3a8a' }}>Vasantham ERP</h1>
          <p className="text-primary-100 mt-1 text-sm">Quality Fabrics Since 1995 · Kozhikode</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@vasantham.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              style={{ backgroundColor: '#1a56db', color: '#ffffff' }}
              className="w-full font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 hover:opacity-90 text-base">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-3">Demo Credentials</p>
            <div className="space-y-2">
              {DEMO_CREDS.map(c => (
                <button key={c.role} onClick={() => { setValue('email', c.email); setValue('password', c.password) }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs ${c.color} hover:opacity-80 transition-opacity`}>
                  <span className="font-semibold">{c.role}:</span> {c.email} / {c.password}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
