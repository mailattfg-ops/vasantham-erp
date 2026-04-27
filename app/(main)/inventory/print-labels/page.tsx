/**
 * Bulk Barcode Label Printing Page
 */
'use client'
import { useState, useMemo, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Printer, Search, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Card, Input } from '@/components/ui'
import { BarcodeLabel } from '@/components/barcode/BarcodeLabel'
import { getAll } from '@/lib/db/store'
import type { Item } from '@/types'

interface PrintItem {
  item: Item
  quantity: number
}

export default function PrintLabelsPage() {
  const [search, setSearch] = useState('')
  const [printList, setPrintList] = useState<PrintItem[]>([])
  
  const allItems = useMemo(() => getAll<Item>('items').filter(i => !i.deleted_at && i.is_active), [])
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Barcode-Labels',
  })

  // Filter items based on search
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const s = search.toLowerCase()
    return allItems.filter(item => 
      (item.name.toLowerCase().includes(s) || item.sku.toLowerCase().includes(s)) &&
      !printList.some(pl => pl.item.id === item.id) // exclude already added
    ).slice(0, 5) // limit results
  }, [search, allItems, printList])

  const addItemToPrint = (item: Item) => {
    setPrintList([...printList, { item, quantity: 1 }])
    setSearch('')
  }

  const removeItem = (id: string) => {
    setPrintList(printList.filter(p => p.item.id !== id))
  }

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    setPrintList(printList.map(p => p.item.id === id ? { ...p, quantity: qty } : p))
  }

  const totalLabels = printList.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="max-w-6xl mx-auto flex gap-6 h-full">
      {/* Left panel - Selection */}
      <div className="w-1/2 flex flex-col no-print">
        <PageHeader 
          title="Print Barcode Labels" 
          subtitle="Select items and set quantities to print"
        />

        <Card className="p-5 mb-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items by name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-2 border border-border rounded-lg overflow-hidden bg-white">
              {searchResults.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-text-secondary">{item.sku}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => addItemToPrint(item)}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-text-primary text-sm">Items to Print</h3>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              {totalLabels} labels total
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {printList.length === 0 ? (
              <div className="text-center py-10 text-text-secondary">
                <p className="text-sm">No items added.</p>
                <p className="text-xs mt-1">Search and add items to begin.</p>
              </div>
            ) : (
              printList.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border border-border rounded-lg bg-white">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-text-secondary">{item.sku}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-text-secondary">Qty:</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity}
                      onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-border rounded text-sm text-center"
                    />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-text-secondary hover:text-danger hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-border bg-gray-50 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setPrintList([])} disabled={printList.length === 0}>
              Clear All
            </Button>
            <Button onClick={() => handlePrint()} disabled={printList.length === 0}>
              <Printer className="w-4 h-4 mr-2" /> Print Labels
            </Button>
          </div>
        </Card>
      </div>

      {/* Right panel - Preview & Hidden Print Area */}
      <div className="w-1/2 flex flex-col no-print bg-gray-100 rounded-xl p-6 border border-border relative overflow-hidden">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
          Preview
          {totalLabels > 0 && <span className="text-xs font-normal text-text-secondary">(Showing first 10)</span>}
        </h3>
        
        {printList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            Preview will appear here
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-wrap gap-4 justify-center items-start">
              {printList.slice(0, 10).map(({ item }) => (
                <div key={`preview-${item.id}`} className="shadow-md">
                  <BarcodeLabel item={item} size="50x25" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-start gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Make sure your printer is loaded with <strong>50x25mm</strong> labels. In the print dialog, select <strong>No Margins</strong> and disable Headers/Footers.</p>
        </div>
      </div>

      {/* Actual Hidden Print Area */}
      <div className="hidden">
        <div ref={printRef} className="print-only">
          <style type="text/css" media="print">
            {`
              @page { size: 50mm 25mm; margin: 0; }
              body { margin: 0; padding: 0; }
              .label-page { 
                width: 50mm; height: 25mm; 
                display: flex; align-items: center; justify-content: center;
                overflow: hidden;
                page-break-after: always;
              }
            `}
          </style>
          {printList.flatMap(({ item, quantity }) => 
            Array.from({ length: quantity }).map((_, i) => (
              <div key={`${item.id}-${i}`} className="label-page">
                <BarcodeLabel item={item} size="50x25" className="border-none" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
