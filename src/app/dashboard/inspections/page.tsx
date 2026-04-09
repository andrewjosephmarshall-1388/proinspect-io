'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, CheckCircle, Clock, DollarSign, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchInspections()
  }, [])

  async function fetchInspections() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('inspections')
      .select('*, clients(name)')
      .order('created_at', { ascending: false })

    if (data) setInspections(data)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#ecfdf5', color: '#10b981' }
      case 'scheduled': return { bg: '#eff6ff', color: '#2563eb' }
      case 'in_progress': return { bg: '#fffbeb', color: '#f59e0b' }
      case 'pending_report': return { bg: '#fef3c7', color: '#d97706' }
      default: return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Inspections</h1>
        <Link 
          href="/dashboard/inspections/new"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white' }}
        >
          <Plus size={18} />New Inspection
        </Link>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, display: 'block' }}>{inspections.length}</span>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, display: 'block' }}>{inspections.filter(i => i.status === 'completed').length}</span>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Scheduled</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, display: 'block' }}>{inspections.filter(i => i.status === 'scheduled').length}</span>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Revenue (Est)</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, display: 'block' }}>${inspections.reduce((sum, i) => sum + (i.total_amount || 0), 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Property</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Client</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((insp) => {
              const statusStyle = getStatusColor(insp.status)
              return (
                <tr key={insp.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/dashboard/inspections/${insp.id}`} style={{ fontWeight: 500, color: '#1f2937' }}>
                      {insp.property_address}
                    </Link>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {insp.property_city}{insp.property_state && `, ${insp.property_state}`} {insp.property_zip}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{insp.inspection_type}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>{insp.clients?.name || 'N/A'}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem', color: '#6b7280' }}>
                    {insp.scheduled_date ? new Date(insp.scheduled_date).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.75rem', borderRadius: '1rem', background: statusStyle.bg, color: statusStyle.color }}>
                      {insp.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>${insp.total_amount || 0}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link 
                      href={`/dashboard/inspections/${insp.id}`}
                      style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}
                    >
                      {insp.status === 'completed' ? 'View Report' : 'Continue'}
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!inspections || inspections.length === 0) && (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No inspections yet. Create your first one!</p>
        )}
      </div>
    </div>
  )
}