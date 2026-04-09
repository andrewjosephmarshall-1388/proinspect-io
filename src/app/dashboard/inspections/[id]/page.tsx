'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function InspectionDetailPage() {
  const params = useParams()
  const [inspection, setInspection] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
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
        // Fetch template items for this inspection type
        fetchTemplateItems(data.inspection_type)
      }
      setLoading(false)
    }

    if (params.id) {
      fetchInspection()
    }
  }, [params.id])
    
    async function fetchTemplateItems(inspectionType: string) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('id')
        .eq('inspection_type', inspectionType)
        .single()
      if (error || !data) {
        console.error('No template for type', inspectionType)
        setItems([])
        return
      }
      // Get items for that template
      const { data: tmplItems, error: itemsErr } = await supabase
        .from('inspection_items')
        .select('id, category, item_text, condition, notes')
        .eq('template_id', data.id)
        .order('sort_order')
      if (!itemsErr && tmplItems) {
        // Clone items for editing (add localId for tracking)
        const cloned = tmplItems.map((it:any) => ({ ...it, localId: Math.random().toString(36).substr(2,9) }))
        setItems(cloned)
      } else {
        setItems([])
      }
    }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>
  if (!inspection) return <div style={{ padding: '2rem' }}>Inspection not found</div>

  async function saveReport() {
      setSaving(true)
      const supabase = createClient()
      // Delete existing items for this inspection (if any)
      await supabase.from('inspection_items').delete().eq('inspection_id', inspection.id)
      // Insert new items
      const inserts = items.map(it => ({
        inspection_id: inspection.id,
        template_id: it.template_id,
        category: it.category,
        item_text: it.item_text,
        condition: it.condition,
        notes: it.notes,
        sort_order: 0 // simple ordering
      }))
      if (inserts.length > 0) {
        await supabase.from('inspection_items').insert(inserts)
      }
      // Update inspection status to completed
      await supabase.from('inspections').update({ status: 'completed' }).eq('id', inspection.id)
      setSaving(false)
      alert('Report saved!')
    }

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
        {/* Report Editor */}
        {inspection.status !== 'completed' && (
          <div style={{ marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Report Builder</h2>
            {items.map((it, idx) => (
              <div key={it.localId} style={{ marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                <p style={{ fontWeight: 500 }}>{it.category} – {it.item_text}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    value={it.condition || ''}
                    onChange={e => {
                      const newItems = [...items]
                      newItems[idx].condition = e.target.value
                      setItems(newItems)
                    }}
                    style={{ padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
                  >
                    <option value="">Condition</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="n/a">N/A</option>
                  </select>
                  <textarea
                    placeholder="Notes"
                    value={it.notes || ''}
                    onChange={e => {
                      const newItems = [...items]
                      newItems[idx].notes = e.target.value
                      setItems(newItems)
                    }}
                    rows={2}
                    style={{ width: '100%', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={saveReport}
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#2563eb', color: 'white', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? <Clock size={14} /> : <CheckCircle size={14} />} {saving ? 'Saving...' : 'Save Report'}
            </button>
          </div>
        )}
        {inspection.status === 'completed' && (
          <div style={{ marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Completed Report</h2>
            <p>Report has been saved. You can view the details in the PDF export (coming soon).</p>
          </div>
        )}
      </div>
    )
}