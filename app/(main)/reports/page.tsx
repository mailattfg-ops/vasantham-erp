/**
 * Reports Hub
 */
import Link from 'next/link'
import { PageHeader, Card } from '@/components/ui'
import { BarChart2, DollarSign, Package, FileText, ArrowRight } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    { title: 'Sales Report', icon: DollarSign, desc: 'Daily, weekly, and monthly sales summary with tax breakup.', color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Purchase Report', icon: Package, desc: 'Vendor-wise purchase history and outstanding payables.', color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'Stock Report', icon: BarChart2, desc: 'Current inventory valuation and low stock alerts.', color: 'text-success', bg: 'bg-success/10' },
    { title: 'GST GSTR-3B', icon: FileText, desc: 'Monthly summary of outward and inward supplies for GST filing.', color: 'text-danger', bg: 'bg-danger/10' },
  ]

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Generate business and compliance reports" />
      
      <div className="grid grid-cols-2 gap-6">
        {reports.map(r => (
          <Card key={r.title} className="p-6 hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.bg}`}>
                <r.icon className={`w-6 h-6 ${r.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary text-lg group-hover:text-primary transition-colors">{r.title}</h3>
                <p className="text-sm text-text-secondary mt-1 mb-4">{r.desc}</p>
                <div className="flex items-center text-sm font-medium text-primary">
                  View Report <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
