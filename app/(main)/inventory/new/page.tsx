/**
 * Create New Item Page
 */
'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'
import { ArrowLeft, Save } from 'lucide-react'
import { PageHeader, Button, Card, Input, Select, Textarea } from '@/components/ui'
import { getAll, saveAll, upsert } from '@/lib/db/store'
import { rupeesToPaise } from '@/lib/utils/currency'
import { generateBarcodeValue } from '@/lib/utils/barcode'
import type { Category, Item, Barcode } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  hsn_code: z.string().min(1, 'HSN code is required'),
  gst_rate: z.coerce.number(),
  mrp: z.coerce.number().min(0),
  cost_price: z.coerce.number().min(0),
  min_stock_level: z.coerce.number().min(0),
})
type ItemForm = z.infer<typeof schema>

export default function NewItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const categories = useMemo(() => getAll<Category>('categories'), [])

  const { register, handleSubmit, formState: { errors } } = useForm<ItemForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      unit: 'metre',
      gst_rate: 5,
      mrp: 0,
      cost_price: 0,
      min_stock_level: 10,
    }
  })

  const onSubmit = async (data: ItemForm) => {
    setLoading(true)
    try {
      const items = getAll<Item>('items')
      const cat = categories.find(c => c.id === data.category_id)
      const catCode = cat ? cat.name.substring(0, 3).toUpperCase() : 'UNK'
      
      const newId = `item-${nanoid(8)}`
      const sequence = items.length + 1
      const sku = generateBarcodeValue(catCode, sequence)

      const newItem: Item = {
        id: newId,
        sku,
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        unit: data.unit,
        hsn_code: data.hsn_code,
        gst_rate: data.gst_rate as any,
        mrp: rupeesToPaise(data.mrp),
        cost_price: rupeesToPaise(data.cost_price),
        stock_quantity: 0,
        min_stock_level: data.min_stock_level,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      upsert('items', newItem)

      // Generate barcode entry
      const newBarcode: Barcode = {
        id: `bc-${nanoid(8)}`,
        item_id: newId,
        barcode_value: sku,
        format: 'CODE128',
        created_at: new Date().toISOString()
      }
      upsert('barcodes', newBarcode)

      toast.success('Item created successfully with barcode: ' + sku)
      router.push('/inventory')
    } catch (err) {
      toast.error('Failed to create item')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="New Item" 
        subtitle="Add a new product to inventory"
        actions={
          <Link href="/inventory">
            <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 mb-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <Input label="Item Name *" placeholder="e.g. Pure Silk Saree" {...register('name')} error={errors.name?.message} />
            </div>
            <div className="col-span-2">
              <Textarea label="Description" placeholder="Optional details..." rows={2} {...register('description')} error={errors.description?.message} />
            </div>
            <Select label="Category *" {...register('category_id')} error={errors.category_id?.message}>
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Unit *" {...register('unit')} error={errors.unit?.message}>
              <option value="metre">Metre (m)</option>
              <option value="piece">Piece (pc)</option>
              <option value="set">Set</option>
              <option value="kg">Kilogram (kg)</option>
            </Select>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Pricing & Tax</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cost Price (₹) *" type="number" step="0.01" {...register('cost_price')} error={errors.cost_price?.message} />
            <Input label="MRP (₹) *" type="number" step="0.01" {...register('mrp')} error={errors.mrp?.message} />
            <Input label="HSN Code *" {...register('hsn_code')} error={errors.hsn_code?.message} />
            <Select label="GST Rate (%) *" {...register('gst_rate')} error={errors.gst_rate?.message}>
              <option value="0">0% (Exempt)</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
            </Select>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Inventory Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Low Stock Alert Level *" type="number" {...register('min_stock_level')} error={errors.min_stock_level?.message} />
          </div>
          <p className="text-xs text-text-secondary mt-3">Note: Stock quantity can be updated via Purchase Entry or Stock Adjustment.</p>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/inventory"><Button variant="secondary">Cancel</Button></Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Item</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
