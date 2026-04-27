import React from 'react'
import { Clock, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { Modal, Button } from '@/components/ui'
import { formatINR } from '@/lib/utils/currency'
import { formatDateTime } from '@/lib/utils/date'
import type { HeldBill } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  bills: HeldBill[]
  onRecall: (id: string) => void
  onRemove: (id: string) => void
}

export function HeldBillsModal({ open, onClose, bills, onRecall, onRemove }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Held Bills (F3)">
      {bills.length === 0 ? (
        <div className="py-12 text-center text-text-secondary">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium text-text-primary">No held bills</p>
          <p className="text-sm">You can hold a bill by pressing F2</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center justify-between">
            <span>You have {bills.length} bill(s) on hold.</span>
            <span className="font-semibold text-xs bg-blue-100 px-2 py-1 rounded">Max: 5</span>
          </div>

          <div className="grid gap-3">
            {bills.map((bill) => {
              const totalItems = bill.cart_items.reduce((acc, item) => acc + item.quantity, 0)
              const totalAmount = bill.cart_items.reduce((acc, item) => acc + item.total_amount, 0)
              
              return (
                <div key={bill.id} className="group relative flex items-center justify-between p-4 bg-white border border-border rounded-xl shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer" onClick={() => { onRecall(bill.id); onClose() }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <ShoppingBag className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{bill.label}</p>
                      <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                        <span className="capitalize">{bill.billing_mode}</span>
                        <span>•</span>
                        <span>{formatDateTime(bill.held_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-text-primary amount">{formatINR(totalAmount)}</p>
                      <p className="text-xs text-text-secondary">{totalItems} items</p>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemove(bill.id) }}
                      className="p-3 text-text-secondary hover:bg-red-50 hover:text-danger rounded-lg transition-colors border border-transparent hover:border-red-100 z-10 relative"
                      title="Discard Held Bill"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Modal>
  )
}
