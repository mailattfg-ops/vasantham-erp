/**
 * Premium Top Header — Dark Theme matching Sidebar
 */
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { Bell, Search, Settings, ChevronRight, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
  '/employees': 'Employees',
  '/employees/new': 'Add Employee',
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
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  const title = BREADCRUMBS[pathname] ?? 'Vasantham ERP'
  const segments = pathname.split('/').filter(Boolean)

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Low Stock Alert', msg: 'Pure Cotton Shirting is below 20m', time: '5m ago', type: 'warn' },
    { id: 2, title: 'New Sale', msg: 'Sale #1024 completed by Priya', time: '12m ago', type: 'info' },
    { id: 3, title: 'Vendor Payment', msg: 'Balance due for Surat Silk House', time: '1h ago', type: 'error' },
  ]

  return (
    <header className="flex items-center justify-between px-8 bg-[#0f1115] border-b border-white/5 flex-shrink-0 z-40 relative shadow-2xl" style={{ height: '70px' }}>
      {/* Breadcrumb & Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.1em] text-gray-500 mb-0.5">
          <span className="hover:text-primary transition-colors cursor-pointer">ERP</span>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="w-2.5 h-2.5 text-white/10" />
              <span className="text-gray-400">{seg.replace(/-/g, ' ')}</span>
            </span>
          ))}
        </div>
        <h1 className="text-lg font-serif font-medium text-white tracking-wide">
          {title} <span className="text-primary ml-1 text-xs font-sans font-bold">●</span>
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Global Search */}
        <div className="hidden md:block relative">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-primary/50 transition-all group">
            <Search className="w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Search items, sales..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchResults(e.target.value.length > 0)
              }}
              onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
              className="bg-transparent border-none text-xs text-white placeholder:text-gray-600 focus:ring-0 ml-2 w-32 lg:w-48"
            />
          </div>

          {showSearchResults && (
            <>
              <div className="fixed inset-0" onClick={() => setShowSearchResults(false)} />
              <div className="absolute top-full mt-3 right-0 w-80 bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-[10px] uppercase font-bold text-gray-500 border-b border-white/5 mb-1">Search Results</div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="p-2 hover:bg-white/5 rounded-xl cursor-pointer flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs text-white font-medium">"{searchQuery}" in Inventory</p>
                      <p className="text-[10px] text-gray-500">Quick search result...</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-white/5 mx-1" />

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all relative ${showNotifications ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-[#0f1115]" />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0" onClick={() => setShowNotifications(false)} />
                <div className="absolute top-full mt-3 right-0 w-72 bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase">3 New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'warn' ? 'bg-amber-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{n.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{n.msg}</p>
                            <p className="text-[9px] text-gray-600 mt-2 font-medium">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-[10px] font-bold text-gray-500 hover:text-white transition-colors bg-white/5 uppercase tracking-widest">
                    View All Reminders
                  </button>
                </div>
              </>
            )}
          </div>
          
          <Link href="/settings">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="h-6 w-px bg-white/5 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-white leading-none">{user?.name}</p>
              <p className="text-[9px] font-bold text-primary uppercase tracking-tighter mt-1">{user?.role}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-tr from-primary to-amber-300 rounded-xl flex items-center justify-center text-sm font-bold text-[#0f1115] shadow-lg shadow-primary/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-3 w-56 bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-white/5">
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <User className="w-3.5 h-3.5" /> Profile Settings
                  </button>
                  <button 
                    onClick={() => { logout(); router.push('/auth/login') }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
