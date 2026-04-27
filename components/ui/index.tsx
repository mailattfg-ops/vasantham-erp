/**
 * Shared UI components for Vasantham ERP
 */
'use client'
import { ReactNode, useState } from 'react'
import { X, AlertTriangle, Search as SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatINR } from '@/lib/utils/currency'

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
interface BtnProps { children: ReactNode; onClick?: () => void; type?: 'button'|'submit'|'reset'; variant?: 'primary'|'secondary'|'danger'|'ghost'; size?: 'sm'|'md'|'lg'; disabled?: boolean; className?: string }
export function Button({ children, onClick, type='button', variant='primary', size='md', disabled, className='' }: BtnProps) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' }
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-text-primary',
    danger: 'bg-danger hover:bg-red-600 text-white',
    ghost: 'hover:bg-gray-100 text-text-secondary hover:text-text-primary',
  }
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-success/10 text-emerald-700',
  paid: 'bg-success/10 text-emerald-700',
  received: 'bg-success/10 text-emerald-700',
  active: 'bg-success/10 text-emerald-700',
  pending: 'bg-warning/10 text-yellow-700',
  partial: 'bg-warning/10 text-yellow-700',
  draft: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-danger/10 text-red-700',
  returned: 'bg-danger/10 text-red-700',
  bounced: 'bg-danger/10 text-red-700',
  cleared: 'bg-success/10 text-emerald-700',
  sent: 'bg-blue-50 text-blue-700',
  accepted: 'bg-success/10 text-emerald-700',
  rejected: 'bg-danger/10 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
  low: 'bg-danger/10 text-red-700',
}
export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status.toLowerCase()] || 'bg-gray-100 text-gray-600'
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>{status}</span>
}

// ── SearchInput ───────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder='Search…' }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size='md' }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm'|'md'|'lg'|'xl'
}) {
  if (!open) return null
  const widths = { sm:'max-w-sm', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} max-h-[90vh] flex flex-col animate-slide-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-text-secondary"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  )
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title?: string; message?: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirm Action'} size="sm">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-danger" />
        </div>
        <p className="text-sm text-text-secondary">{message || 'Are you sure? This action cannot be undone.'}</p>
      </div>
      <div className="flex gap-2 mt-5 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose() }}>Delete</Button>
      </div>
    </Modal>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className='' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl border border-border shadow-card ${className}`}>{children}</div>
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color='text-primary', sub }: {
  label: string; value: string | number; icon: React.ElementType; color?: string; sub?: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-secondary font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color} amount`}>{value}</p>
          {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }: {
  icon?: React.ElementType; title: string; description?: string; action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><Icon className="w-7 h-7 text-text-secondary" /></div>}
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-sm text-text-secondary mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className='' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}
export function TableSkeleton({ rows=5, cols=5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, total, perPage=20, onChange }: {
  page: number; total: number; perPage?: number; onChange: (p: number) => void
}) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span className="text-text-secondary">
        Showing {(page-1)*perPage+1}–{Math.min(page*perPage, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page-1)} disabled={page===1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-text-secondary">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i+1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium ${p===page ? 'bg-primary text-white' : 'hover:bg-gray-100 text-text-secondary'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(page+1)} disabled={page===pages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-text-secondary">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, className='', ...props }: {
  label?: string; error?: string; className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <input {...props} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${error ? 'border-danger' : 'border-border'} ${className}`} />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className='', ...props }: {
  label?: string; error?: string; children: ReactNode; className?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <select {...props} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white ${error ? 'border-danger' : 'border-border'} ${className}`}>
        {children}
      </select>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className='', ...props }: {
  label?: string; error?: string; className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <textarea {...props} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none ${error ? 'border-danger' : 'border-border'} ${className}`} />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  )
}
