/**
 * Vendor List Page
 */
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Eye, Building2 } from 'lucide-react'
import { PageHeader, Button, Card, StatusBadge } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import type { Vendor } from '@/types'

export default function VendorsPage() {
  const [search, setSearch] = useState('')
  const vendors = useMemo(() => getAll<Vendor>('vendors'), [])

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => 
      !v.deleted_at && 
      (v.name.toLowerCase().includes(search.toLowerCase()) || 
       (v.contact_person && v.contact_person.toLowerCase().includes(search.toLowerCase())))
    )
  }, [vendors, search])

  return (
    <div>
      <PageHeader 
        title="Vendors & Suppliers" 
        subtitle="Manage supplier directory and outstanding balances"
        actions={
          <Link href="/vendors/new">
            <Button>
              <Plus className="w-4 h-4" /> Add Vendor
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Total Vendors</p>
            <p className="text-xl font-bold text-text-primary">{vendors.filter(v => !v.deleted_at).length}</p>
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
              placeholder="Search by vendor name or contact person..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-4 py-3 font-medium">Vendor Details</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">City / State</th>
                <th className="px-4 py-3 font-medium text-right">Outstanding Balance</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary text-sm">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{vendor.name}</div>
                      {vendor.gst_number && <div className="text-xs text-text-secondary mt-0.5">GST: {vendor.gst_number}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-text-primary">{vendor.contact_person || '—'}</div>
                      <div className="text-xs text-text-secondary mt-0.5">{vendor.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {vendor.city}, {vendor.state}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className={`font-medium amount ${vendor.current_balance > 0 ? 'text-danger' : 'text-text-primary'}`}>
                        {formatINR(vendor.current_balance)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={vendor.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/vendors/${vendor.id}`} className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
