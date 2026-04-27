/**
 * New Employee Creation Page
 */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, UserPlus, ShieldCheck } from 'lucide-react'
import { PageHeader, Button, Card, Input, Select, Textarea } from '@/components/ui'
import { upsert, nextSeq } from '@/lib/db/store'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'
import type { Employee, UserRole } from '@/types'

export default function NewEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
    department: '',
    salary: '',
    join_date: new Date().toISOString().slice(0, 10),
    address: '',
    password: '', // for mock login setup
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.role || !formData.department) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const empId = `emp-${nanoid(8)}`
      const userId = `usr-${nanoid(8)}`

      const newEmployee: Employee = {
        id: empId,
        user_id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        salary: formData.salary ? parseFloat(formData.salary) * 100 : undefined,
        address: formData.address,
        join_date: formData.join_date,
        is_active: true,
        password: formData.password || 'password123', // default if not provided
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      upsert('employees', newEmployee)
      
      toast.success('Employee created successfully')
      router.push('/employees')
    } catch (err) {
      toast.error('Failed to create employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="Add New Employee" 
        subtitle="Onboard a new staff member and set up their access"
        actions={
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3 mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Full Name *" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <Input 
                label="Email Address *" 
                type="email" 
                placeholder="john@vasantham.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <Input 
                label="Phone Number" 
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input 
                label="Salary (Monthly)" 
                type="number" 
                placeholder="0.00"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Textarea 
                  label="Address" 
                  rows={3} 
                  placeholder="Street address..."
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3 mb-5">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select 
                label="Department *" 
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Inventory">Inventory</option>
                <option value="Cash Counter">Cash Counter</option>
                <option value="Administration">Administration</option>
                <option value="Logistics">Logistics</option>
              </Select>
              <Select 
                label="Access Role *" 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value="staff">Staff (Inventory & Basic)</option>
                <option value="cashier">Cashier (POS & Sales)</option>
                <option value="admin">Administrator (Full Access)</option>
              </Select>
              <Input 
                label="Joining Date *" 
                type="date" 
                value={formData.join_date}
                onChange={e => setFormData({ ...formData, join_date: e.target.value })}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-primary">Login Setup</h3>
            </div>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Setting a password will allow this employee to log in to the ERP using their email address.
            </p>
            <Input 
              label="Login Password" 
              type="password" 
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="bg-white"
            />
            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-primary/10">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Role Permissions</p>
              <p className="text-xs text-text-secondary">
                {formData.role === 'admin' ? 'Can access all modules, financial reports, and settings.' :
                 formData.role === 'cashier' ? 'Can access POS terminal and view personal sales history.' :
                 'Can access inventory and record stock changes.'}
              </p>
            </div>
          </Card>

          <Button 
            className="w-full py-6 text-lg" 
            type="submit"
            disabled={loading}
          >
            <Save className="w-5 h-5 mr-2" /> Save Employee
          </Button>
        </div>
      </form>
    </div>
  )
}
