/**
 * Inventory List Page
 */
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Edit, Eye, Tag, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Card, StatusBadge, Input } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import type { Item, Category } from '@/types'

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const items = useMemo(() => getAll<Item>('items').filter(i => !i.deleted_at), [])
  const categories = useMemo(() => getAll<Category>('categories'), [])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCat === 'all' || item.category_id === filterCat
      return matchSearch && matchCat
    })
  }, [items, search, filterCat])

  return (
    <div>
      <PageHeader 
        title="Inventory Items" 
        subtitle={`Manage products, stock, and pricing (${items.length} items total)`}
        actions={
          <>
            <Link href="/inventory/print-labels">
              <Button variant="secondary" className="mr-2">
                <Tag className="w-4 h-4" /> Print Labels
              </Button>
            </Link>
            <Link href="/inventory/new">
              <Button>
                <Plus className="w-4 h-4" /> Add New Item
              </Button>
            </Link>
          </>
        }
      />

      <Card className="mb-6">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search items by name or SKU..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <select 
              value={filterCat} 
              onChange={e => setFilterCat(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border rounded-lg text-sm appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-4 py-3 font-medium">Item Details</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">MRP / Cost</th>
                <th className="px-4 py-3 font-medium text-right">Stock</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary text-sm">
                    No items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const cat = categories.find(c => c.id === item.category_id)
                  const isLow = item.stock_quantity <= item.min_stock_level
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-text-primary">{item.name}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{item.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {cat?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-text-primary amount">{formatINR(item.mrp)}</div>
                        <div className="text-xs text-text-secondary amount mt-0.5">{formatINR(item.cost_price)}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className={`font-bold ${isLow ? 'text-danger' : 'text-text-primary'}`}>
                          {item.stock_quantity} <span className="text-xs font-normal text-text-secondary">{item.unit}</span>
                        </div>
                        {isLow && (
                          <div className="text-[10px] text-danger flex items-center justify-end gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/inventory/${item.id}`} className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/inventory/${item.id}/edit`} className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
