'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function InspectionDetailPage() {
  const params = useParams()
  const [inspection, setInspection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInspection = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('inspections')
        .select('*, clients(*)')
        .eq('id', params.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setInspection(data)
      }
      setLoading(false)
    }

    if (params.id) {
      fetchInspection()
    }
  }, [params.id])

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>
  if (!inspection) return <div style={{ padding: '2rem' }}>Inspection not found</div>

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/dashboard/inspections" style={{ display: 'block', marginBottom: '1rem', color: '#6b7280' }}>← Back to Inspections</Link>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          {inspection.property_address}
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>City</p>
            <p style={{ fontWeight: 500 }}>{inspection.property_city || '-'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>State</p>
            <p style={{ fontWeight: 500 }}>{inspection.property_state || '-'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>ZIP</p>
            <p style={{ fontWeight: 500 }}>{inspection.property_zip || '-'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Type</p>
            <p style={{ fontWeight: 500 }}>{inspection.inspection_type}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status</p>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.75rem', borderRadius: '1rem', background: '#eff6ff', color: '#2563eb' }}>
              {inspection.status}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Client</p>
            <p style={{ fontWeight: 500 }}>{inspection.clients?.name || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}