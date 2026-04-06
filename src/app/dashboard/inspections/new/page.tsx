'use client'
import { useState } from 'react'
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
    if (name === 'propertyZip' && value.length >= 5) {
      fetchZip(value)
    }
    if (['propertyAddress', 'propertyCity', 'propertyState', 'propertyZip'].includes(name)) {
      updateLinks()
    }
  }

  const updateLinks = () => {
    const address = `${form.propertyAddress} ${form.propertyCity} ${form.propertyState} ${form.propertyZip}`.trim()
    if (address.length > 5) {
      const encoded = encodeURIComponent(address)
      setMapUrl(`https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`)
      setZillowUrl(`https://www.zillow.com/homes/${encoded}_rb/`)
    }
  }

  const fetchZip = async (zip: string) => {
    try {
      const resp = await fetch(`https://api.zippopotam.us/us/${zip}`)
      if (resp.ok) {
        const data = await resp.json()
        const place = data.places[0]
        setForm(prev => ({
          ...prev,
          propertyCity: place['place name'],
          propertyState: place['USPS state code']
        }))
        updateLinks()
      }
    } catch (_) {}
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    router.push('/dashboard/inspections')
  }

  const inspectionTypes = ['Standard Home', 'HVAC', 'Termite/WDO', '4-Point', 'Commercial', 'Roof', 'Wind Mitigation', 'Pool/Spa']

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/dashboard/inspections" style={{ display: 'block', marginBottom: '1rem' }}>← Back to Inspections</Link>
      <h1>New Inspection</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        <input name="propertyAddress" placeholder="Address" value={form.propertyAddress} onChange={handleChange} />
        <input name="propertyCity" placeholder="City" value={form.propertyCity} onChange={handleChange} />
        <select name="propertyState" value={form.propertyState} onChange={handleChange}>
          <option value="">Select State / Province</option>
          <optgroup label="United States">
            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </optgroup>
          <optgroup label="Canada">
            {CANADIAN_PROVINCES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </optgroup>
        </select>
        <input name="propertyZip" placeholder="ZIP / Postal" value={form.propertyZip} onChange={handleChange} />
        <select name="inspectionType" value={form.inspectionType} onChange={handleChange}>
          {inspectionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} />
        <input name="clientEmail" placeholder="Client Email" value={form.clientEmail} onChange={handleChange} />
        <button type="submit" style={{ padding: '0.5rem', background: '#2563eb', color: 'white', border: 'none' }}>Create Inspection</button>
      </form>
      {mapUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Location</h2>
          <iframe src={mapUrl} width="100%" height="300" style={{ border: 0 }} loading="lazy"></iframe>
          <p><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.propertyAddress + ' ' + form.propertyCity + ' ' + form.propertyState + ' ' + form.propertyZip)}`} target="_blank" rel="noopener noreferrer">Get Driving Directions</a></p>
          {zillowUrl && <p><a href={zillowUrl} target="_blank" rel="noopener noreferrer">View on Zillow</a></p>}
        </div>
      )}
    </div>
  )
}
