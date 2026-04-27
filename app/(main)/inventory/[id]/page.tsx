/**
 * Item Details Page
 */
'use client'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Tag, Package, BarChart2 } from 'lucide-react'
import { PageHeader, Button, Card, StatusBadge, StatCard } from '@/components/ui'
import { BarcodeLabel } from '@/components/barcode/BarcodeLabel'
import { getById, getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import type { Item, Category } from '@/types'

export default function ItemDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const item = useMemo(() => getById<Item>('items', id), [id])
  const category = useMemo(() => item ? getById<Category>('categories', item.category_id) : null, [item])

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-text-primary">Item not found</h2>
        <Link href="/inventory" className="text-primary hover:underline mt-2 inline-block">Back to Inventory</Link>
      </div>
    )
  }

  const isLowStock = item.stock_quantity <= item.min_stock_level

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader 
        title={item.name} 
        subtitle={item.sku}
        actions={
          <>
            <Link href="/inventory">
              <Button variant="ghost" className="mr-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
            </Link>
            <Link href={`/inventory/${item.id}/edit`}>
              <Button variant="secondary"><Edit className="w-4 h-4 mr-1" /> Edit Item</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3 mb-4">Item Details</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-text-secondary">Description</p>
                <p className="text-sm font-medium text-text-primary mt-1">{item.description || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Category</p>
                <p className="text-sm font-medium text-text-primary mt-1">{category?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Unit</p>
                <p className="text-sm font-medium text-text-primary mt-1 capitalize">{item.unit}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Status</p>
                <div className="mt-1"><StatusBadge status={item.is_active ? 'active' : 'inactive'} /></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3 mb-4">Pricing & Tax Information</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-text-secondary">Cost Price</p>
                <p className="text-lg font-semibold text-text-primary amount mt-1">{formatINR(item.cost_price)}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">MRP (Selling Price)</p>
                <p className="text-lg font-semibold text-primary amount mt-1">{formatINR(item.mrp)}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">HSN Code</p>
                <p className="text-sm font-medium text-text-primary mt-1">{item.hsn_code}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">GST Rate</p>
                <p className="text-sm font-medium text-text-primary mt-1">{item.gst_rate}% (CGST {item.gst_rate/2}% + SGST {item.gst_rate/2}%)</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <StatCard 
            label="Current Stock" 
            value={`${item.stock_quantity} ${item.unit}`}
            icon={Package} 
            color={isLowStock ? 'text-danger' : 'text-success'}
            sub={isLowStock ? 'Low stock alert!' : 'Stock level is good'}
          />
          
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-base font-semibold text-text-primary">Barcode Preview</h3>
              <Tag className="w-4 h-4 text-text-secondary" />
            </div>
            
            <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-lg mb-4">
              <BarcodeLabel item={item} size="50x25" />
              <p className="text-xs text-text-secondary mt-3">Preview of 50x25mm label</p>
            </div>
            
            <Link href={`/inventory/print-labels?item_id=${item.id}`} className="block w-full">
              <Button className="w-full justify-center" variant="secondary">
                Print Labels for Item
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
