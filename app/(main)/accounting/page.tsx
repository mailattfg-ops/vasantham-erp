/**
 * Chart of Accounts
 */
'use client'
import { useMemo } from 'react'
import { PageHeader, Card } from '@/components/ui'
import { getAll } from '@/lib/db/store'
import { formatINR } from '@/lib/utils/currency'
import type { ChartOfAccount } from '@/types'

export default function AccountingPage() {
  const accounts = useMemo(() => getAll<ChartOfAccount>('chart_of_accounts').sort((a,b) => a.code.localeCompare(b.code)), [])

  const grouped = {
    asset: accounts.filter(a => a.type === 'asset'),
    liability: accounts.filter(a => a.type === 'liability'),
    income: accounts.filter(a => a.type === 'income'),
    expense: accounts.filter(a => a.type === 'expense'),
    capital: accounts.filter(a => a.type === 'capital'),
  }

  return (
    <div>
      <PageHeader title="Chart of Accounts" subtitle="Manage accounting ledgers and current balances" />

      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(type => (
          <Card key={type} className="p-0 overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-text-primary capitalize">{type}s</h3>
              <span className="text-xs font-bold text-text-secondary">{grouped[type].length} A/C</span>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-border">
                {grouped[type].map(acc => (
                  <tr key={acc.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 w-16 text-xs font-mono text-text-secondary">{acc.code}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {acc.name}
                      {acc.is_system && <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-1 rounded">SYS</span>}
                    </td>
                    <td className="px-4 py-3 text-right amount font-medium">{formatINR(acc.current_balance)}</td>
                  </tr>
                ))}
                {grouped[type].length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-text-secondary text-xs">No accounts found</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        ))}
      </div>
    </div>
  )
}
