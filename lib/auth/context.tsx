/**
 * Mock auth context — simulates Supabase Auth for demo
 */
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { UserRole } from '@/types'

interface AuthUser {
  id: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
}

const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  'admin@vasantham.com':   { id: 'usr-admin',   email: 'admin@vasantham.com',   role: 'admin',   name: 'Admin User',   password: 'admin123' },
  'priya@vasantham.com':   { id: 'usr-cashier', email: 'priya@vasantham.com',   role: 'cashier', name: 'Priya Menon',  password: 'cashier123' },
  'anoop@vasantham.com':   { id: 'usr-staff',   email: 'anoop@vasantham.com',   role: 'staff',   name: 'Anoop Kumar',  password: 'staff123' },
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => ({}), logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('vas_auth_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase()
    
    // 1. Check hardcoded demo users
    const found = DEMO_USERS[normalizedEmail]
    if (found && found.password === password) {
      const { password: _, ...authUser } = found
      setUser(authUser)
      localStorage.setItem('vas_auth_user', JSON.stringify(authUser))
      return {}
    }

    // 2. Check dynamic employees from localStorage
    try {
      const raw = localStorage.getItem('vas_employees')
      const employees = raw ? JSON.parse(raw) : []
      const emp = employees.find((e: any) => e.email.toLowerCase() === normalizedEmail && !e.deleted_at)
      
      if (emp && emp.password === password) {
        const authUser: AuthUser = {
          id: emp.user_id,
          email: emp.email,
          role: emp.role,
          name: emp.name
        }
        setUser(authUser)
        localStorage.setItem('vas_auth_user', JSON.stringify(authUser))
        return {}
      }
    } catch (e) {
      console.error('Auth lookup failed', e)
    }

    return { error: 'Invalid email or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vas_auth_user')
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
