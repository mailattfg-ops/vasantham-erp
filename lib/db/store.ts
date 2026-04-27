/**
 * Mock database using localStorage for demo purposes.
 * Mimics Supabase interface — swap with real Supabase client when ready.
 */

import type {
  Category, Item, Vendor, Sale, Purchase, Employee,
  ChartOfAccount, Barcode, HeldBill, POSSession
} from '@/types'

// ── helpers ──────────────────────────────────────────────────────────────────

const LS = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback
    try {
      const raw = localStorage.getItem(`vas_${key}`)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch { return fallback }
  },
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(`vas_${key}`, JSON.stringify(value))
  },
}

export function getAll<T>(key: string): T[] { return LS.get<T[]>(key, []) }
export function saveAll<T>(key: string, data: T[]): void { LS.set(key, data) }
export function getById<T extends { id: string }>(key: string, id: string): T | null {
  return getAll<T>(key).find(r => r.id === id) ?? null
}
export function upsert<T extends { id: string }>(key: string, record: T): T {
  const all = getAll<T>(key)
  const idx = all.findIndex(r => r.id === record.id)
  if (idx >= 0) all[idx] = record; else all.push(record)
  saveAll(key, all)
  return record
}
export function softDelete<T extends { id: string; deleted_at?: string }>(
  key: string, id: string
): void {
  const all = getAll<T>(key)
  const idx = all.findIndex(r => r.id === id)
  if (idx >= 0) { (all[idx] as { deleted_at?: string }).deleted_at = new Date().toISOString(); saveAll(key, all) }
}
export function nextSeq(key: string): number {
  const n = LS.get<number>(`seq_${key}`, 0) + 1
  LS.set(`seq_${key}`, n)
  return n
}
export function isSeeded(): boolean { return LS.get<boolean>('seeded', false) }
export function markSeeded(): void { LS.set('seeded', true) }
