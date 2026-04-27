/**
 * Root page — redirects to dashboard or login based on auth
 */
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/auth/login'); return }
    if (user.role === 'admin') router.replace('/dashboard')
    else if (user.role === 'cashier') router.replace('/pos')
    else router.replace('/inventory')
  }, [user, loading, router])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading Vasantham ERP…</p>
      </div>
    </div>
  )
}
