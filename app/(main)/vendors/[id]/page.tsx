/**
 * Vendor Details & Ledger
 */
'use client'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Building2, MapPin, Mail, Phone, IndianRupee } from 'lucide-react'
import { PageHeader, Button, Card, StatusBadge } from '@/components/ui'
import { getById, getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import type { Vendor, Purchase } from '@/types'

export default function VendorDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const vendor = useMemo(() => getById<Vendor>('vendors', id), [id])
  const purchases = useMemo(() => getAll<Purchase>('purchases').filter(p => p.vendor_id === id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [id])

  if (!vendor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-text-primary">Vendor not found</h2>
        <Link href="/vendors" className="text-primary hover:underline mt-2 inline-block">Back to Vendors</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader 
        title={vendor.name} 
        subtitle={`Vendor since ${formatDate(vendor.created_at)}`}
        actions={
          <>
            <Link href="/vendors">
              <Button variant="ghost" className="mr-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            </Link>
            <Button variant="secondary"><Edit className="w-4 h-4 mr-1" /> Edit</Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="p-6 col-span-2">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-text-primary flex items-center gap-2"><Building2 className="w-4 h-4 text-text-secondary"/> Company Details</h3>
            <StatusBadge status={vendor.is_active ? 'active' : 'inactive'} />
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-xs text-text-secondary flex items-center gap-1"><Phone className="w-3 h-3"/> Contact & Phone</p>
              <p className="text-sm font-medium text-text-primary mt-1">{vendor.contact_person || '—'}</p>
              <p className="text-sm text-text-primary">{vendor.phone}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary flex items-center gap-1"><Mail className="w-3 h-3"/> Email & GST</p>
              <p className="text-sm text-text-primary mt-1">{vendor.email || '—'}</p>
              <p className="text-sm text-text-primary font-mono">{vendor.gst_number || '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-text-secondary flex items-center gap-1"><MapPin className="w-3 h-3"/> Address</p>
              <p className="text-sm text-text-primary mt-1">{vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-red-50/50 border-red-100 flex flex-col justify-center text-center">
          <p className="text-xs text-danger font-semibold uppercase tracking-wider mb-2">Total Outstanding Payable</p>
          <p className="text-4xl font-bold text-danger amount">{formatINR(vendor.current_balance)}</p>
          <div className="mt-4">
            <Button variant="danger" className="w-full">Record Payment</Button>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="p-4 border-b border-border bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Recent Purchase History (Ledger)</h3>
          <span className="text-xs text-text-secondary">{purchases.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-4 py-3 font-medium">Date & Ref</th>
                <th className="px-4 py-3 font-medium text-right">Bill Amount</th>
                <th className="px-4 py-3 font-medium text-right">Paid</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">No purchase history found.</td>
                </tr>
              ) : (
                purchases.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{p.reference_number}</div>
                      <div className="text-xs text-text-secondary">{formatDate(p.date)}</div>
                    </td>
                    <td className="px-4 py-3 text-right amount font-medium">{formatINR(p.total_amount)}</td>
                    <td className="px-4 py-3 text-right amount text-success">{formatINR(p.paid_amount)}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
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
