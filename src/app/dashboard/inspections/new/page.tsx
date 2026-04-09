'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' }, { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington D.C.' }
]

const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' }, { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' }, { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' }, { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' }, { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon Territory' }
]

export default function NewInspectionPage() {
  const router = useRouter()
  const [lookingUp, setLookingUp] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [form, setForm] = useState({
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    inspectionType: 'Standard Home',
    clientName: '',
    clientEmail: ''
  })
  const [mapUrl, setMapUrl] = useState('')
  const [zillowUrl, setZillowUrl] = useState('')

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Auto-populate city and state when zip is entered
    if (name === 'propertyZip' && value.length >= 5) {
      lookupZip(value)
    }
    
    // Update map and Zillow links
    if (['propertyAddress', 'propertyCity', 'propertyState', 'propertyZip'].includes(name)) {
      updateLinks()
    }
  }

  useEffect(() => {
    // Load templates for selection
    const loadTemplates = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('inspection_templates').select('*')
      if (!error && data) setTemplates(data)
    }
    loadTemplates()
  }, [])

  const lookupZip = async (zip: string) => {
    setLookingUp(true)
    try {
      // Try US first
      let resp = await fetch(`https://api.zippopotam.us/us/${zip}`)
      if (resp.ok) {
        const data = await resp.json()
        const place = data.places[0]
        setForm(prev => ({
          ...prev,
          propertyCity: place['place name'],
          propertyState: place['USPS state code']
        }))
        updateLinks()
        setLookingUp(false)
        return
      }
      
      // Try Canada
      resp = await fetch(`https://api.zippopotam.us/ca/${zip}`)
      if (resp.ok) {
        const data = await resp.json()
        const place = data.places[0]
        setForm(prev => ({
          ...prev,
          propertyCity: place['place name'],
          propertyState: place['admin code 1']
        }))
        updateLinks()
        setLookingUp(false)
        return
      }
    } catch (e) {
      console.log('Zip lookup failed:', e)
    }
    setLookingUp(false)
  }

  const updateLinks = () => {
    const address = `${form.propertyAddress} ${form.propertyCity} ${form.propertyState} ${form.propertyZip}`.trim()
    if (address.length > 5) {
      const encoded = encodeURIComponent(address)
      setMapUrl(`https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`)
      setZillowUrl(`https://www.zillow.com/homes/${encoded}_rb/`)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      
      if (data.success) {
        router.push('/dashboard/inspections')
      } else {
        alert('Error saving inspection: ' + data.error)
      }
    } catch (err) {
      console.error('Failed to save:', err)
      alert('Failed to save inspection')
    }
  }

  const inspectionTypes = ['Standard Home', 'HVAC', 'Termite/WDO', '4-Point', 'Commercial', 'Roof', 'Wind Mitigation', 'Pool/Spa']

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/dashboard/inspections" style={{ display: 'block', marginBottom: '1rem', color: '#6b7280' }}>← Back to Inspections</Link>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>New Inspection</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        {/* Property Address */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Property Address</h2>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Property Address</h2>
          <input 
            name="propertyAddress" 
            placeholder="Street Address" 
            value={form.propertyAddress} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <input 
              name="propertyCity" 
              placeholder="City" 
              value={form.propertyCity} 
              onChange={handleChange}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
            />
            <div>
              <select 
                name="propertyState" 
                value={form.propertyState} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              >
                <option value="">State</option>
                <optgroup label="United States">
                  {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                </optgroup>
                <optgroup label="Canada">
                  {CANADIAN_PROVINCES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                </optgroup>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                name="propertyZip" 
                placeholder={lookingUp ? "Looking up..." : "ZIP Code"} 
                value={form.propertyZip} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                disabled={lookingUp}
              />
              {lookingUp && <span style={{ position: 'absolute', right: '8px', top: '8px', fontSize: '0.75rem', color: '#2563eb' }}>⏳</span>}
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            💡 Enter a ZIP code to auto-fill city and state
          </p>
        </div>

        {/* Template Selection */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Select Template</h2>
          <select
            name="selectedTemplateId"
            value={selectedTemplateId}
            onChange={e => setSelectedTemplateId(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
          >
            <option value="">-- Choose a template (optional) --</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.inspection_type})</option>
            ))}
          </select>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Inspection Details</h2>
          <select 
            name="inspectionType" 
            value={form.inspectionType} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
          >
            {inspectionTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Client Information</h2>
          <input 
            name="clientName" 
            placeholder="Client Name" 
            value={form.clientName} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
          />
          <input 
            name="clientEmail" 
            placeholder="Client Email" 
            value={form.clientEmail} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            href="/dashboard/inspections" 
            style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: '1px solid #d1d5db', background: '#fff', textDecoration: 'none' }}
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}
          >
            Create Inspection
          </button>
        </div>
      </form>

      {mapUrl && (
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Location & Property Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <iframe src={mapUrl} width="100%" height="250" style={{ border: 0, borderRadius: '0.25rem' }} loading="lazy"></iframe>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.propertyAddress + ' ' + form.propertyCity + ' ' + form.propertyState + ' ' + form.propertyZip)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.5rem', color: '#2563eb', textDecoration: 'none' }}
              >
                🚗 Get Driving Directions
              </a>
            </div>
            <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Property Details</p>
              <a 
                href={zillowUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#006aff', color: 'white', borderRadius: '0.25rem', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                🏠 View on Zillow
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}