import React, { useState, useEffect } from 'react'
import { CreditCard, Banknote, Smartphone, Receipt, ChevronRight, AlertCircle } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { POSNumpad } from './POSNumpad'
import { formatINR, rupeesToPaise, paiseToRupees } from '@/lib/utils/currency'
import type { PaymentMode } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onComplete: (payments: { mode: PaymentMode; amount: number }[], change: number) => void
  grandTotal: number
}

export function POSPayment({ open, onClose, onComplete, grandTotal }: Props) {
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('cash')
  const [cashTendered, setCashTendered] = useState<string>('')
  
  // Reset when opened
  useEffect(() => {
    if (open) {
      setSelectedMode('cash')
      setCashTendered('')
    }
  }, [open])

  const handleNumpadKey = (key: string) => {
    if (key === 'C') {
      setCashTendered('')
    } else if (key === '⌫') {
      setCashTendered(prev => prev.slice(0, -1))
    } else {
      // Prevent multiple decimals (though we are using integers mostly, let's keep it simple string append)
      setCashTendered(prev => prev + key)
    }
  }

  const handleExactCash = () => {
    setCashTendered(paiseToRupees(grandTotal).toString())
  }

  const tenderedPaise = cashTendered ? rupeesToPaise(parseFloat(cashTendered)) : 0
  const changeToReturn = Math.max(0, tenderedPaise - grandTotal)
  const isSufficient = selectedMode === 'cash' ? tenderedPaise >= grandTotal : true

  const handlePay = () => {
    if (!isSufficient) return
    onComplete([{ mode: selectedMode, amount: grandTotal }], changeToReturn)
  }

  const modes = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-emerald-500' },
    { id: 'upi', label: 'UPI / QR', icon: Smartphone, color: 'bg-primary' },
    { id: 'card', label: 'Card (POS)', icon: CreditCard, color: 'bg-indigo-500' },
  ] as const

  return (
    <Modal open={open} onClose={onClose} title="Complete Payment" size="lg">
      <div className="flex gap-6 h-[500px]">
        {/* Left Side: Modes & Details */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-50 rounded-xl p-6 mb-6 flex-shrink-0 border border-border text-center">
            <p className="text-sm font-medium text-text-secondary mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold text-text-primary amount tracking-tight">{formatINR(grandTotal)}</p>
          </div>

          <p className="text-sm font-medium text-text-primary mb-3">Payment Method</p>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {modes.map(mode => {
              const active = selectedMode === mode.id
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    active ? `border-primary bg-primary/5 shadow-md` : 'border-border bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? mode.color : 'bg-gray-100'}`}>
                    <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-semibold text-lg ${active ? 'text-primary-dark' : 'text-text-primary'}`}>{mode.label}</p>
                  </div>
                  {active && <ChevronRight className="w-6 h-6 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Side: Cash handling or confirmation */}
        <div className="w-1/2 border-l border-border pl-6 flex flex-col">
          {selectedMode === 'cash' ? (
            <>
              <div className="mb-4 flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Cash Tendered (₹)</p>
                  <input
                    type="text"
                    readOnly
                    value={cashTendered}
                    placeholder="0.00"
                    className="w-full text-3xl font-bold font-mono text-text-primary bg-gray-50 border border-border rounded-xl p-4 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <Button variant="secondary" onClick={handleExactCash} className="flex-1 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                  Exact {formatINR(grandTotal).replace('.00', '')}
                </Button>
                {[500, 1000, 2000].map(amt => (
                  <Button key={amt} variant="ghost" className="flex-1 py-3 border border-border" onClick={() => setCashTendered(amt.toString())}>
                    ₹{amt}
                  </Button>
                ))}
              </div>

              <div className="flex-1 mb-6">
                <POSNumpad onKey={handleNumpadKey} />
              </div>

              <div className={`p-4 rounded-xl mb-6 flex justify-between items-center ${
                tenderedPaise >= grandTotal ? 'bg-success/10 text-emerald-800 border border-success/20' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <span className="font-semibold text-lg">Change Return</span>
                <span className="font-bold text-2xl amount">{formatINR(changeToReturn)}</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-white ${modes.find(m=>m.id===selectedMode)?.color}`}>
                {selectedMode === 'upi' ? <Smartphone className="w-10 h-10" /> : <CreditCard className="w-10 h-10" />}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Pay via {modes.find(m=>m.id===selectedMode)?.label}
              </h3>
              <p className="text-text-secondary">
                Please collect the payment of <strong className="text-black amount">{formatINR(grandTotal)}</strong> using the terminal or QR code.
              </p>
            </div>
          )}

          <Button 
            size="lg" 
            onClick={handlePay} 
            disabled={!isSufficient}
            className={`w-full py-4 text-lg font-bold shadow-lg ${isSufficient ? 'bg-success hover:bg-emerald-600' : 'bg-gray-300 text-gray-500'}`}
          >
            {isSufficient ? 'Complete Payment & Print' : 'Insufficient Cash Tendered'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
