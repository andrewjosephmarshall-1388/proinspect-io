'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewInspectionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ propertyAddress: '', propertyCity: '', propertyState: 'TX', propertyZip: '', inspectionType: 'Standard Home', clientName: '', clientEmail: '', clientPhone: '', inspectionDate: '', totalAmount: '' })

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = (e: any) => { e.preventDefault(); router.push('/dashboard/inspections') }

  const inspectionTypes = ['Standard Home', 'HVAC', 'Termite/WDO', '4-Point', 'Commercial', 'Roof', 'Wind Mitigation', 'Pool/Spa']

  return (
    <div>
      <Link href="/dashboard/inspections" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>← Back to Inspections</Link>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>New Inspection</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Property Information</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Property Address *</label><input name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} placeholder="123 Main Street" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>City</label><input name="propertyCity" value={formData.propertyCity} onChange={handleChange} placeholder="Austin" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
              <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>State</label><select name="propertyState" value={formData.propertyState} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}><option value="TX">Texas</option></select></div>
              <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>ZIP</label><input name="propertyZip" value={formData.propertyZip} onChange={handleChange} placeholder="78701" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            </div>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Inspection Type</label><select name="inspectionType" value={formData.inspectionType} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}>{inspectionTypes.map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Client Information</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Client Name</label><input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="John Smith" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Client Email</label><input name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="john@email.com" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard/inspections" style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: '1px solid #d1d5db', background: '#fff' }}>Cancel</Link>
          <button type="submit" style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white' }}>Create Inspection</button>
        </div>
      </form>
    </div>
  )
}
