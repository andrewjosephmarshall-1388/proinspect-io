'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const inspectionTypes = [
  'Standard Home', 'HVAC', 'Termite/WDO', '4-Point', 'Commercial', 'Roof', 'Wind Mitigation', 'Pool/Spa'
]

export default function NewInspectionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    propertyAddress: '',
    propertyCity: '',
    propertyState: 'TX',
    propertyZip: '',
    inspectionType: 'Standard Home',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    inspectionDate: '',
    totalAmount: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, save to DB and redirect
    router.push('/dashboard/inspections')
  }

  return (
    <div className="new-inspection">
      <div className="page-header">
        <div className="header-left">
          <Link href="/dashboard/inspections" className="back-link">
            <ArrowLeft size={20} />
            Back to Inspections
          </Link>
          <h1 className="page-title">New Inspection</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="inspection-form">
        <div className="form-section">
          <h2>Property Information</h2>
          <div className="form-grid">
            <div className="form-group full">
              <label className="label">Property Address *</label>
              <input type="text" name="propertyAddress" className="input" value={formData.propertyAddress} onChange={handleChange} placeholder="123 Main Street" required />
            </div>
            <div className="form-group">
              <label className="label">City</label>
              <input type="text" name="propertyCity" className="input" value={formData.propertyCity} onChange={handleChange} placeholder="Austin" />
            </div>
            <div className="form-group">
              <label className="label">State</label>
              <select name="propertyState" className="input" value={formData.propertyState} onChange={handleChange}>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="CA">California</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">ZIP Code</label>
              <input type="text" name="propertyZip" className="input" value={formData.propertyZip} onChange={handleChange} placeholder="78701" />
            </div>
            <div className="form-group">
              <label className="label">Inspection Type *</label>
              <select name="inspectionType" className="input" value={formData.inspectionType} onChange={handleChange}>
                {inspectionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Client Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Client Name *</label>
              <input type="text" name="clientName" className="input" value={formData.clientName} onChange={handleChange} placeholder="John Smith" required />
            </div>
            <div className="form-group">
              <label className="label">Client Email *</label>
              <input type="email" name="clientEmail" className="input" value={formData.clientEmail} onChange={handleChange} placeholder="john@email.com" required />
            </div>
            <div className="form-group">
              <label className="label">Client Phone</label>
              <input type="tel" name="clientPhone" className="input" value={formData.clientPhone} onChange={handleChange} placeholder="(512) 555-1234" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Inspection Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="label">Inspection Date</label>
              <input type="date" name="inspectionDate" className="input" value={formData.inspectionDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="label">Fee ($)</label>
              <input type="number" name="totalAmount" className="input" value={formData.totalAmount} onChange={handleChange} placeholder="450" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link href="/dashboard/inspections" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            Create Inspection
          </button>
        </div>
      </form>

      <style jsx>{`
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: var(--gray-500); font-size: 0.875rem; margin-bottom: 0.5rem; }
        .back-link:hover { color: var(--primary); }
        .inspection-form { display: flex; flex-direction: column; gap: 2rem; max-width: 800px; }
        .form-section { background: var(--white); padding: 1.5rem; border-radius: 0.75rem; box-shadow: var(--shadow); }
        .form-section h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--gray-100); }
        .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .form-group { display: flex; flex-direction: column; }
        .form-group.full { grid-column: span 3; }
        .form-actions { display: flex; gap: 1rem; justify-content: flex-end; }
      `}</style>
    </div>
  )
}
