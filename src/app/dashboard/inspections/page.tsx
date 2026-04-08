import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function InspectionsPage() {
  const supabase = await createClient()
  
  const { data: inspections } = await supabase
    .from('inspections')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Inspections</h1>
        <Link href="/dashboard/inspections/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white' }}><Plus size={18} />New Inspection</Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Property</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Client</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {inspections?.map((insp) => (
              <tr key={insp.id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <Link href={`/dashboard/inspections/${insp.id}`} style={{ fontWeight: 500 }}>
                    {insp.property_address}{insp.property_city ? `, ${insp.property_city}` : ''}{insp.property_state ? `, ${insp.property_state}` : ''}
                  </Link>
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{insp.inspection_type}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{insp.clients?.name || 'N/A'}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.75rem', borderRadius: '1rem', background: insp.status === 'completed' ? '#ecfdf5' : '#eff6ff', color: insp.status === 'completed' ? '#10b981' : '#2563eb' }}>
                    {insp.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>${insp.total_amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!inspections || inspections.length === 0) && (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No inspections yet. Create your first one!</p>
        )}
      </div>
    </div>
  )
}