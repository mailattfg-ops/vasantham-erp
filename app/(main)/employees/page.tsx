/**
 * Employee Management Page
 */
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, UserPlus, Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import { PageHeader, Button, Card, SearchInput, StatusBadge, Select } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatDate } from '@/lib/utils/date'
import type { Employee } from '@/types'

export default function EmployeesPage() {
  const employees = useMemo(() => getAll<Employee>('employees').filter(e => !e.deleted_at), [])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')

  const departments = useMemo(() => {
    const set = new Set(employees.map(e => e.department).filter(Boolean))
    return Array.from(set).sort()
  }, [employees])

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.email.toLowerCase().includes(search.toLowerCase())
      const matchDept = deptFilter === 'all' || e.department === deptFilter
      return matchSearch && matchDept
    })
  }, [employees, search, deptFilter])

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employee Directory" 
        subtitle="Manage staff details, departments, and access roles"
        actions={
          <Link href="/employees/new">
            <Button>
              <UserPlus className="w-4 h-4 mr-1.5" /> Add Employee
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." />
          <Select 
            value={deptFilter} 
            onChange={e => setDeptFilter(e.target.value)}
            className="w-44"
          >
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
        
        <div className="text-sm text-text-secondary">
          Total Staff: <span className="font-bold text-text-primary">{employees.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(emp => (
          <Card key={emp.id} className="overflow-hidden group hover:border-primary/40 transition-all hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={emp.is_active ? 'active' : 'inactive'} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {emp.role}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{emp.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {emp.department}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Mail className="w-4 h-4 text-gray-300" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="w-4 h-4 text-gray-300" />
                  <span>{emp.phone}</span>
                </div>
                {emp.address && (
                  <div className="flex items-start gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{emp.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-border flex justify-between items-center">
              <span className="text-[10px] text-text-secondary">Joined {formatDate(emp.join_date)}</span>
              <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/5">
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20">
            <Card className="p-12 text-center bg-gray-50/50 border-dashed">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">No employees found</h3>
              <p className="text-sm text-text-secondary mt-1">Try adjusting your search or filters</p>
              <Link href="/employees/new" className="mt-6 inline-block">
                <Button variant="secondary">Add New Employee</Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
