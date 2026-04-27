/**
 * Purchase Returns Page
 */
'use client'
import { useState, useMemo } from 'react'
import { Truck, RotateCcw, Search, Plus, Filter, Calendar } from 'lucide-react'
import { PageHeader, Button, Card, SearchInput, StatusBadge, Select } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatDate } from '@/lib/utils/date'
import { formatCurrency } from '@/lib/utils/currency'

export default function PurchaseReturnsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data for returns (in a real app, this would come from the DB)
  const returns = useMemo(() => [
    { id: 'PR-1001', date: '2026-04-25', vendor: 'Surat Silk House', amount: 450000, items: 12, status: 'completed' },
    { id: 'PR-1002', date: '2026-04-26', vendor: 'Heritage Cotton', amount: 120000, items: 5, status: 'pending' },
    { id: 'PR-1003', date: '2026-04-27', vendor: 'Textile Hub', amount: 85000, items: 3, status: 'completed' },
  ], [])

  const filtered = useMemo(() => {
    return returns.filter(r => {
      const matchSearch = r.vendor.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [returns, search, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Purchase Returns" 
        subtitle="Manage stock returns to suppliers and debit notes"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" /> New Purchase Return
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Returns</p>
            <p className="text-2xl font-bold text-text-primary mt-0.5">{returns.length}</p>
          </div>
        </Card>
        
        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-primary">
          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Debit Note Total</p>
            <p className="text-2xl font-bold text-text-primary mt-0.5">{formatCurrency(655000)}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Returns This Month</p>
            <p className="text-2xl font-bold text-text-primary mt-0.5">8</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by Vendor or ID..." />
            <Select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Returns Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">Return ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Refund Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-sm text-primary">{item.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-text-primary">{item.vendor}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {item.items} Units
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-text-primary">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status as any} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-primary">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
