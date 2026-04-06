'use client'

import Link from 'next/link'
import { FileText, DollarSign, Clock, TrendingUp, Plus } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', color: '#2563eb' }}><FileText size={20} /></div>
          <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Total Inspections</span><span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600 }}>47</span></div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ecfdf5', color: '#10b981' }}><DollarSign size={20} /></div>
          <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Revenue (MTD)</span><span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600 }}>$8,450</span></div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffbeb', color: '#f59e0b' }}><Clock size={20} /></div>
          <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Pending Reports</span><span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600 }}>3</span></div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Inspections</h2>
          <Link href="/dashboard/inspections" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}>View all</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { address: '123 Oak Street, Austin, TX', type: 'Standard Home', client: 'Sarah Johnson', status: 'Completed' },
            { address: '456 Maple Ave, Austin, TX', type: '4-Point', client: 'Mike Peters', status: 'In Progress' },
            { address: '789 Pine Road, Austin, TX', type: 'HVAC', client: 'Emily Davis', status: 'Scheduled' },
          ].map((item, i) => (
            <Link key={i} href="/dashboard/inspections/1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
              <div><span style={{ display: 'block', fontWeight: 500, color: '#1f2937' }}>{item.address}</span><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>{item.type} • {item.client}</span></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.75rem', borderRadius: '1rem', background: item.status === 'Completed' ? '#ecfdf5' : item.status === 'In Progress' ? '#eff6ff' : '#fffbeb', color: item.status === 'Completed' ? '#10b981' : item.status === 'In Progress' ? '#2563eb' : '#f59e0b' }}>{item.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
