'use client'
import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    inspectionType: 'Standard Home',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    inspectionDate: '',
    totalAmount: ''
  })

  const [mapUrl, setMapUrl] = useState('')
  const [zillowUrl, setZillowUrl] = useState('')

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (name === 'propertyZip' && value.length >= 5) {
      fetchCityStateFromZip(value)
    }
    
    // Update map and Zillow links when address changes
    if (name === 'propertyAddress' || name === 'propertyCity' || name === 'propertyState' || name === 'propertyZip') {
      updateLinks()
    }
  }

  const updateLinks = () => {
    const address = `${formData.propertyAddress} ${formData.propertyCity} ${formData.propertyState} ${formData.propertyZip}`.trim()
    if (address.length > 5) {
      const encodedAddress = encodeURIComponent(address)
      // Simple Google Maps embed that opens search for address
      setMapUrl(`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`)
      setZillowUrl(`https://www.zillow.com/homes/${encodedAddress}_rb/`)
    }
  }

  const fetchCityStateFromZip = async (zip: string) => {
    setLoading(true)
    try {
      const usResponse = await fetch(`https://api.zippopotam.us/us/${zip}`)
      if (usResponse.ok) {
        const data = await usResponse.json()
        const place = data.places[0]
        setFormData(prev => ({
          ...prev,
          propertyCity: place['place name'],
          propertyState: place['USPS state code']
        }))
        updateLinks()
        setLoading(false)
        return
      }
      
      const caResponse = await fetch(`https://api.zippopotam.us/ca/${zip}`)
      if (caResponse.ok) {
        const data = await caResponse.json()
        const place = data.places[0]
        setFormData(prev => ({
          ...prev,
          propertyCity: place['place name'],
          propertyState: place['admin code 1']
        }))
        updateLinks()
        setLoading(false)
        return
      }
    } catch (error) {
      console.log('Zip code lookup failed:', error)
    }
    setLoading(false)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    router.push('/dashboard/inspections')
  }

  const inspectionTypes = ['Standard Home', 'HVAC', 'Termite/WDO', '4-Point', 'Commercial', 'Roof', 'Wind Mitigation', 'Pool/Spa']

  return (
    <div>
      <Link href="/dashboard/inspections" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>← Back to Inspections</Link>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>New Inspection</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Property Information</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Property Address *</label><input name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} placeholder="123 Main Street" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>City</label><input name="propertyCity" value={formData.propertyCity} onChange={handleChange} placeholder="Austin" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
              <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>State/Province {loading && <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>(looking up...)</span></label>
                <select name="propertyState" value={formData.propertyState} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}>
                  <option value="">Select State</option>
                  <optgroup label="United States">
                    {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </optgroup>
                  <optgroup label="Canada">
                    {CANADIAN_PROVINCES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </optgroup>
                </select>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>ZIP/Postal Code</label><input name="propertyZip" value={formData.propertyZip} onChange={handleChange} placeholder="78701" style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} /></div>
            </div>
            <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Inspection Type</label><select name="inspectionType" value={formData.inspectionType} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}>{inspectionTypes.map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
        </div>

        {/* Map and Property Links */}
        {mapUrl && (
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Location & Property Info</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Google Map */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Map</label>
                <iframe
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  loading="lazy"
                  allowFullScreen
                  src={mapUrl}
                ></iframe>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formData.propertyAddress + ' ' + formData.propertyCity + ' ' + formData.propertyState + ' ' + formData.propertyZip)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: '0.5rem', color: '#2563eb', fontSize: '0.875rem' }}
                >
                  🚗 Get Driving Directions
                </a>
              </div>
              
              {/* Zillow Property Link */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Property Details</label>
                <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', minHeight: '300px' }}>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>View property details on Zillow</p>
                  <a 
                    href={zillowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#006aff', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 500 }}
                  >
                    🏠 View on Zillow
                  </a>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    See estimated value, property history, and details
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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