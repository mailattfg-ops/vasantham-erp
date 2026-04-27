import React from 'react'
import { Trash2, Plus, Minus, Tag, AlertCircle } from 'lucide-react'
import { formatINR } from '@/lib/utils/currency'
import type { CartItem } from '@/types'

interface Props {
  items: CartItem[]
  updateQty: (id: string, qty: number) => void
  removeItem: (id: string) => void
}

export function POSCart({ items, updateQty, removeItem }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-secondary bg-white rounded-xl border border-border">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <p className="font-medium text-lg text-gray-500">Cart is empty</p>
        <p className="text-sm mt-1">Scan an item or search to begin</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 border-b border-border z-10">
            <tr>
              <th className="py-3 px-4 font-semibold text-xs text-text-secondary uppercase tracking-wider w-[40%]">Item</th>
              <th className="py-3 px-4 font-semibold text-xs text-text-secondary uppercase tracking-wider text-center w-[25%]">Quantity</th>
              <th className="py-3 px-4 font-semibold text-xs text-text-secondary uppercase tracking-wider text-right w-[20%]">Price</th>
              <th className="py-3 px-4 w-[15%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-medium text-text-primary leading-tight">{item.item_name}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.sku}</p>
                  {item.gst_rate > 0 && (
                    <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                      GST {item.gst_rate}%
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg p-1 border border-border max-w-[120px] mx-auto">
                    <button 
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="p-1 text-text-secondary hover:text-danger hover:bg-red-50 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 0)}
                      className="w-10 text-center font-bold bg-transparent border-none focus:ring-0 p-0 text-sm"
                    />
                    <button 
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="p-1 text-text-secondary hover:text-success hover:bg-green-50 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <p className="font-bold text-text-primary amount">{formatINR(item.total_amount)}</p>
                  <p className="text-xs text-text-secondary amount mt-1">{formatINR(item.unit_price)} / {item.unit}</p>
                </td>
                <td className="py-4 px-4 text-right">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
