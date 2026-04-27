/**
 * Employee Management Page — List View
 */
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, UserPlus, Mail, Phone, MapPin, Briefcase, Users, MoreVertical, Edit2, Trash2 } from 'lucide-react'
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

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." />
            <Select 
              value={deptFilter} 
              onChange={e => setDeptFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          
          <div className="text-sm font-medium">
            <span className="text-text-secondary">Showing:</span> 
            <span className="ml-1 text-primary">{filtered.length} Staff Members</span>
          </div>
        </div>
      </Card>

      {/* Employee List Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Employee Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Department</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Join Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary text-sm">{emp.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">ID: {emp.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      {emp.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Mail className="w-3 h-3 text-gray-300" />
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Phone className="w-3 h-3 text-gray-300" />
                        {emp.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatDate(emp.join_date)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={emp.is_active ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-danger hover:bg-danger/5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-200 mb-3" />
            <p className="text-text-secondary">No employees found matching your filters.</p>
            <Button variant="ghost" className="mt-2 text-primary" onClick={() => { setSearch(''); setDeptFilter('all') }}>
              Clear all filters
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
