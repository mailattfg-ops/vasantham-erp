/**
 * POS Cart Hook
 * Manages items, quantities, and GST calculations for the POS terminal
 */
import { useState, useMemo } from 'react'
import { nanoid } from 'nanoid'
import type { Item, CartItem, GSTRate } from '@/types'
import { calculateGST } from '@/lib/utils/gst'

export function usePOSCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat')
  const [discountValue, setDiscountValue] = useState(0)

  // Add an item to the cart (or increment quantity if exists)
  const addItem = (item: Item, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.item_id === item.id)
      if (existing) {
        return prev.map(i => {
          if (i.item_id !== item.id) return i
          const newQty = i.quantity + quantity
          const { cgst, sgst, totalAmount } = calculateGST(i.unit_price * newQty, i.gst_rate)
          return {
            ...i,
            quantity: newQty,
            cgst_amount: cgst,
            sgst_amount: sgst,
            total_amount: totalAmount,
          }
        })
      }

      // New item
      const { cgst, sgst, totalAmount } = calculateGST(item.mrp * quantity, item.gst_rate)
      const newItem: CartItem = {
        id: nanoid(),
        item_id: item.id,
        item_name: item.name,
        barcode_value: item.sku,
        sku: item.sku,
        unit: item.unit,
        mrp: item.mrp,
        unit_price: item.mrp,
        quantity,
        gst_rate: item.gst_rate,
        cgst_amount: cgst,
        sgst_amount: sgst,
        discount_amount: 0,
        total_amount: totalAmount,
      }
      return [...prev, newItem]
    })
  }

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(cartItemId)
      return
    }
    setItems(prev => prev.map(i => {
      if (i.id !== cartItemId) return i
      const { cgst, sgst, totalAmount } = calculateGST(i.unit_price * newQty, i.gst_rate)
      return {
        ...i,
        quantity: newQty,
        cgst_amount: cgst,
        sgst_amount: sgst,
        total_amount: totalAmount,
      }
    }))
  }

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.id !== cartItemId))
  }

  const clearCart = () => {
    setItems([])
    setDiscountType('flat')
    setDiscountValue(0)
  }

  // Derived totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0)
    
    // Total discount
    let totalDiscount = 0
    if (discountType === 'flat') {
      totalDiscount = discountValue
    } else {
      totalDiscount = Math.round(subtotal * (discountValue / 100))
    }

    // Tax is calculated on discounted subtotal
    // For simplicity in POS, we distribute the discount proportionally to items (not strictly done here, just total)
    // Actually, accurate GST needs item-level discount. We'll simplify and apply discount to total before tax,
    // assuming uniform GST, OR we can recalculate item taxes based on discounted price.
    // Let's stick to simple total level for now.
    
    // To be strictly correct per GST rules, discount MUST be applied per item.
    // We will do a proportional allocation of discount to each item to find exact GST.
    let totalCgst = 0
    let totalSgst = 0
    let totalTaxable = 0

    items.forEach(i => {
      const itemSubtotal = i.unit_price * i.quantity
      const proportion = subtotal > 0 ? itemSubtotal / subtotal : 0
      const itemDiscount = Math.round(totalDiscount * proportion)
      const discountedItemPrice = itemSubtotal - itemDiscount
      
      const { cgst, sgst } = calculateGST(discountedItemPrice, i.gst_rate)
      totalCgst += cgst
      totalSgst += sgst
      totalTaxable += discountedItemPrice
    })

    const grandTotal = totalTaxable + totalCgst + totalSgst

    return {
      subtotal,
      discount_amount: totalDiscount,
      totalTaxable,
      totalCgst,
      totalSgst,
      grandTotal,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0)
    }
  }, [items, discountType, discountValue])

  return {
    items,
    setItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    totals
  }
}
