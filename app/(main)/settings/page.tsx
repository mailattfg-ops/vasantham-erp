/**
 * Settings Page
 */
'use client'
import { PageHeader, Card, Input, Button } from '@/components/ui'
import { COMPANY } from '@/lib/db/seed'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="System Settings" subtitle="Manage company profile and application preferences" />
      
      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-text-primary border-b border-border pb-3 mb-4">Company Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Company Name" defaultValue={COMPANY.name} />
          </div>
          <Input label="Tagline" defaultValue={COMPANY.tagline} />
          <Input label="GSTIN" defaultValue={COMPANY.gstin} />
          <Input label="Phone Number" defaultValue={COMPANY.phone} />
          <Input label="Email Address" defaultValue={COMPANY.email} />
          <div className="col-span-2">
            <Input label="Address" defaultValue={COMPANY.address} />
          </div>
          <Input label="City" defaultValue={COMPANY.city} />
          <Input label="State" defaultValue={COMPANY.state} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-text-primary border-b border-border pb-3 mb-4">Print Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-text-primary">Barcode Label Size</p>
              <p className="text-sm text-text-secondary">Default size for printing barcode stickers</p>
            </div>
            <select className="px-3 py-1.5 border border-border rounded bg-white text-sm">
              <option>50mm x 25mm</option>
              <option>40mm x 20mm</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="font-medium text-text-primary">POS Receipt Printer</p>
              <p className="text-sm text-text-secondary">Default paper width for thermal receipts</p>
            </div>
            <select className="px-3 py-1.5 border border-border rounded bg-white text-sm">
              <option>80mm (3 inch)</option>
              <option>58mm (2 inch)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}
