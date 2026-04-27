/**
 * Edit Employee Page
 */
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react'
import { PageHeader, Button, Card, Input, Select, Textarea } from '@/components/ui'
import { getById, upsert } from '@/lib/db/store'
import { toast } from 'sonner'
import type { Employee, UserRole } from '@/types'

export default function EditEmployeePage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
    department: '',
    salary: '',
    join_date: '',
    address: '',
    password: '',
  })

  useEffect(() => {
    const emp = getById<Employee>('employees', id)
    if (emp) {
      setFormData({
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        role: emp.role,
        department: emp.department,
        salary: emp.salary ? (emp.salary / 100).toString() : '',
        join_date: emp.join_date,
        address: emp.address || '',
        password: emp.password || '',
      })
    } else {
      toast.error('Employee not found')
      router.push('/employees')
    }
  }, [id, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.role || !formData.department) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const existing = getById<Employee>('employees', id)
      if (!existing) throw new Error('Not found')

      const updatedEmployee: Employee = {
        ...existing,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        salary: formData.salary ? parseFloat(formData.salary) * 100 : undefined,
        address: formData.address,
        join_date: formData.join_date,
        password: formData.password,
        updated_at: new Date().toISOString()
      }

      upsert('employees', updatedEmployee)
      
      toast.success('Employee updated successfully')
      router.push('/employees')
    } catch (err) {
      toast.error('Failed to update employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="Edit Employee" 
        subtitle={`Updating details for ${formData.name}`}
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
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <Input 
                label="Email Address *" 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <Input 
                label="Phone Number" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input 
                label="Salary (Monthly)" 
                type="number" 
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Textarea 
                  label="Address" 
                  rows={3} 
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
              <h3 className="text-base font-semibold text-primary">Security</h3>
            </div>
            <Input 
              label="Reset Password" 
              type="password" 
              placeholder="Leave as is to keep current"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="bg-white"
            />
          </Card>

          <Button 
            className="w-full py-6 text-lg" 
            type="submit" 
            disabled={loading}
          >
            <Save className="w-5 h-5 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
