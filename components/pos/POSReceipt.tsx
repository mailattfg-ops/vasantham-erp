import React from 'react'
import { formatINR } from '@/lib/utils/currency'
import { formatDate, formatDateTime } from '@/lib/utils/date'
import type { Sale, CompanyInfo } from '@/types'

interface Props {
  sale: Sale
  company: CompanyInfo
}

export const POSReceipt = React.forwardRef<HTMLDivElement, Props>(({ sale, company }, ref) => {
  return (
    <div ref={ref} className="bg-white p-4 text-[12px] font-mono leading-tight max-w-[80mm] mx-auto text-black print-only">
      <style type="text/css" media="print">
        {`
          @page { size: 80mm auto; margin: 0; }
          body { font-family: monospace; color: black; }
        `}
      </style>
      
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg leading-tight mb-1">{company.name}</h2>
        <p>{company.address}</p>
        <p>{company.city}, {company.state} {company.pincode}</p>
        <p>Ph: {company.phone}</p>
        {company.gstin && <p>GSTIN: {company.gstin}</p>}
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-2 space-y-1">
        <p>Bill No: <span className="font-bold">{sale.invoice_number}</span></p>
        <p>Date : {formatDateTime(sale.created_at)}</p>
        <p>Cashier: {sale.cashier_id}</p>
        {sale.customer_name && <p>Customer: {sale.customer_name}</p>}
      </div>

      <table className="w-full mb-2">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="py-1">Item</th>
            <th className="py-1 text-center">Qty</th>
            <th className="py-1 text-right">Price</th>
            <th className="py-1 text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {sale.items?.map((item, i) => (
            <tr key={i} className="border-b border-gray-300">
              <td className="py-1 pr-1 truncate max-w-[100px]">{item.item_name}</td>
              <td className="py-1 text-center">{item.quantity}</td>
              <td className="py-1 text-right">{formatINR(item.unit_price).replace('₹','')}</td>
              <td className="py-1 text-right">{formatINR(item.total_amount).replace('₹','')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-1 py-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatINR(sale.subtotal)}</span>
        </div>
        {sale.discount_amount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-{formatINR(sale.discount_amount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>CGST:</span>
          <span>{formatINR(sale.cgst_amount)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST:</span>
          <span>{formatINR(sale.sgst_amount)}</span>
        </div>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 my-2">
        <div className="flex justify-between font-bold text-base">
          <span>GRAND TOTAL:</span>
          <span>{formatINR(sale.total_amount)}</span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        {sale.payments?.map((payment, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="uppercase">PAID BY {payment.mode}:</span>
            <span>{formatINR(payment.amount)}</span>
          </div>
        ))}
        {sale.change_amount > 0 && (
          <div className="flex justify-between text-xs font-bold mt-1">
            <span>CHANGE RETURNED:</span>
            <span>{formatINR(sale.change_amount)}</span>
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="font-bold">Thank You! Visit Again.</p>
        <p className="text-[10px] mt-1">Goods once sold will not be taken back</p>
      </div>
    </div>
  )
})
POSReceipt.displayName = 'POSReceipt'
