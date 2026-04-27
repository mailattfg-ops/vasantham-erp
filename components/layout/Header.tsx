/**
 * Top header with breadcrumb and quick actions
 */
'use client'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { Bell, Search } from 'lucide-react'

const BREADCRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/inventory/new': 'New Item',
  '/inventory/print-labels': 'Print Labels',
  '/inventory/categories': 'Categories',
  '/inventory/adjustments': 'Stock Adjustments',
  '/sales': 'Sales',
  '/sales/new': 'New Sale',
  '/sales/returns': 'Sales Returns',
  '/sales/quotations': 'Quotations',
  '/purchase': 'Purchase',
  '/purchase/new': 'New Purchase',
  '/purchase/orders': 'Purchase Orders',
  '/purchase/returns': 'Purchase Returns',
  '/vendors': 'Vendors',
  '/vendors/new': 'New Vendor',
  '/accounting': 'Accounting',
  '/accounting/journal': 'Journal Entries',
  '/accounting/cash-book': 'Cash Book',
  '/accounting/day-book': 'Day Book',
  '/accounting/ledger': 'Ledger',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/settings/users': 'User Management',
}

export default function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

  const title = BREADCRUMBS[pathname] ?? 'Vasantham ERP'
  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className="flex items-center justify-between px-6 bg-white border-b border-border flex-shrink-0" style={{ height: '60px' }}>
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-0.5">
          <span>Vasantham ERP</span>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span>/</span>
              <span className="capitalize">{seg.replace(/-/g, ' ')}</span>
            </span>
          ))}
        </div>
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-text-primary">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
