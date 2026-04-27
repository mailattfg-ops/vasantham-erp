/**
 * New Vendor Page
 */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'
import { PageHeader, Button, Card, Input, Select } from '@/components/ui'
import { upsert } from '@/lib/db/store'
import { rupeesToPaise } from '@/lib/utils/currency'
import type { Vendor } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Company name is required'),
  contact_person: z.string().optional(),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email('Valid email required').or(z.literal('')),
  gst_number: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().optional(),
  opening_balance: z.coerce.number().min(0)
})
type VendorForm = z.infer<typeof schema>

export default function NewVendorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<VendorForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: { opening_balance: 0, state: 'Kerala' }
  })

  const onSubmit = async (data: VendorForm) => {
    setLoading(true)
    try {
      const vendorId = `ven-${nanoid(8)}`
      const balPaise = rupeesToPaise(data.opening_balance)

      const vendor: Vendor = {
        id: vendorId,
        ...data,
        opening_balance: balPaise,
        current_balance: balPaise, // initial is same
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      upsert('vendors', vendor)
      toast.success('Vendor added successfully')
      router.push('/vendors')
    } catch (err) {
      toast.error('Failed to add vendor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Add New Vendor" 
        actions={
          <Link href="/vendors">
            <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 mb-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Company Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Company Name *" {...register('name')} error={errors.name?.message} />
            </div>
            <Input label="Contact Person" {...register('contact_person')} error={errors.contact_person?.message} />
            <Input label="Phone Number *" {...register('phone')} error={errors.phone?.message} />
            <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="GSTIN" {...register('gst_number')} error={errors.gst_number?.message} />
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Street Address *" {...register('address')} error={errors.address?.message} />
            </div>
            <Input label="City *" {...register('city')} error={errors.city?.message} />
            <Select label="State *" {...register('state')} error={errors.state?.message}>
              <option value="Kerala">Kerala</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
            </Select>
            <Input label="PIN Code" {...register('pincode')} error={errors.pincode?.message} />
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Financial Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Opening Balance (₹ payable)" type="number" step="0.01" {...register('opening_balance')} error={errors.opening_balance?.message} />
          </div>
          <p className="text-xs text-text-secondary mt-3">This amount will be added to the vendor's outstanding payables.</p>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/vendors"><Button variant="secondary">Cancel</Button></Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Vendor</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
