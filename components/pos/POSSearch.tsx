import React, { useRef, useEffect, useState } from 'react'
import { Search, Barcode } from 'lucide-react'
import { getAll } from '@/lib/db/store'
import type { Item } from '@/types'
import { formatINR } from '@/lib/utils/currency'

interface Props {
  onAdd: (item: Item) => void
  onFocusLoss: boolean // triggers refocus
}

export function POSSearch({ onAdd, onFocusLoss }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Refocus mechanism
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
    return () => clearTimeout(focusTimer)
  }, [onFocusLoss])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      e.preventDefault()
      const items = getAll<Item>('items').filter(i => i.is_active && !i.deleted_at)
      
      // Exact barcode match first
      const exactMatch = items.find(i => i.sku.toLowerCase() === query.toLowerCase())
      
      if (exactMatch) {
        onAdd(exactMatch)
        setQuery('')
      } else {
        // Fallback to name search
        const partialMatches = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
        if (partialMatches.length === 1) {
          onAdd(partialMatches[0])
          setQuery('')
        } else if (partialMatches.length > 1) {
          // Open search modal or show dropdown - for now just add first
          onAdd(partialMatches[0])
          setQuery('')
        }
      }
    }
  }

  return (
    <div className="relative mb-4">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-text-secondary">
        <Barcode className="w-5 h-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scan barcode or type item name... (Press Enter)"
        className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all"
        autoFocus
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-secondary font-medium bg-gray-100 px-2 py-1 rounded">
        Always Focused
      </div>
    </div>
  )
}
