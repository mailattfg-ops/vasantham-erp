/**
 * Sidebar navigation component — Premium Dark & Gold Theme
 * Mobile: accepts onClose prop to close the drawer
 */
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import {
  LayoutDashboard, Package, ShoppingBag,
  Truck, BookOpen, Users, BarChart2, Settings,
  LogOut, Store, Hexagon, RotateCcw, X
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles: ('admin' | 'cashier' | 'staff')[]
}

const GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    ]
  },
  {
    label: 'Operations',
    items: [
      { href: '/pos', label: 'POS / Cash Counter', icon: Store, roles: ['admin', 'cashier'] },
      { href: '/inventory', label: 'Inventory', icon: Package, roles: ['admin', 'staff'] },
      { href: '/sales', label: 'Sales', icon: ShoppingBag, roles: ['admin'] },
      { href: '/sales/returns', label: 'Sales Returns', icon: RotateCcw, roles: ['admin'] },
      { href: '/purchase', label: 'Purchases', icon: Truck, roles: ['admin'] },
      { href: '/purchase/returns', label: 'Purchase Returns', icon: RotateCcw, roles: ['admin'] },
    ]
  },
  {
    label: 'Finance',
    items: [
      { href: '/accounting', label: 'Accounting', icon: BookOpen, roles: ['admin'] },
      { href: '/reports', label: 'Reports', icon: BarChart2, roles: ['admin'] },
    ]
  },
  {
    label: 'Admin',
    items: [
      { href: '/employees', label: 'Employees', icon: Users, roles: ['admin'] },
      { href: '/vendors', label: 'Vendors', icon: Users, roles: ['admin'] },
      { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
    ]
  }
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <aside className="flex flex-col bg-[#0f1115] text-white shadow-2xl border-r border-white/5 h-full" style={{ width: '250px' }}>
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-10 h-10 bg-[#eab308] rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <Hexagon className="w-6 h-6 text-black fill-black/10" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg tracking-tight leading-none text-[#eab308]" style={{ fontFamily: 'serif' }}>Vasantham</p>
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">Textiles ERP</p>
        </div>
        {/* Close button — only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-hide py-2">
        {GROUPS.map((group, idx) => {
          const visibleItems = group.items.filter(i => user && i.roles.includes(user.role))
          if (visibleItems.length === 0) return null

          return (
            <div key={idx} className="space-y-1">
              <h3 className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-2">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        active
                          ? 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 shadow-lg shadow-[#eab308]/5'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-[#eab308]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                      <span className="flex-1 text-sm">{item.label}</span>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#eab308] shadow-[0_0_8px_#eab308]" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-9 h-9 bg-[#eab308] rounded-xl flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate group-hover:text-[#eab308] transition-colors">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.role || 'Administrator'}</p>
          </div>
          <button onClick={logout} title="Logout" className="p-2 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
