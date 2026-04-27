/**
 * Purchase List Page
 */
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Eye } from 'lucide-react'
import { PageHeader, Button, Card, StatusBadge } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import type { Purchase, Vendor } from '@/types'

export default function PurchasePage() {
  const [search, setSearch] = useState('')
  
  const purchases = useMemo(() => getAll<Purchase>('purchases').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [])
  const vendors = useMemo(() => getAll<Vendor>('vendors'), [])

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const vendor = vendors.find(v => v.id === p.vendor_id)
      const matchSearch = p.reference_number.toLowerCase().includes(search.toLowerCase()) || 
                          (vendor && vendor.name.toLowerCase().includes(search.toLowerCase()))
      return matchSearch
    })
  }, [purchases, search, vendors])

  return (
    <div>
      <PageHeader 
        title="Purchase Orders & Entries" 
        subtitle="Manage your purchases and stock intake"
        actions={
          <Link href="/purchase/new">
            <Button>
              <Plus className="w-4 h-4" /> New Purchase
            </Button>
          </Link>
        }
      />

      <Card className="mb-6">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by reference number or vendor..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-4 py-3 font-medium">Date & Ref</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium text-right">Total Amount</th>
                <th className="px-4 py-3 font-medium text-right">Paid / Balance</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary text-sm">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(purchase => {
                  const vendor = vendors.find(v => v.id === purchase.vendor_id)
                  const balance = purchase.total_amount - purchase.paid_amount
                  
                  return (
                    <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{purchase.reference_number}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{formatDate(purchase.date)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-text-primary">{vendor?.name || 'Unknown Vendor'}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-text-primary amount">{formatINR(purchase.total_amount)}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5 uppercase tracking-wide">
                          GST: {formatINR(purchase.cgst_amount + purchase.sgst_amount)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-success amount">{formatINR(purchase.paid_amount)}</div>
                        <div className={`text-xs font-semibold amount mt-0.5 ${balance > 0 ? 'text-danger' : 'text-text-secondary'}`}>
                          Bal: {formatINR(balance)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={purchase.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end">
                          <Link href={`/purchase/${purchase.id}`} className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
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
