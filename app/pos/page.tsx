/**
 * Full Screen POS Terminal Page
 */
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { LogOut, LayoutDashboard, Search, Settings, Tag, User, HandCoins, PauseCircle, PlayCircle, CreditCard, RotateCcw } from 'lucide-react'

import { useAuth } from '@/lib/auth/context'
import { usePOSCart } from '@/hooks/usePOSCart'
import { useHeldBills } from '@/hooks/useHeldBills'
import { upsert, getAll, nextSeq } from '@/lib/db/store'
import { generateInvoiceNumber } from '@/lib/utils/barcode'
import { formatINR } from '@/lib/utils/currency'

import { POSSearch } from '@/components/pos/POSSearch'
import { POSCart } from '@/components/pos/POSCart'
import { POSPayment } from '@/components/pos/POSPayment'
import { HeldBillsModal } from '@/components/pos/HeldBills'
import { POSReceipt } from '@/components/pos/POSReceipt'
import { Button, Input, Select, ConfirmDialog } from '@/components/ui'
import { COMPANY } from '@/lib/db/seed'
import type { BillingMode, Sale, Item, PaymentMode, SaleItem, SalePayment } from '@/types'

export default function POSPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const [billingMode, setBillingMode] = useState<BillingMode>('retail')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  
  const [showPayment, setShowPayment] = useState(false)
  const [showHeldBills, setShowHeldBills] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [focusLoss, setFocusLoss] = useState(false) // toggle to force POSSearch focus
  
  // Current sale for receipt printing
  const [lastSale, setLastSale] = useState<Sale | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrintReceipt = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: 'Receipt',
    onAfterPrint: () => setLastSale(null), // Clear after print
  })

  // POS State Hooks
  const { 
    items, setItems, addItem, updateQuantity, removeItem, clearCart, 
    discountType, setDiscountType, discountValue, setDiscountValue, totals 
  } = usePOSCart()

  const sessionId = 'session-current' // mock session id
  const { heldBills, holdBill, recallBill, removeHeldBill } = useHeldBills(user?.id || 'unknown', sessionId)

  // -- Keyboard Shortcuts --
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input (except search, which handles its own enter)
      const activeEl = document.activeElement as HTMLElement
      const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA'

      switch (e.key) {
        case 'F1': 
          e.preventDefault()
          if (items.length > 0) setShowCancelConfirm(true)
          break
        case 'F2':
          e.preventDefault()
          handleHoldBill()
          break
        case 'F3':
          e.preventDefault()
          setShowHeldBills(true)
          break
        case 'F4':
          e.preventDefault()
          if (items.length > 0) setShowPayment(true)
          else toast.error('Cart is empty')
          break
        case 'Escape':
          if (showPayment) setShowPayment(false)
          if (showHeldBills) setShowHeldBills(false)
          if (showCancelConfirm) setShowCancelConfirm(false)
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [items, showPayment, showHeldBills, showCancelConfirm])

  // Triggers focus back to search bar when modals close
  useEffect(() => {
    if (!showPayment && !showHeldBills && !showCancelConfirm) {
      setFocusLoss(prev => !prev) 
    }
  }, [showPayment, showHeldBills, showCancelConfirm])

  const triggerFocus = () => setFocusLoss(prev => !prev)

  // -- Actions --
  const handleHoldBill = () => {
    if (holdBill(items, billingMode, customerName, discountType, discountValue)) {
      clearCart()
      setCustomerName('')
      setCustomerPhone('')
      triggerFocus()
    }
  }

  const handleRecallBill = (id: string) => {
    const bill = recallBill(id)
    if (bill) {
      setItems(bill.cart_items)
      setBillingMode(bill.billing_mode)
      setCustomerName(bill.customer_name || '')
      if (bill.discount_type) setDiscountType(bill.discount_type)
      setDiscountValue(bill.discount_value)
      triggerFocus()
    }
  }

  const handleCompleteSale = (payments: { mode: PaymentMode; amount: number }[], change: number) => {
    const seq = nextSeq('sales')
    const invNumber = generateInvoiceNumber(seq)
    const saleId = `sale-${nanoid(8)}`

    // Build Sale record
    const sale: Sale = {
      id: saleId,
      invoice_number: invNumber,
      billing_mode: billingMode,
      customer_name: customerName,
      customer_phone: customerPhone,
      date: new Date().toISOString().slice(0, 10),
      status: 'completed',
      subtotal: totals.subtotal,
      discount_type: discountType,
      discount_value: discountValue,
      discount_amount: totals.discount_amount,
      cgst_amount: totals.totalCgst,
      sgst_amount: totals.totalSgst,
      total_amount: totals.grandTotal,
      paid_amount: payments.reduce((sum, p) => sum + p.amount, 0),
      change_amount: change,
      cashier_id: user?.id || 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items.map(i => ({
        id: `si-${nanoid(8)}`,
        sale_id: saleId,
        item_id: i.item_id,
        item_name: i.item_name,
        barcode_value: i.barcode_value,
        quantity: i.quantity,
        unit_price: i.unit_price,
        gst_rate: i.gst_rate,
        cgst_amount: i.cgst_amount,
        sgst_amount: i.sgst_amount,
        discount_amount: i.discount_amount,
        total_amount: i.total_amount
      })),
      payments: payments.map(p => ({
        id: `sp-${nanoid(8)}`,
        sale_id: saleId,
        mode: p.mode,
        amount: p.amount,
        date: new Date().toISOString(),
        created_at: new Date().toISOString()
      }))
    }

    // Deduct stock
    const dbItems = getAll<Item>('items')
    items.forEach(cartItem => {
      const dbItem = dbItems.find(i => i.id === cartItem.item_id)
      if (dbItem) {
        dbItem.stock_quantity -= cartItem.quantity
        upsert('items', dbItem)
      }
    })

    // Save sale
    upsert('sales', sale)

    // Reset and Print
    setShowPayment(false)
    setLastSale(sale)
    toast.success('Payment successful! Printing receipt...')
    
    // Slight delay to allow receipt to render before print
    setTimeout(() => {
      handlePrintReceipt()
      clearCart()
      setCustomerName('')
      setCustomerPhone('')
      triggerFocus()
    }, 100)
  }

  // --- Render ---
  if (!user) return null

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden font-sans">
      
      {/* Header (No sidebar) */}
      <header className="bg-gray-900 text-white flex items-center justify-between px-6 py-3 flex-shrink-0 shadow-md z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold leading-tight">Vasantham POS</h1>
              <p className="text-[10px] text-gray-400">Terminal 1</p>
            </div>
          </div>
          
          {/* Mode switch */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {(['retail', 'wholesale', 'cash_counter'] as BillingMode[]).map(mode => (
              <button 
                key={mode} 
                onClick={() => setBillingMode(mode)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  billingMode === mode ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts Hints */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-400">
          <button onClick={() => { if (items.length > 0) setShowCancelConfirm(true) }} className="flex items-center gap-1 hover:text-white transition-colors"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">F1</kbd> Cancel</button>
          <button onClick={() => { if (items.length > 0) handleHoldBill() }} className="flex items-center gap-1 hover:text-white transition-colors"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">F2</kbd> Hold</button>
          <button onClick={() => setShowHeldBills(true)} className="flex items-center gap-1 hover:text-white transition-colors"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">F3</kbd> Recall</button>
          <button onClick={() => items.length > 0 ? setShowPayment(true) : toast.error('Cart is empty')} className="flex items-center gap-1 hover:text-white transition-colors"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-primary text-primary-light">F4</kbd> Pay</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 border-l border-gray-700">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          {user.role === 'admin' && (
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white">
              <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
            </Button>
          )}
          <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Side: Cart & Search (60%) */}
        <div className="w-[60%] flex flex-col gap-4">
          <POSSearch onAdd={addItem} onFocusLoss={focusLoss} />
          <POSCart items={items} updateQty={updateQuantity} removeItem={removeItem} />
          
          {/* Cart Bottom Actions */}
          <div className="bg-white rounded-xl border border-border p-3 flex gap-3 shadow-sm">
            <Button variant="danger" className="flex-1" onClick={() => items.length > 0 && setShowCancelConfirm(true)} disabled={items.length === 0}>
              <RotateCcw className="w-4 h-4 mr-2" /> Cancel (F1)
            </Button>
            <Button variant="secondary" className="flex-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200" onClick={handleHoldBill} disabled={items.length === 0}>
              <PauseCircle className="w-4 h-4 mr-2" /> Hold (F2)
            </Button>
            <Button variant="secondary" className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" onClick={() => setShowHeldBills(true)}>
              <PlayCircle className="w-4 h-4 mr-2" /> Recall (F3)
              {heldBills.length > 0 && <span className="ml-1 bg-blue-200 text-blue-800 px-1.5 rounded-full text-xs">{heldBills.length}</span>}
            </Button>
          </div>
        </div>

        {/* Right Side: Totals & Customer (40%) */}
        <div className="w-[40%] flex flex-col gap-4">
          
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Customer Details
              {billingMode === 'wholesale' && <span className="text-xs text-danger ml-1">* Required</span>}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder="Customer Name" 
                value={customerName} 
                onChange={e => setCustomerName(e.target.value)} 
                className="bg-gray-50 focus:bg-white"
              />
              <Input 
                placeholder="Phone Number" 
                value={customerPhone} 
                onChange={e => setCustomerPhone(e.target.value)}
                className="bg-gray-50 focus:bg-white" 
              />
            </div>
          </div>

          {/* Totals & Discount */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <HandCoins className="w-4 h-4 text-success" /> Bill Summary
            </h3>
            
            <div className="space-y-3 flex-1">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal ({totals.itemCount} items)</span>
                <span className="font-medium text-text-primary amount">{formatINR(totals.subtotal)}</span>
              </div>

              {/* Discount Entry */}
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-border">
                <span className="text-sm font-medium text-text-secondary w-20">Discount</span>
                <Select value={discountType} onChange={e => setDiscountType(e.target.value as 'flat'|'percent')} className="w-24 py-1.5 text-xs">
                  <option value="flat">â‚¹ Flat</option>
                  <option value="percent">% Pct</option>
                </Select>
                <Input 
                  type="number" 
                  min="0"
                  value={discountValue || ''} 
                  onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)} 
                  className="flex-1 py-1.5 text-right font-bold"
                  placeholder="0"
                />
              </div>
              
              {totals.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount Applied</span>
                  <span className="font-medium amount">-{formatINR(totals.discount_amount)}</span>
                </div>
              )}

              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between text-sm text-text-secondary mb-1">
                  <span>CGST</span>
                  <span className="amount">{formatINR(totals.totalCgst)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>SGST</span>
                  <span className="amount">{formatINR(totals.totalSgst)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-5 text-white mt-auto">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 font-medium">Grand Total</span>
                <span className="text-4xl font-bold amount text-primary-100 tracking-tight">{formatINR(totals.grandTotal)}</span>
              </div>
            </div>

            <button 
              className="w-full mt-4 h-16 text-xl shadow-lg hover:shadow-xl transition-all rounded-lg flex items-center justify-center font-bold disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed bg-success text-white hover:bg-emerald-600"
              onClick={() => items.length > 0 && setShowPayment(true)}
              disabled={items.length === 0}
            >
              PAY NOW (F4) <CreditCard className="w-6 h-6 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <POSPayment 
        open={showPayment} 
        onClose={() => setShowPayment(false)} 
        onComplete={handleCompleteSale}
        grandTotal={totals.grandTotal} 
      />

      <HeldBillsModal 
        open={showHeldBills} 
        onClose={() => setShowHeldBills(false)} 
        bills={heldBills} 
        onRecall={handleRecallBill}
        onRemove={removeHeldBill}
      />

      <ConfirmDialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          clearCart()
          setCustomerName('')
          setCustomerPhone('')
          triggerFocus()
        }}
        title="Cancel Current Bill"
        message="Are you sure you want to clear the cart? All items will be removed."
      />

      {/* Hidden print area */}
      <div className="hidden">
        {lastSale && <POSReceipt ref={receiptRef} sale={lastSale} company={COMPANY} />}
      </div>
    </div>
  )
}
