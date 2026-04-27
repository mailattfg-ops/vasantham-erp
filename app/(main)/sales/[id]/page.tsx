/**
 * Sale Details & A4 Invoice Print Page
 */
'use client'
import { useMemo, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useReactToPrint } from 'react-to-print'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import { PageHeader, Button, Card, StatusBadge } from '@/components/ui'
import { getById } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import { formatDateTime, formatDate } from '@/lib/utils/date'
import { COMPANY } from '@/lib/db/seed'
import type { Sale } from '@/types'

export default function SaleDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const sale = useMemo(() => getById<Sale>('sales', id), [id])
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice_${sale?.invoice_number || 'Sale'}`,
  })

  if (!sale) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-text-primary">Sale record not found</h2>
        <Link href="/sales" className="text-primary hover:underline mt-2 inline-block">Back to Sales</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader 
        title={`Invoice ${sale.invoice_number}`} 
        subtitle={`Generated on ${formatDateTime(sale.created_at)}`}
        actions={
          <>
            <Link href="/sales">
              <Button variant="ghost" className="mr-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            </Link>
            <Button onClick={() => handlePrint()}><Printer className="w-4 h-4 mr-2" /> Print A4 Invoice</Button>
          </>
        }
      />

      {/* On-screen Summary */}
      <div className="grid grid-cols-3 gap-6 mb-8 no-print">
        <Card className="p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Customer Details</p>
          <p className="font-semibold text-text-primary text-lg">{sale.customer_name || 'Walk-in Customer'}</p>
          <p className="text-sm text-text-secondary mt-1">{sale.customer_phone || 'No phone provided'}</p>
        </Card>
        
        <Card className="p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Payment Status</p>
          <div className="mt-1 mb-2"><StatusBadge status={sale.status} /></div>
          <p className="text-sm text-text-secondary">
            Paid: <strong className="text-text-primary">{formatINR(sale.paid_amount)}</strong>
          </p>
        </Card>
        
        <Card className="p-5 bg-primary/5 border-primary/20">
          <p className="text-xs text-primary uppercase tracking-wider mb-1 font-semibold">Grand Total</p>
          <p className="font-bold text-3xl text-primary amount">{formatINR(sale.total_amount)}</p>
        </Card>
      </div>

      {/* A4 Printable Invoice Wrapper */}
      <div className="bg-white border border-border shadow-sm p-10 print-only-wrapper" ref={printRef}>
        <style type="text/css" media="print">
          {`
            @page { size: A4; margin: 15mm; }
            body { font-family: sans-serif; -webkit-print-color-adjust: exact; color: #000; }
            .print-only-wrapper { border: none; box-shadow: none; padding: 0; }
          `}
        </style>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black uppercase tracking-wider">Tax Invoice</h1>
            <p className="text-sm font-medium mt-1">Original for Recipient</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-black">{COMPANY.name}</h2>
            <p className="text-sm text-gray-700 mt-1">{COMPANY.address}</p>
            <p className="text-sm text-gray-700">{COMPANY.city}, {COMPANY.state} - {COMPANY.pincode}</p>
            <p className="text-sm text-gray-700 mt-1">GSTIN: <span className="font-semibold">{COMPANY.gstin}</span></p>
            <p className="text-sm text-gray-700">Ph: {COMPANY.phone}</p>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Billed To</p>
            <p className="font-bold text-base text-black">{sale.customer_name || 'Cash Customer'}</p>
            {sale.customer_phone && <p className="text-sm text-gray-700">Ph: {sale.customer_phone}</p>}
            {sale.customer_gstin && <p className="text-sm text-gray-700 mt-1">GSTIN: {sale.customer_gstin}</p>}
          </div>
          <div className="w-1/2 flex flex-col items-end">
            <table className="text-sm">
              <tbody>
                <tr><td className="text-gray-500 pr-4 pb-1 text-right">Invoice No:</td><td className="font-bold text-black">{sale.invoice_number}</td></tr>
                <tr><td className="text-gray-500 pr-4 pb-1 text-right">Date:</td><td className="font-bold text-black">{formatDate(sale.created_at)}</td></tr>
                <tr><td className="text-gray-500 pr-4 pb-1 text-right">Mode:</td><td className="text-black capitalize">{sale.billing_mode.replace('_', ' ')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-sm text-left mb-6 border border-gray-300">
          <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
            <tr>
              <th className="py-2 px-3 border-r border-gray-300 w-10 text-center">#</th>
              <th className="py-2 px-3 border-r border-gray-300">Item Description</th>
              <th className="py-2 px-3 border-r border-gray-300 w-24 text-center">HSN/SAC</th>
              <th className="py-2 px-3 border-r border-gray-300 w-16 text-center">Qty</th>
              <th className="py-2 px-3 border-r border-gray-300 w-24 text-right">Rate</th>
              <th className="py-2 px-3 border-r border-gray-300 w-16 text-center">GST %</th>
              <th className="py-2 px-3 w-32 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items?.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2 px-3 border-r border-gray-300 text-center">{index + 1}</td>
                <td className="py-2 px-3 border-r border-gray-300">
                  <p className="font-medium text-black">{item.item_name}</p>
                  <p className="text-[10px] text-gray-500">{item.barcode_value}</p>
                </td>
                <td className="py-2 px-3 border-r border-gray-300 text-center text-xs">5208</td> {/* Mock HSN */}
                <td className="py-2 px-3 border-r border-gray-300 text-center">{item.quantity}</td>
                <td className="py-2 px-3 border-r border-gray-300 text-right amount">{formatINR(item.unit_price).replace('₹','')}</td>
                <td className="py-2 px-3 border-r border-gray-300 text-center">{item.gst_rate}%</td>
                <td className="py-2 px-3 text-right amount font-medium text-black">{formatINR(item.total_amount).replace('₹','')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & GST Summary */}
        <div className="flex justify-between items-start">
          
          {/* GST Summary Table */}
          <div className="w-1/2 pr-6">
            <p className="text-xs font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">GST Breakup Summary</p>
            <table className="w-full text-xs text-left border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-1 px-2 border-r border-gray-200">Taxable Amt</th>
                  <th className="py-1 px-2 border-r border-gray-200">CGST</th>
                  <th className="py-1 px-2">SGST</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2 border-r border-gray-200 amount">{formatINR(sale.subtotal - sale.discount_amount)}</td>
                  <td className="py-1 px-2 border-r border-gray-200 amount">{formatINR(sale.cgst_amount)}</td>
                  <td className="py-1 px-2 amount">{formatINR(sale.sgst_amount)}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-8">
              <p className="text-xs text-gray-500 mb-6">Authorised Signatory</p>
              <div className="w-32 border-b border-gray-400"></div>
              <p className="text-xs font-medium text-black mt-1">For {COMPANY.name}</p>
            </div>
          </div>

          {/* Totals */}
          <div className="w-1/2">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-right pr-4 text-gray-600">Total Taxable Value</td>
                  <td className="py-1 text-right amount w-32">{formatINR(sale.subtotal)}</td>
                </tr>
                {sale.discount_amount > 0 && (
                  <tr>
                    <td className="py-1 text-right pr-4 text-gray-600">Discount</td>
                    <td className="py-1 text-right amount text-red-600">-{formatINR(sale.discount_amount)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1 text-right pr-4 text-gray-600">Add: CGST</td>
                  <td className="py-1 text-right amount">{formatINR(sale.cgst_amount)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-right pr-4 text-gray-600 border-b border-gray-300 pb-2">Add: SGST</td>
                  <td className="py-1 text-right amount border-b border-gray-300 pb-2">{formatINR(sale.sgst_amount)}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="py-2 text-right pr-4 font-bold text-black uppercase">Grand Total</td>
                  <td className="py-2 text-right amount font-bold text-black text-lg">{formatINR(sale.total_amount)}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-4 p-3 border border-gray-200 bg-gray-50 text-xs">
              <p className="font-semibold text-black mb-1">Payment History:</p>
              {sale.payments?.map((p, i) => (
                <div key={i} className="flex justify-between text-gray-700">
                  <span className="uppercase">{formatDate(p.date)} - {p.mode}</span>
                  <span className="amount">{formatINR(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
          <p>Thank you for your business. Goods once sold will not be taken back.</p>
          <p>Subject to Kozhikode Jurisdiction.</p>
        </div>

      </div>
    </div>
  )
}
