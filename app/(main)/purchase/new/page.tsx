/**
 * New Purchase Entry
 */
'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { ArrowLeft, Save, Search, Plus, Trash2, Box } from 'lucide-react'
import { PageHeader, Button, Card, Select, Input } from '@/components/ui'
import { getAll, upsert, nextSeq } from '@/lib/db/store'
import { formatINR, rupeesToPaise } from '@/lib/utils/currency'
import { generatePurchaseRef } from '@/lib/utils/barcode'
import { calculateGST } from '@/lib/utils/gst'
import { useAuth } from '@/lib/auth/context'
import type { Vendor, Item, Purchase, PurchaseItem } from '@/types'

interface PurchaseLine {
  id: string
  item_id: string
  quantity: number
  unit_price: number // rupees
  gst_rate: number
}

export default function NewPurchasePage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const vendors = useMemo(() => getAll<Vendor>('vendors'), [])
  const items = useMemo(() => getAll<Item>('items').filter(i => i.is_active && !i.deleted_at), [])

  const [vendorId, setVendorId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [lines, setLines] = useState<PurchaseLine[]>([])
  
  // Search for adding items
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const s = search.toLowerCase()
    return items.filter(i => i.name.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s)).slice(0, 5)
  }, [search, items])

  const addLine = (item: Item) => {
    setLines(prev => {
      const existing = prev.find(l => l.item_id === item.id)
      if (existing) {
        return prev.map(l => l.item_id === item.id ? { ...l, quantity: l.quantity + 1 } : l)
      }
      return [...prev, {
        id: nanoid(),
        item_id: item.id,
        quantity: 1,
        unit_price: item.cost_price / 100, // convert paise to rupees for input
        gst_rate: item.gst_rate
      }]
    })
    setSearch('')
  }

  const updateLine = (id: string, field: keyof PurchaseLine, value: number) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const removeLine = (id: string) => {
    setLines(prev => prev.filter(l => l.id !== id))
  }

  // Derived Totals
  const totals = useMemo(() => {
    let subtotal = 0
    let cgst = 0
    let sgst = 0

    lines.forEach(l => {
      const pricePaise = rupeesToPaise(l.unit_price)
      const lineSubtotal = pricePaise * l.quantity
      const gst = calculateGST(lineSubtotal, l.gst_rate as any)
      
      subtotal += lineSubtotal
      cgst += gst.cgst
      sgst += gst.sgst
    })

    return {
      subtotal,
      cgst,
      sgst,
      total: subtotal + cgst + sgst
    }
  }, [lines])

  const handleSave = () => {
    if (!vendorId) { toast.error('Select a vendor'); return }
    if (lines.length === 0) { toast.error('Add at least one item'); return }

    const seq = nextSeq('purchases')
    const ref = generatePurchaseRef(seq)
    const purchaseId = `pur-${nanoid(8)}`

    // Create Purchase
    const purchase: Purchase = {
      id: purchaseId,
      reference_number: ref,
      vendor_id: vendorId,
      date,
      status: 'received',
      subtotal: totals.subtotal,
      discount_type: 'flat',
      discount_value: 0,
      discount_amount: 0,
      cgst_amount: totals.cgst,
      sgst_amount: totals.sgst,
      total_amount: totals.total,
      paid_amount: 0, // Assume unpaid initially
      created_by: user?.id || 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: lines.map(l => {
        const item = items.find(i => i.id === l.item_id)!
        const pricePaise = rupeesToPaise(l.unit_price)
        const gst = calculateGST(pricePaise * l.quantity, l.gst_rate as any)
        
        return {
          id: `pi-${nanoid(8)}`,
          purchase_id: purchaseId,
          item_id: l.item_id,
          quantity: l.quantity,
          unit_price: pricePaise,
          gst_rate: l.gst_rate as any,
          cgst_amount: gst.cgst,
          sgst_amount: gst.sgst,
          total_amount: gst.totalAmount
        }
      })
    }

    // Update Stock
    const dbItems = getAll<Item>('items')
    lines.forEach(l => {
      const dbItem = dbItems.find(i => i.id === l.item_id)
      if (dbItem) {
        dbItem.stock_quantity += l.quantity
        upsert('items', dbItem)
      }
    })

    // Update Vendor Balance
    const vendor = vendors.find(v => v.id === vendorId)
    if (vendor) {
      vendor.current_balance += totals.total
      upsert('vendors', vendor)
    }

    upsert('purchases', purchase)
    toast.success('Purchase recorded successfully')
    router.push('/purchase')
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <PageHeader 
        title="New Purchase Entry" 
        subtitle="Record inventory intake from vendors"
        actions={
          <Link href="/purchase">
            <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3 mb-4">Items Intake</h3>
            
            {/* Search/Scan Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Scan barcode or search items to add..."
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                  {searchResults.map(item => (
                    <div 
                      key={item.id} 
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-border last:border-0"
                      onClick={() => addLine(item)}
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">{item.name}</p>
                        <p className="text-xs text-text-secondary">{item.sku}</p>
                      </div>
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Line Items Table */}
            {lines.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-lg bg-gray-50">
                <Box className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-text-secondary">Search and add items to the purchase list</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-border text-xs uppercase text-text-secondary">
                    <tr>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2 w-24">Qty</th>
                      <th className="px-3 py-2 w-28">Cost/Unit (₹)</th>
                      <th className="px-3 py-2 w-24">GST %</th>
                      <th className="px-3 py-2 w-28 text-right">Total (₹)</th>
                      <th className="px-3 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {lines.map((line, idx) => {
                      const item = items.find(i => i.id === line.item_id)!
                      const subtotal = rupeesToPaise(line.unit_price) * line.quantity
                      const lineTotal = calculateGST(subtotal, line.gst_rate as any).totalAmount
                      
                      return (
                        <tr key={line.id} className="bg-white">
                          <td className="px-3 py-2">
                            <p className="font-medium text-text-primary truncate max-w-[200px]">{item.name}</p>
                            <p className="text-[10px] text-text-secondary">{item.sku}</p>
                          </td>
                          <td className="px-3 py-2">
                            <input 
                              type="number" min="1" 
                              value={line.quantity}
                              onChange={e => updateLine(line.id, 'quantity', parseInt(e.target.value)||1)}
                              className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:border-primary text-center"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input 
                              type="number" min="0" step="0.01"
                              value={line.unit_price}
                              onChange={e => updateLine(line.id, 'unit_price', parseFloat(e.target.value)||0)}
                              className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:border-primary text-right"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select 
                              value={line.gst_rate}
                              onChange={e => updateLine(line.id, 'gst_rate', parseInt(e.target.value)||0)}
                              className="w-full px-1 py-1 border border-border rounded focus:outline-none focus:border-primary"
                            >
                              <option value="0">0%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                            </select>
                          </td>
                          <td className="px-3 py-2 text-right font-medium amount text-text-primary">
                            {formatINR(lineTotal).replace('₹','')}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => removeLine(line.id)} className="text-text-secondary hover:text-danger p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <Card className="p-6 shadow-sm border-gray-100">
              <h3 className="text-base font-bold text-text-primary border-b border-gray-50 pb-3 mb-4">Vendor Details</h3>
              <div className="space-y-4">
                <Select label="Select Vendor *" value={vendorId} onChange={e => setVendorId(e.target.value)}>
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </Select>
                
                <Input label="Purchase Date *" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </Card>

            <Card className="p-6 shadow-md border-primary/10">
              <h3 className="text-base font-bold text-text-primary border-b border-gray-50 pb-3 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Total Items</span>
                  <span className="font-bold">{lines.reduce((s, l) => s + l.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span className="amount font-medium">{formatINR(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>CGST</span>
                  <span className="amount font-medium text-amber-600">{formatINR(totals.cgst)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>SGST</span>
                  <span className="amount font-medium text-amber-600">{formatINR(totals.sgst)}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-500 text-xs uppercase tracking-widest">Total Value</span>
                    <span className="amount text-2xl font-bold text-primary">{formatINR(totals.total)}</span>
                  </div>
                </div>
              </div>

              <Button 
                className={`w-full mt-8 py-6 text-base font-bold shadow-lg transition-all duration-300 ${
                  lines.length > 0 && vendorId 
                    ? 'bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                }`} 
                onClick={handleSave} 
                disabled={lines.length === 0 || !vendorId}
              >
                <Save className="w-5 h-5 mr-2" /> Save & Update Stock
              </Button>
              
              {(lines.length === 0 || !vendorId) && (
                <p className="text-[10px] text-center text-red-400 mt-3 font-medium animate-pulse">
                  {!vendorId ? 'Please select a vendor' : 'Add at least one item to save'}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
