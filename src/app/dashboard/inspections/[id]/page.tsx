'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

export default function InspectionDetailPage() {
  const params = useParams()
  const [inspection, setInspection] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [completedItems, setCompletedItems] = useState<any[]>([])
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
      // ... existing code unchanged ...
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
      // Store completed items locally for PDF generation
      setCompletedItems(items)
      setSaving(false)
      alert('Report saved!')
    }

    // Generate a PDF report using @react-pdf/renderer
    const generatePdf = async () => {
      // ... existing generatePdf code ...
      if (!inspection) return
      // Simple PDF layout
      const MyDoc = () => (
        <Document>
          <Page style={styles.page}>
            <View>
              <Text style={styles.title}>Inspection Report</Text>
              <Text>Property: {inspection.property_address}</Text>
              <Text>Client: {inspection.clients?.name || '—'}</Text>
              <Text>Date: {new Date().toLocaleDateString()}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              {completedItems.map((it, i) => (
                <View key={i} style={styles.item}>
                  <Text style={styles.itemCategory}>{it.category}</Text>
                  <Text>{it.item_text}</Text>
                  <Text>Condition: {it.condition || '—'}</Text>
                  <Text>Notes: {it.notes || ''}</Text>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      )

      const blob = await pdf(renderMyDoc()).toBlob()
      const url = URL.createObjectURL(blob)
      // Open PDF in new tab
      window.open(url, '_blank')
    }

    const styles = StyleSheet.create({
      page: { padding: 30 },
      title: { fontSize: 24, marginBottom: 12 },
      item: { marginBottom: 10 },
      itemCategory: { fontWeight: 'bold' }
    })

    // Render function for the PDF document (used by generatePdf and emailReport)
    const renderMyDoc = () => (
      <Document>
        <Page style={styles.page}>
          <View>
            <Text style={styles.title}>Inspection Report</Text>
            <Text>Property: {inspection?.property_address}</Text>
            <Text>Client: {inspection?.clients?.name || '—'}</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            {completedItems.map((it, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemCategory}>{it.category}</Text>
                <Text>{it.item_text}</Text>
                <Text>Condition: {it.condition || '—'}</Text>
                <Text>Notes: {it.notes || ''}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    )

    // Create an invoice record in Supabase (placeholder amount $150)
    const createInvoice = async () => {
      if (!inspection) return
      const supabase = createClient()
      const { data, error } = await supabase.from('invoices').insert({
        user_id: inspection.user_id,
        client_id: inspection.client_id,
        inspection_id: inspection.id,
        amount: 150,
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }).select().single()
      if (error) {
        console.error('Invoice error', error)
        return null
      }
      return data
    }

    // Send email with PDF URL (placeholder – just logs)
    const emailReport = async (pdfUrl: string) => {
      if (!inspection) return
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: inspection.clients?.email || 'client@example.com',
          subject: `Inspection Report for ${inspection.property_address}`,
          html: `<p>Please find your inspection report attached.</p><p><a href="${pdfUrl}">View PDF</a></p>`
        })
      })
      const result = await response.json()
      if (!result.success) {
        console.error('Email send failed', result)
      }
    }

    // After saving report, you can call these functions manually from UI (e.g., add buttons later)
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
            <button 
              onClick={generatePdf}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              📄 Generate PDF
            </button>
            <button 
              onClick={async () => {
                const invoice = await createInvoice()
                if (invoice) alert('Invoice created (ID: ' + invoice.id + ')')
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#10b981', color: 'white', border: 'none', marginLeft: '0.5rem', cursor: 'pointer' }}
            >
              💰 Create Invoice
            </button>
            <button 
              onClick={async () => {
                // Generate PDF first to get URL then email
                const blob = await pdf(renderMyDoc()).toBlob()
                const url = URL.createObjectURL(blob)
                await emailReport(url)
                alert('Email sent')
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.25rem', background: '#2563eb', color: 'white', border: 'none', marginLeft: '0.5rem', cursor: 'pointer' }}
            >
              📧 Email Report
            </button>
          </div>
        )}
      </div>
    )
}