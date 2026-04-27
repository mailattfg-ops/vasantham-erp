/**
 * Hook to manage holding and recalling POS bills
 */
import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import type { HeldBill, CartItem, BillingMode } from '@/types'

export function useHeldBills(cashierId: string, sessionId: string) {
  const [heldBills, setHeldBills] = useState<HeldBill[]>([])

  // Load from local storage for demo
  useEffect(() => {
    const stored = localStorage.getItem(`vas_held_bills_${sessionId}`)
    if (stored) {
      setHeldBills(JSON.parse(stored))
    }
  }, [sessionId])

  const saveToStorage = (bills: HeldBill[]) => {
    setHeldBills(bills)
    localStorage.setItem(`vas_held_bills_${sessionId}`, JSON.stringify(bills))
  }

  const holdBill = (
    cartItems: CartItem[], 
    billingMode: BillingMode, 
    customerName?: string,
    discountType?: 'flat' | 'percent',
    discountValue?: number
  ) => {
    if (cartItems.length === 0) {
      toast.error('Cannot hold an empty bill')
      return false
    }

    if (heldBills.length >= 5) {
      toast.error('Maximum 5 bills can be held at a time')
      return false
    }

    const newBill: HeldBill = {
      id: nanoid(),
      session_id: sessionId,
      cashier_id: cashierId,
      label: `Bill ${heldBills.length + 1} - ${customerName || 'Walk-in'}`,
      billing_mode: billingMode,
      customer_name: customerName,
      cart_items: [...cartItems],
      discount_type: discountType,
      discount_value: discountValue || 0,
      held_at: new Date().toISOString()
    }

    saveToStorage([...heldBills, newBill])
    toast.success('Bill held successfully')
    return true
  }

  const recallBill = (id: string): HeldBill | null => {
    const bill = heldBills.find(b => b.id === id)
    if (!bill) return null
    
    // Remove from held bills
    saveToStorage(heldBills.filter(b => b.id !== id))
    toast.success('Bill recalled')
    return bill
  }
  
  const removeHeldBill = (id: string) => {
    saveToStorage(heldBills.filter(b => b.id !== id))
    toast.success('Held bill discarded')
  }

  return {
    heldBills,
    holdBill,
    recallBill,
    removeHeldBill
  }
}
