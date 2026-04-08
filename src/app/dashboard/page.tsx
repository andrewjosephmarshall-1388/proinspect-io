import Link from 'next/link'
import { FileText, DollarSign, Clock, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch inspections count and total revenue
  const { data: inspections } = await supabase
    .from('inspections')
    .select('status, total_amount')
    .order('created_at', { ascending: false })

  const totalInspections = inspections?.length || 0
  const completedInspections = inspections?.filter(i => i.status === 'completed').length || 0
  const pendingReports = inspections?.filter(i => i.status === 'pending_report').length || 0
  const totalRevenue = inspections?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0

  // Fetch recent inspections for the list
  const { data: recentInspections } = await supabase
    .from('inspections')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', color: '#2563eb' }}><FileText size={20} /></div>
          <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Total Inspections</span><span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600 }}>{totalInspections}</span></div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ecfdf5', color: '#10b981' }}><DollarSign size={20} /></div>
          <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Revenue (MTD)</span><span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600 }}>${totalRevenue.toLocaleString()}</span></div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffbeb', color: '#f59e0b' }}><Clock size={20} /></div>
          <div><span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>Pending Reports</span><span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600 }}>{pendingReports}</span></div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Inspections</h2>
          <Link href="/dashboard/inspections" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}>View all</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentInspections?.map((item, i) => (
            <Link key={item.id} href={`/dashboard/inspections/${item.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', borderBottom: i < (recentInspections?.length || 0) - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div>
                <span style={{ display: 'block', fontWeight: 500, color: '#1f2937' }}>
                  {item.property_address}{item.property_city ? `, ${item.property_city}` : ''}
                </span>
                <span style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280' }}>
                  {item.inspection_type} • {item.clients?.name || 'N/A'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.75rem', borderRadius: '1rem', background: item.status === 'completed' ? '#ecfdf5' : item.status === 'scheduled' ? '#eff6ff' : '#fffbeb', color: item.status === 'completed' ? '#10b981' : item.status === 'scheduled' ? '#2563eb' : '#f59e0b' }}>
                {item.status}
              </span>
            </Link>
          ))}
          {(!recentInspections || recentInspections.length === 0) && (
            <p style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No inspections yet. <Link href="/dashboard/inspections/new" style={{ color: '#2563eb' }}>Create one</Link></p>
          )}
        </div>
      </div>
    </div>
  )
}