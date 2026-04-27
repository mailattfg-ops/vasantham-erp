/**
 * Sidebar navigation component
 */
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import {
  LayoutDashboard, ShoppingCart, Package, ShoppingBag,
  Truck, BookOpen, Users, BarChart2, Settings,
  LogOut, Store, Tag, ChevronRight
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles: ('admin' | 'cashier' | 'staff')[]
  badge?: string
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/pos', label: 'POS Terminal', icon: Store, roles: ['admin', 'cashier'] },
  { href: '/inventory', label: 'Inventory', icon: Package, roles: ['admin', 'staff'] },
  { href: '/sales', label: 'Sales', icon: ShoppingBag, roles: ['admin'] },
  { href: '/purchase', label: 'Purchase', icon: Truck, roles: ['admin'] },
  { href: '/vendors', label: 'Vendors', icon: Users, roles: ['admin'] },
  { href: '/accounting', label: 'Accounting', icon: BookOpen, roles: ['admin'] },
  { href: '/reports', label: 'Reports', icon: BarChart2, roles: ['admin'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const visible = NAV.filter(n => user && n.roles.includes(user.role))

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex flex-col bg-gray-900 text-white" style={{ width: '240px' }}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700/50">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">Vasantham</p>
          <p className="text-gray-400 text-xs">Textiles ERP</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {visible.map(item => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-700/50 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary-light flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg text-sm transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
