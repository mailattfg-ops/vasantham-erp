/**
 * Sales List Page (All Sales including POS)
 */
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Eye, FileText, ShoppingBag } from 'lucide-react'
import { PageHeader, Card, StatusBadge } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import { formatDateTime } from '@/lib/utils/date'
import type { Sale } from '@/types'

export default function SalesPage() {
  const [search, setSearch] = useState('')
  
  const sales = useMemo(() => getAll<Sale>('sales').sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [])

  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const sLower = search.toLowerCase()
      return s.invoice_number.toLowerCase().includes(sLower) || 
             (s.customer_name && s.customer_name.toLowerCase().includes(sLower)) ||
             (s.customer_phone && s.customer_phone.includes(search))
    })
  }, [sales, search])

  return (
    <div>
      <PageHeader 
        title="Sales Invoices" 
        subtitle="View all POS transactions and manual invoices"
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Total Invoices</p>
            <p className="text-xl font-bold text-text-primary">{sales.length}</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by invoice number, customer name or phone..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-4 py-3 font-medium">Invoice No & Date</th>
                <th className="px-4 py-3 font-medium">Customer Details</th>
                <th className="px-4 py-3 font-medium">Billing Mode</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary text-sm">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => {
                  return (
                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-primary">{sale.invoice_number}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{formatDateTime(sale.created_at)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-text-primary">{sale.customer_name || 'Walk-in Customer'}</div>
                        {sale.customer_phone && <div className="text-xs text-text-secondary">{sale.customer_phone}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize bg-gray-100 text-gray-700">
                          {sale.billing_mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-text-primary amount">{formatINR(sale.total_amount)}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5 uppercase tracking-wide">
                          GST: {formatINR(sale.cgst_amount + sale.sgst_amount)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={sale.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end">
                          <Link href={`/sales/${sale.id}`} className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
