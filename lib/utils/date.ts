/**
 * @file lib/utils/date.ts
 * Date formatting utilities — always display in IST (UTC+5:30)
 * Uses date-fns for formatting
 */

import { format, parseISO, isValid } from 'date-fns'

/** IST offset in minutes */
const IST_OFFSET = 330

/**
 * Converts a UTC date string/Date to IST Date object
 */
function toIST(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date
  return new Date(d.getTime() + IST_OFFSET * 60 * 1000)
}

/**
 * Formats a date to DD/MM/YYYY (IST)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(toIST(d), 'dd/MM/yyyy')
}

/**
 * Formats a date to DD/MM/YYYY HH:mm in 24-hour format (IST)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(toIST(d), 'dd/MM/yyyy HH:mm')
}

/**
 * Returns today's date as a YYYY-MM-DD string (for input[type=date])
 */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Returns a human-friendly relative label like "Today", "Yesterday", or the date
 */
export function relativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  const today = format(new Date(), 'yyyy-MM-dd')
  const dateStr = format(d, 'yyyy-MM-dd')
  if (dateStr === today) return 'Today'
  const yesterday = format(
    new Date(Date.now() - 86400000),
    'yyyy-MM-dd'
  )
  if (dateStr === yesterday) return 'Yesterday'
  return formatDate(d)
}
