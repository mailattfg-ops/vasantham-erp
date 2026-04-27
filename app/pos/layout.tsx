/**
 * POS Layout
 * Full screen, no sidebar
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'POS Terminal | Vasantham ERP',
}

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pos-layout bg-gray-100">
      {children}
    </div>
  )
}
