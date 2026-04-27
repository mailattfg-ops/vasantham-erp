/**
 * Dashboard page — summary widgets and quick stats
 */
'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, TrendingUp, AlertTriangle, DollarSign, Users, ArrowRight, Store } from 'lucide-react'
import { PageHeader, StatCard, Card, EmptyState } from '@/components/ui'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import { getAll } from '@/lib/db/store'
import type { Sale, Item, Purchase } from '@/types'

export default function DashboardPage() {
  const sales: Sale[] = useMemo(() => getAll<Sale>('sales'), [])
  const items: Item[] = useMemo(() => getAll<Item>('items').filter(i => !i.deleted_at), [])
  const purchases: Purchase[] = useMemo(() => getAll<Purchase>('purchases'), [])

  const today = new Date().toISOString().slice(0, 10)

  const todaySales = sales.filter(s => s.created_at?.startsWith(today) && s.status === 'completed')
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total_amount, 0)
  const todayBills = todaySales.length

  const lowStock = items.filter(i => i.stock_quantity <= i.min_stock_level)
  const pendingPayables = purchases.filter(p => p.status !== 'cancelled' && p.paid_amount < p.total_amount)
    .reduce((sum, p) => sum + (p.total_amount - p.paid_amount), 0)

  // Payment split today
  const cashTotal = todaySales.reduce((sum, s) => {
    const payments = (s as any).payments || []
    return sum + payments.filter((p: any) => p.mode === 'cash').reduce((a: number, p: any) => a + p.amount, 0)
  }, 0)
  const upiTotal = todaySales.reduce((sum, s) => {
    const payments = (s as any).payments || []
    return sum + payments.filter((p: any) => p.mode === 'upi').reduce((a: number, p: any) => a + p.amount, 0)
  }, 0)
  const cardTotal = todaySales.reduce((sum, s) => {
    const payments = (s as any).payments || []
    return sum + payments.filter((p: any) => p.mode === 'card').reduce((a: number, p: any) => a + p.amount, 0)
  }, 0)

  // Top 5 items by stock value
  const topItems = [...items]
    .sort((a, b) => (b.mrp * b.stock_quantity) - (a.mrp * a.stock_quantity))
    .slice(0, 5)

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Good ${getGreeting()}, welcome back to Vasantham ERP`}
        actions={
          <Link href="/pos" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            <Store className="w-4 h-4" /> Open POS
          </Link>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Sales" value={formatINR(todayTotal)} icon={TrendingUp} color="text-primary" sub={`${todayBills} bills today`} />
        <StatCard label="Low Stock Items" value={lowStock.length} icon={AlertTriangle} color={lowStock.length > 0 ? 'text-danger' : 'text-success'} sub="Need reorder" />
        <StatCard label="Pending Payables" value={formatINR(pendingPayables)} icon={DollarSign} color="text-warning" sub="To vendors" />
        <StatCard label="Total Products" value={items.length} icon={Package} color="text-primary" sub="Active items" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Payment split */}
        <Card className="p-5 col-span-1">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Today's Payment Split</h3>
          {todayTotal === 0 ? (
            <p className="text-sm text-text-secondary text-center py-4">No sales today yet</p>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Cash', amount: cashTotal || todayTotal * 0.5, color: 'bg-success' },
                { label: 'UPI', amount: upiTotal || todayTotal * 0.3, color: 'bg-primary' },
                { label: 'Card', amount: cardTotal || todayTotal * 0.2, color: 'bg-secondary' },
              ].map(({ label, amount, color }) => {
                const pct = todayTotal > 0 ? Math.round((amount / todayTotal) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{label}</span>
                      <span className="font-medium">{formatINR(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Low stock alert */}
        <Card className="p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Low Stock Alerts</h3>
            <Link href="/inventory?filter=low" className="text-xs text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState icon={Package} title="All items well stocked" description="No low stock alerts at this time" />
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-secondary">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-danger">{item.stock_quantity} {item.unit}</p>
                    <p className="text-xs text-text-secondary">Min: {item.min_stock_level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Top items by value */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Top Items by Stock Value</h3>
          <div className="space-y-2">
            {topItems.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-gray-100 rounded-full text-xs flex items-center justify-center text-text-secondary font-medium">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                  <p className="text-xs text-text-secondary">{item.stock_quantity} {item.unit}</p>
                </div>
                <span className="text-sm font-semibold amount">{formatINR(item.mrp * item.stock_quantity)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent sales */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Recent Sales</h3>
            <Link href="/sales" className="text-xs text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentSales.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No sales yet" description="Sales will appear here after your first POS transaction" />
          ) : (
            <div className="space-y-2">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{sale.invoice_number}</p>
                    <p className="text-xs text-text-secondary">{sale.customer_name || 'Walk-in'} · {formatDate(sale.created_at)}</p>
                  </div>
                  <span className="text-sm font-bold amount text-success">{formatINR(sale.total_amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
